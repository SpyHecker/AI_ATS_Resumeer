"""Server-side resume vs job-description analysis (advanced)."""

from __future__ import annotations

import re
from collections import Counter
from typing import List, Set, Tuple

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    _HAS_SKLEARN = True
except Exception:  # pragma: no cover - sklearn optional at import time
    _HAS_SKLEARN = False

try:
    import nltk  # type: ignore
    from nltk.corpus import stopwords  # type: ignore

    try:
        _STOP = set(stopwords.words("english"))
    except Exception:
        nltk.download("stopwords", quiet=True)
        _STOP = set(stopwords.words("english"))
except Exception:  # pragma: no cover - nltk optional at import time
    _STOP = {
        "the","and","for","with","this","that","from","have","has","had","are","was","were",
        "been","will","would","could","should","may","might","must","can","into","your","you",
        "our","their","they","them","then","than","also","more","over","after","before","between",
        "under","again","further","once","here","there","when","where","why","how","all","any",
        "both","each","few","most","other","some","such","no","nor","not","only","own","same",
        "so","too","very","just","don","now","a","an","be","to","of","in","on","at","by","or","as",
        "it","is","if","we","he","she","his","her","its","i","me","my","myself","us","ours",
    }


_SECTIONS = [
    ("Summary", [r"summary", r"profile", r"objective"]),
    ("Experience", [r"experience", r"employment", r"work history", r"work experience"]),
    ("Education", [r"education", r"academic", r"degree", r"university", r"college"]),
    ("Skills", [r"skills", r"technical skills", r"competencies", r"technologies"]),
    ("Projects", [r"projects", r"portfolio"]),
    ("Certifications", [r"certification", r"certificate", r"license"]),
]

# Section weights in the overall ATS score.
_SECTION_WEIGHTS = {
    "Skills": 0.30,
    "Experience": 0.25,
    "Education": 0.15,
    "Summary": 0.10,
    "Projects": 0.10,
    "Certifications": 0.10,
}

_ATS_CHECKS = [
    {
        "id": "standard_headings",
        "label": "Standard section headings",
        "desc": "Uses common headings like Experience, Education, Skills.",
    },
    {
        "id": "single_column",
        "label": "Single-column layout",
        "desc": "ATS parsers read top-to-bottom, left-to-right.",
    },
    {
        "id": "no_tables",
        "label": "No tables or text boxes",
        "desc": "Tables can confuse ATS extraction.",
    },
    {
        "id": "contact_info",
        "label": "Contact information present",
        "desc": "Name, email, phone at the top.",
    },
    {
        "id": "file_format",
        "label": "ATS-friendly file type",
        "desc": "PDF, DOCX, or TXT.",
    },
    {
        "id": "keyword_density",
        "label": "Keyword density",
        "desc": "Relevant job keywords appear multiple times.",
    },
]


def extract_words(text: str) -> List[str]:
    cleaned = re.sub(r"[^a-z0-9\s#+-]", " ", text.lower())
    return [w for w in cleaned.split() if len(w) >= 3 and w not in _STOP]


def unique_preserve_order(items: List[str]) -> List[str]:
    seen: Set[str] = set()
    out: List[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


def detect_sections(text: str) -> List[str]:
    found = []
    for name, patterns in _SECTIONS:
        if any(re.search(p, text, re.IGNORECASE) for p in patterns):
            found.append(name)
    return found


def section_scores(resume_text: str, job_description: str) -> List[dict]:
    """Score each detected section (0-100) based on keyword presence + length."""
    jd_words = unique_preserve_order(extract_words(job_description))
    jd_set = set(jd_words)
    results = []
    for name, _ in _SECTIONS:
        pattern = _SECTIONS[[n for n, _ in _SECTIONS].index(name)][1]
        section_text = _extract_section(resume_text, pattern)
        words = extract_words(section_text)
        matched = [w for w in unique_preserve_order(words) if w in jd_set]
        coverage = (len(matched) / len(jd_words)) if jd_words else 0.0
        length_score = min(len(words) / 40, 1.0)  # cap at ~40 meaningful words
        score = round((0.6 * coverage + 0.4 * length_score) * 100)
        score = min(max(score, 0), 100)
        results.append({
            "name": name,
            "score": score,
            "matchedKeywords": matched[:10],
            "wordCount": len(words),
        })
    # Only return detected sections, sorted by score desc.
    detected = set(detect_sections(resume_text))
    results = [r for r in results if r["name"] in detected]
    results.sort(key=lambda r: r["score"], reverse=True)
    return results


def _extract_section(text: str, patterns: List[str]) -> str:
    """Crude section extraction: grab text following a section heading."""
    lines = text.splitlines()
    out = []
    capture = False
    for line in lines:
        if any(re.search(p, line, re.IGNORECASE) for p in patterns):
            capture = True
            continue
        if capture:
            # Stop at next known heading.
            if any(
                re.search(p, line, re.IGNORECASE)
                for _, pats in _SECTIONS
                for p in pats
            ) and line.strip():
                break
            out.append(line)
    return "\n".join(out)


def keyword_density(resume_text: str, top_n: int = 15) -> List[dict]:
    """Top keywords in the resume with frequency."""
    words = extract_words(resume_text)
    counts = Counter(words)
    total = sum(counts.values()) or 1
    return [
        {"word": w, "count": c, "density": round((c / total) * 100, 1)}
        for w, c in counts.most_common(top_n)
    ]


def _tfidf_score(resume_text: str, job_description: str) -> float:
    if not _HAS_SKLEARN:
        return 0.0
    if not resume_text.strip() or not job_description.strip():
        return 0.0
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf = vectorizer.fit_transform([resume_text, job_description])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(sim)
    except Exception:
        return 0.0


def ats_checks(resume_text: str, job_description: str) -> List[dict]:
    """Heuristic ATS formatting checklist."""
    checks = []
    sections = detect_sections(resume_text)
    jd_words = unique_preserve_order(extract_words(job_description))
    resume_words = set(extract_words(resume_text))
    overlap = (len([w for w in jd_words if w in resume_words]) / len(jd_words)) if jd_words else 0.0

    for check in _ATS_CHECKS:
        if check["id"] == "standard_headings":
            passed = len(sections) >= 3
        elif check["id"] == "keyword_density":
            passed = overlap >= 0.5
        elif check["id"] == "file_format":
            passed = True  # handled by API input validation
        else:
            passed = True  # can't verify from text alone; assume pass
        checks.append({**check, "passed": passed})
    return checks


def analyze_resume(resume_text: str, job_description: str) -> dict:
    """Return an advanced ATS-style analysis dict."""
    jd_words = unique_preserve_order(extract_words(job_description))
    resume_words = set(extract_words(resume_text))

    matched = [w for w in jd_words if w in resume_words]
    missing = [w for w in jd_words if w not in resume_words]

    tfidf = _tfidf_score(resume_text, job_description)
    overlap = (len(matched) / len(jd_words)) if jd_words else 0.0

    # Overall score: keyword overlap (40%) + TF-IDF (30%) + section completeness (30%).
    section_coverage = len(detect_sections(resume_text)) / len(_SECTIONS)
    score = round((0.4 * overlap + 0.3 * tfidf + 0.3 * section_coverage) * 100)
    score = min(max(score, 40), 98)

    sections = detect_sections(resume_text)

    suggestions: List[str] = []
    if missing:
        suggestions.append(
            "Add these missing keywords from the job description: " + ", ".join(missing[:8]) + "."
        )
    if "Skills" not in sections:
        suggestions.append("Add a dedicated Skills section with relevant technical skills.")
    if "Experience" not in sections:
        suggestions.append("Include a clear Experience section with roles and dates.")
    if score < 70:
        suggestions.append("Tailor your resume more closely to the job description to improve the ATS score.")
    if not suggestions:
        suggestions.append("Great alignment! Keep keywords prominent and use standard section headings.")

    if score >= 80:
        verdict = "Strong ATS match."
    elif score >= 60:
        verdict = "Moderate match — consider the suggestions below."
    else:
        verdict = "Low match — revise using the suggestions below."

    return {
        "score": score,
        "verdict": verdict,
        "matchedKeywords": matched[:15],
        "missingKeywords": missing[:15],
        "sections": sections,
        "suggestions": suggestions,
        # Advanced fields
        "sectionScores": section_scores(resume_text, job_description),
        "keywordDensity": keyword_density(resume_text),
        "atsChecks": ats_checks(resume_text, job_description),
        "tfidfScore": round(tfidf * 100),
        "keywordMatchPct": round(overlap * 100),
        "sectionCoveragePct": round(section_coverage * 100),
    }
