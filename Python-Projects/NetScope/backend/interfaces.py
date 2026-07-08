"""
interfaces.py — Enumerate available network interfaces using Scapy.

Security note: interface names are enumerated server-side from the OS.
The API only returns names that actually exist — the start endpoint then
validates the client-supplied name against this same list, so no arbitrary
string can ever be passed to scapy's sniff(iface=...).
"""

import re
from typing import Optional

from scapy.arch import get_if_list          # type: ignore
from scapy.interfaces import IFACES         # type: ignore


def _classify(name: str, desc: str) -> str:
    """Return a human-readable interface type based on name / description patterns."""
    n = name.lower()
    d = desc.lower()
    if any(x in n for x in ("lo", "loopback")):
        return "Loopback"
    if any(x in n for x in ("wlan", "wi-fi", "wifi", "wireless", "airport")) or \
       any(x in d for x in ("wi-fi", "wireless", "wifi", "802.11")):
        return "Wi-Fi"
    if any(x in n for x in ("eth", "en", "ether")):
        return "Ethernet"
    if any(x in n for x in ("docker", "br-", "virbr", "vmnet", "veth")):
        return "Virtual"
    if "vpn" in n or "tun" in n or "tap" in n:
        return "VPN / Tunnel"
    return "Other"


def get_interfaces() -> list[dict]:
    """
    Return a list of available network interfaces with metadata.
    Each dict has: name, description, mac, ip, iface_type.
    Loopback interfaces are included but marked accordingly.
    """
    results: list[dict] = []
    seen: set[str] = set()

    # Primary source: scapy IFACES (richest metadata)
    try:
        for iface_name, iface_obj in IFACES.items():
            name = getattr(iface_obj, "name", iface_name) or iface_name
            if name in seen:
                continue
            seen.add(name)

            mac  = getattr(iface_obj, "mac",         "") or ""
            ip   = getattr(iface_obj, "ip",          "") or ""
            desc = getattr(iface_obj, "description", "") or name

            results.append({
                "name":       name,
                "description": desc,
                "mac":        mac,
                "ip":         ip,
                "iface_type": _classify(name, desc),
            })
    except Exception:
        pass

    # Fallback: get_if_list() for any interfaces IFACES missed
    try:
        for name in get_if_list():
            if name in seen:
                continue
            seen.add(name)
            results.append({
                "name":       name,
                "description": name,
                "mac":        "",
                "ip":         "",
                "iface_type": _classify(name, ""),
            })
    except Exception:
        pass

    # Sort: Ethernet first, then Wi-Fi, then others, loopback last
    ORDER = {"Ethernet": 0, "Wi-Fi": 1, "Virtual": 2, "VPN / Tunnel": 3, "Other": 4, "Loopback": 5}
    results.sort(key=lambda x: ORDER.get(x["iface_type"], 9))
    return results


def is_valid_interface(name: str) -> bool:
    """Return True only if `name` is a real interface on this machine."""
    available = {iface["name"] for iface in get_interfaces()}
    return name in available
