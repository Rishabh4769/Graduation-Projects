"""
report.py — PDF report generation for a NetScope session.
"""

import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle,
    Paragraph, Spacer, PageBreak,
)
from reportlab.lib.enums import TA_CENTER

from backend.database import get_packets, get_alerts, get_port_usage, get_session_summary  # noqa: E402


# ── Palette (professional neutral palette, no neon) ────────────────────── #
_SLATE_DARK   = colors.HexColor("#1E2533")
_SLATE_MID    = colors.HexColor("#2C3547")
_SLATE_LIGHT  = colors.HexColor("#3D4D66")
_ACCENT_BLUE  = colors.HexColor("#3A7BD5")
_ACCENT_RED   = colors.HexColor("#C0392B")
_ACCENT_TEAL  = colors.HexColor("#1A8A7B")
_TEXT_LIGHT   = colors.HexColor("#ECF0F1")
_TEXT_MUTED   = colors.HexColor("#95A5A6")
_ROW_ODD      = colors.HexColor("#F7F9FC")
_ROW_EVEN     = colors.white
_BORDER       = colors.HexColor("#D5DBE5")


def _header_style(bg: colors.Color) -> TableStyle:
    return TableStyle([
        ("BACKGROUND",  (0, 0), (-1, 0),  bg),
        ("TEXTCOLOR",   (0, 0), (-1, 0),  _TEXT_LIGHT),
        ("FONTNAME",    (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0),  9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING",  (0, 0), (-1, 0),  8),
        ("ALIGN",       (0, 0), (-1, -1), "CENTER"),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME",    (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE",    (0, 1), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [_ROW_ODD, _ROW_EVEN]),
        ("GRID",        (0, 0), (-1, -1), 0.5, _BORDER),
        ("LEFTPADDING",  (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ])


def generate_pdf(session_id: str) -> bytes:
    """Return the PDF as raw bytes (suitable for a streaming HTTP response)."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    styles  = getSampleStyleSheet()
    elements: list = []

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=22,
        textColor=_SLATE_DARK,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        "ReportSub",
        parent=styles["Normal"],
        fontSize=10,
        textColor=_TEXT_MUTED,
        alignment=TA_CENTER,
        spaceAfter=16,
    )
    h2_style = ParagraphStyle(
        "SectionHead",
        parent=styles["Heading2"],
        fontSize=12,
        textColor=_SLATE_DARK,
        spaceBefore=14,
        spaceAfter=6,
        borderPad=4,
    )
    normal = styles["Normal"]

    # ── Cover / header ──────────────────────────────────────────────── #
    summary = get_session_summary(session_id)
    elements.append(Paragraph("NetScope — Network Traffic Report", title_style))
    elements.append(Paragraph(f"Session: {session_id}", sub_style))

    # Summary row
    summary_data = [[
        "Session ID", "Packets Captured", "Alerts Generated", "Started At",
    ], [
        summary["session_id"],
        str(summary["packet_count"]),
        str(summary["alert_count"]),
        summary["started_at"] or "—",
    ]]
    summary_table = Table(
        summary_data,
        colWidths=[2.0 * inch, 1.5 * inch, 1.5 * inch, 2.0 * inch],
    )
    summary_table.setStyle(_header_style(_SLATE_DARK))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.3 * inch))

    # ── Captured Packets ───────────────────────────────────────────── #
    elements.append(Paragraph("Captured Packets (latest 100)", h2_style))
    packets = get_packets(session_id, limit=100)
    if packets:
        data = [["Timestamp", "Src IP", "Dst IP", "Src Port", "Dst Port", "Len", "Proto", "Flags"]]
        for p in packets:
            data.append([
                p["timestamp"], p["src_ip"], p.get("dst_ip", ""),
                str(p.get("src_port", 0)), str(p["dst_port"]),
                str(p["length"]), p["protocol"], p["flags"] or "—",
            ])
        t = Table(
            data,
            colWidths=[1.4*inch, 1.0*inch, 1.0*inch, 0.55*inch, 0.55*inch, 0.45*inch, 0.55*inch, 0.6*inch],
        )
        t.setStyle(_header_style(_ACCENT_BLUE))
        elements.append(t)
    else:
        elements.append(Paragraph("No packets captured in this session.", normal))

    elements.append(Spacer(1, 0.2 * inch))

    # ── Alerts ────────────────────────────────────────────────────── #
    elements.append(Paragraph("Alerts", h2_style))
    alerts = get_alerts(session_id, limit=200)
    if alerts:
        data = [["Timestamp", "Source IP", "Alert Type", "Description"]]
        for a in alerts:
            data.append([a["timestamp"], a["src_ip"], a["alert_type"], a["description"]])
        t = Table(
            data,
            colWidths=[1.4 * inch, 1.1 * inch, 1.1 * inch, 3.4 * inch],
        )
        t.setStyle(_header_style(_ACCENT_RED))
        elements.append(t)
    else:
        elements.append(Paragraph("No alerts generated in this session.", normal))

    elements.append(PageBreak())

    # ── Port Usage ────────────────────────────────────────────────── #
    elements.append(Paragraph("Port Usage (top 50)", h2_style))
    ports = get_port_usage(session_id)
    if ports:
        data = [["Dst Port", "Protocol", "Packet Count"]]
        for p in ports:
            data.append([str(p["dst_port"]), p["protocol"], str(p["count"])])
        t = Table(data, colWidths=[1.5 * inch, 1.5 * inch, 1.5 * inch])
        t.setStyle(_header_style(_ACCENT_TEAL))
        elements.append(t)
    else:
        elements.append(Paragraph("No port usage data available.", normal))

    doc.build(elements)
    return buffer.getvalue()
