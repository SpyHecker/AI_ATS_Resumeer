"""Resume parsing: PDF, DOCX, TXT -> plain text."""

from __future__ import annotations

import io
from typing import Optional


def _parse_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF using PyPDF2, falling back to pdfminer.six."""
    text = _parse_pdf_pypdf2(file_bytes)
    if text and text.strip():
        return text
    return _parse_pdf_pdfminer(file_bytes)


def _parse_pdf_pypdf2(file_bytes: bytes) -> str:
    try:
        from PyPDF2 import PdfReader
    except Exception:  # pragma: no cover - dependency optional at import time
        return ""
    reader = PdfReader(io.BytesIO(file_bytes))
    parts = []
    for page in reader.pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(parts)


def _parse_pdf_pdfminer(file_bytes: bytes) -> str:
    try:
        from pdfminer.high_level import extract_text
    except Exception:  # pragma: no cover
        return ""
    try:
        return extract_text(io.BytesIO(file_bytes)) or ""
    except Exception:
        return ""


def _parse_docx(file_bytes: bytes) -> str:
    try:
        import docx  # python-docx
    except Exception:  # pragma: no cover
        return ""
    document = docx.Document(io.BytesIO(file_bytes))
    parts = [p.text for p in document.paragraphs if p.text]
    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text:
                    parts.append(cell.text)
    return "\n".join(parts)


def _parse_txt(file_bytes: bytes) -> str:
    for enc in ("utf-8", "utf-16", "latin-1"):
        try:
            return file_bytes.decode(enc)
        except Exception:
            continue
    return file_bytes.decode("utf-8", errors="ignore")


def parse_resume(file_bytes: bytes, filename: str) -> str:
    """Parse an uploaded resume file into plain text."""
    name = (filename or "").lower()
    if name.endswith(".pdf"):
        return _parse_pdf(file_bytes)
    if name.endswith(".docx") or name.endswith(".doc"):
        return _parse_docx(file_bytes)
    if name.endswith(".txt"):
        return _parse_txt(file_bytes)
    # Unknown type: attempt plain-text decode.
    return _parse_txt(file_bytes)
