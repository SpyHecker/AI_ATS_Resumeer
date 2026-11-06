"""Server-side resume vs job-description analysis."""

from __future__ import annotations

import re
from typing import List, Set

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


_SECTION_PATTERNS = [
    ("Summary", [r"summary", r"profile", r"objective"]),
    ("Experience", [r"experience", r"employment", r"work history", r"work experience"]),
    ("Education", [r"education", r"academic", r"degree", r"university", r"college"]),
    ("Skills", [r"skills", r"technical skills", r"competencies", r"technologies"]),
    ("Projects", [r"projects", r"portfolio"]),
    ("Certifications", [r"certification", r"certificate", r"license"]),
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
    for name, patterns in _SECTION_PATTERNS:
        if any(re.search(p, text, re.IGNORECASE) for p in patterns):
            found.append(name)
    return found


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


def analyze_resume(resume_text: str, job_description: str) -> dict:
    """Return an ATS-style analysis dict."""
    jd_words = unique_preserve_order(extract_words(job_description))
    resume_words = set(extract_words(resume_text))

    matched = [w for w in jd_words if w in resume_words]
    missing = [w for w in jd_words if w not in resume_words]

    tfidf = _tfidf_score(resume_text, job_description)
    overlap = (len(matched) / len(jd_words)) if jd_words else 0.0

    # Blend TF-IDF similarity (40%) with keyword overlap (60%), floor at 40, cap at 98.
    score = round((0.4 * tfidf + 0.6 * overlap) * 100)
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
    }
