"""
logger.py — Structured application logger for NetScope backend.

Usage:
    from backend.logger import log
    log.info("capture", "Capture started", session_id="20240101_120000", username="admin")
    log.warning("sniffer", "Invalid BPF filter ignored", detail="filter=foo")
    log.error("api", "Unexpected error", detail=str(exc))
"""

from backend.database import write_log


class _Logger:
    SOURCE = "backend"

    def _write(self, level: str, category: str, message: str,
                detail: str = "", session_id: str = "", username: str = "") -> None:
        try:
            write_log(
                source     = self.SOURCE,
                level      = level,
                category   = category,
                message    = message,
                detail     = detail,
                session_id = session_id,
                username   = username,
            )
        except Exception:
            # Never let logging errors crash the app
            pass

    def debug(self, category: str, message: str, **kw) -> None:
        self._write("DEBUG", category, message, **kw)

    def info(self, category: str, message: str, **kw) -> None:
        self._write("INFO", category, message, **kw)

    def warning(self, category: str, message: str, **kw) -> None:
        self._write("WARNING", category, message, **kw)

    def error(self, category: str, message: str, **kw) -> None:
        self._write("ERROR", category, message, **kw)


log = _Logger()
