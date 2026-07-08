"""
auth.py — Authentication for NetScope.

Design:
  - Passwords hashed with bcrypt (work factor 12).
  - Sessions stored server-side in an in-memory dict keyed by a
    cryptographically random 32-byte token.
  - Token comparison uses secrets.compare_digest (timing-safe).
  - Tokens expire after TOKEN_TTL_SECONDS of inactivity.
  - On first run (no users in DB), a setup endpoint allows creating the
    first admin account — it is disabled once any user exists.

No JWT, no third-party auth libraries required beyond bcrypt.
"""

import hashlib
import os
import secrets
import time
from typing import Optional

import bcrypt  # type: ignore

from backend.database import (
    create_user,
    get_user,
    update_last_login,
    user_count,
)

# ── Token store (in-memory) ──────────────────────────────────────────── #
# { token: {"username": str, "expires_at": float} }
_sessions: dict[str, dict] = {}

TOKEN_TTL_SECONDS = 8 * 60 * 60   # 8 hours
TOKEN_BYTES       = 32             # 256-bit token


# ── Password helpers ─────────────────────────────────────────────────── #

def hash_password(plaintext: str) -> str:
    return bcrypt.hashpw(plaintext.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(plaintext: str, stored_hash: str) -> bool:
    try:
        return bcrypt.checkpw(plaintext.encode(), stored_hash.encode())
    except Exception:
        return False


# ── Session helpers ──────────────────────────────────────────────────── #

def _purge_expired() -> None:
    now = time.time()
    expired = [t for t, v in _sessions.items() if v["expires_at"] < now]
    for t in expired:
        del _sessions[t]


def create_session(username: str) -> str:
    _purge_expired()
    token = secrets.token_hex(TOKEN_BYTES)
    _sessions[token] = {
        "username":   username,
        "expires_at": time.time() + TOKEN_TTL_SECONDS,
    }
    return token


def validate_token(token: str) -> Optional[str]:
    """Return the username if the token is valid, else None."""
    _purge_expired()
    # Use compare_digest to prevent timing attacks
    for stored_token, data in _sessions.items():
        if secrets.compare_digest(stored_token, token):
            # Slide expiry on activity
            data["expires_at"] = time.time() + TOKEN_TTL_SECONDS
            return data["username"]
    return None


def revoke_token(token: str) -> None:
    _sessions.pop(token, None)


# ── Public auth actions ───────────────────────────────────────────────── #

def login(username: str, password: str) -> tuple[bool, str]:
    """
    Returns (success, token_or_error_message).
    Brute-force window: we do NOT rate-limit here — the API layer
    should enforce that if needed.
    """
    user = get_user(username)
    if user is None:
        # Perform a dummy hash to prevent username enumeration via timing
        bcrypt.checkpw(b"dummy", bcrypt.hashpw(b"dummy", bcrypt.gensalt(rounds=12)))
        return False, "Invalid credentials"

    if not verify_password(password, user["password_hash"]):
        return False, "Invalid credentials"

    update_last_login(username)
    token = create_session(username)
    return True, token


def register_first_user(username: str, password: str) -> tuple[bool, str]:
    """Only allowed when no users exist yet (initial setup)."""
    if user_count() > 0:
        return False, "Setup already complete"
    if len(username) < 3 or len(username) > 32:
        return False, "Username must be 3–32 characters"
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    hashed = hash_password(password)
    ok = create_user(username, hashed)
    if not ok:
        return False, "Username already taken"
    return True, "Account created"
