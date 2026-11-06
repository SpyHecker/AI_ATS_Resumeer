"""AI ATS Resumeer backend — FastAPI."""

from __future__ import annotations

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, Response

from .parser import parse_resume
from .analysis import analyze_resume

app = FastAPI(title="AI ATS Resumeer", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...), job_description: str = Form("")):
    """Parse an uploaded resume and analyze it against a job description."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    resume_text = parse_resume(file_bytes, file.filename)
    if not resume_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from the resume. Please upload a PDF, DOCX, or TXT file.",
        )

    result = analyze_resume(resume_text, job_description)
    result["fileName"] = file.filename
    result["jobDescription"] = job_description
    result["resumeText"] = resume_text
    return result


@app.post("/api/export", response_class=PlainTextResponse)
async def export(file: UploadFile = File(...), job_description: str = Form("")):
    """Generate an ATS-friendly plain-text version of the resume with analysis notes."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_bytes = await file.read()
    resume_text = parse_resume(file_bytes, file.filename)
    if not resume_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from the resume.",
        )

    result = analyze_resume(resume_text, job_description)

    lines = []
    lines.append("ATS-FRIENDLY RESUME")
    lines.append("Source file: " + file.filename)
    lines.append("")
    lines.append("--- RESUME CONTENT (extracted) ---")
    lines.append(resume_text)
    lines.append("")
    lines.append("--- ATS ANALYSIS ---")
    lines.append("ATS Compatibility Score: " + str(result.get("score", 0)) + "%")
    lines.append("Verdict: " + result.get("verdict", ""))
    lines.append("")
    lines.append(
        "Sections detected: " + (", ".join(result.get("sections", [])) or "none")
    )
    lines.append("")
    if result.get("matchedKeywords"):
        lines.append("Matched keywords: " + ", ".join(result["matchedKeywords"]))
    if result.get("missingKeywords"):
        lines.append("Missing keywords to add: " + ", ".join(result["missingKeywords"]))
    lines.append("")
    lines.append("Suggestions:")
    for i, s in enumerate(result.get("suggestions", []), 1):
        lines.append(f"  {i}. {s}")
    lines.append("")
    lines.append(
        "Tip: Use standard section headings (Experience, Education, Skills) and a clean, single-column layout."
    )
    return "\n".join(lines)


@app.post("/api/export-pdf", response_class=Response)
async def export_pdf(file: UploadFile = File(...), job_description: str = Form("")):
    """Generate an ATS-friendly PDF version of the resume with analysis notes."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_bytes = await file.read()
    resume_text = parse_resume(file_bytes, file.filename)
    if not resume_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from the resume.",
        )

    result = analyze_resume(resume_text, job_description)

    from fpdf import FPDF

    def _safe(text):
        # Ensure text is encodable in latin-1 (FPDF core fonts).
        return str(text).encode("latin-1", errors="replace").decode("latin-1")

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, _safe("ATS-FRIENDLY RESUME"), ln=1)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, _safe("Source file: " + file.filename), ln=1)
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, _safe("RESUME CONTENT (extracted)"), ln=1)
    pdf.set_font("Helvetica", "", 10)
    for line in (resume_text or "").splitlines():
        pdf.multi_cell(pdf.w - 2 * pdf.l_margin, 6, _safe(line))
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, _safe("ATS ANALYSIS"), ln=1)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, _safe("ATS Compatibility Score: " + str(result.get("score", 0)) + "%"), ln=1)
    pdf.cell(0, 6, _safe("Verdict: " + result.get("verdict", "")), ln=1)
    pdf.ln(3)
    pdf.cell(
        0,
        6,
        _safe("Sections detected: " + (", ".join(result.get("sections", [])) or "none")),
        ln=1,
    )
    pdf.ln(3)
    if result.get("matchedKeywords"):
        pdf.cell(
            0, 6, _safe("Matched keywords: " + ", ".join(result["matchedKeywords"])), ln=1
        )
    if result.get("missingKeywords"):
        pdf.cell(
            0, 6, _safe("Missing keywords: " + ", ".join(result["missingKeywords"])), ln=1
        )
    pdf.ln(3)
    pdf.cell(0, 6, _safe("Suggestions:"), ln=1)
    for i, s in enumerate(result.get("suggestions", []), 1):
        pdf.multi_cell(pdf.w - 2 * pdf.l_margin, 6, _safe("  " + str(i) + ". " + s))
    pdf.ln(3)
    pdf.set_font("Helvetica", "I", 9)
    pdf.multi_cell(
        pdf.w - 2 * pdf.l_margin,
        6,
        _safe(
            "Tip: Use standard section headings (Experience, Education, Skills) and a clean, single-column layout."
        ),
    )

    out = pdf.output(dest="S")
    pdf_bytes = out if isinstance(out, (bytes, bytearray)) else out.encode("latin-1")
    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="ats-friendly-resume.pdf"'},
    )
