# 📄 ATS Resumeer

An AI-powered tool that helps job seekers **optimize their resumes for Applicant Tracking Systems (ATS)**. Upload your resume and job description, and get instant feedback, keyword analysis, and an ATS compatibility score.

---

## 🚀 Features

- 📂 **Resume Upload**: Supports PDF, DOCX, and TXT formats.
- 🔍 **Keyword Analysis**: Matches resume content against the job description.
- 🧩 **Section Detection**: Ensures essential sections (Education, Experience, Skills) are present.
- ⚡ **ATS Score**: Percentage score with keyword-match, semantic-similarity, and section-coverage breakdown.
- 📊 **Section Scores**: Per-section scoring (Experience, Education, Skills, etc.).
- 🏷️ **Keyword Density**: Top keywords found in your resume with frequency.
- ✅ **ATS Checklist**: Formatting best-practice checks (headings, layout, contact info, etc.).
- 📝 **Suggestions**: Actionable improvements and missing keywords.
- 📤 **Export**: ATS-friendly TXT (with editable resume text) and PDF export.
- 🕒 **History**: Analysis history persisted in your browser (localStorage) with restore/delete.
- 🌗 **Dark mode**: Light/dark theme toggle with persisted preference.

---

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS (Create React App)
- **Backend**: Python FastAPI
- **Resume Parsing**: `PyPDF2`, `pdfminer.six`, `python-docx`
- **NLP Analysis**: `nltk`, `scikit-learn`
- **PDF Export**: `fpdf2`

---

## 🧭 Project structure

```
AI_ATS_Resumeer/
├── README.md
├── .gitignore
├── requirements.txt          # (root, reserved)
├── frontend/                 # React + Tailwind (Create React App)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/index.html     # Tailwind JIT via CDN
│   └── src/
│       ├── App.js            # Shell: nav + Home / Analyze / Results / History
│       ├── config.js         # API client (POST /api/analyze)
│       ├── index.js          # ThemeProvider + HistoryProvider
│       ├── index.css         # Base + dark mode styles
│       ├── context/
│       │   ├── ThemeContext.js
│       │   └── HistoryContext.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Analyze.js    # resume upload + job description
│       │   ├── Results.js    # score, sections, keywords, checklist, editor, export
│       │   └── History.js    # localStorage analysis history
│       └── ...
└── backend/                  # FastAPI API
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── main.py           # /api/health, /api/analyze, /api/export, /api/export-pdf
        ├── parser.py         # PDF / DOCX / TXT -> text
        └── analysis.py       # score, section scores, keywords, checklist
```

---

## ▶️ Run locally

You need two terminals: one for the backend, one for the frontend.

### Backend (Python)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload    # http://localhost:8000
```

### Frontend (React)

```bash
cd frontend
npm install                      # or npm ci
npm start                        # http://localhost:3000
```

The frontend calls `http://localhost:8000` by default. Override with:

```bash
REACT_APP_API_URL=http://localhost:8000 npm start
```

Create `frontend/.env` from `frontend/.env.example` if needed.

### Production frontend build

```bash
cd frontend
npm run build                    # build/ (static, serve with any static host)
```

---

## 🔌 API

- `GET /api/health` — health check
- `POST /api/analyze` — multipart/form-data: `file` (pdf/docx/txt) + `job_description` (text) → JSON analysis
- `POST /api/export` — same inputs → plain-text ATS-friendly resume (TXT)
- `POST /api/export-pdf` — same inputs → ATS-friendly resume (PDF download)

---

## ✅ Status

Complete full-stack MVP: React/Tailwind frontend + FastAPI backend with resume parsing, advanced ATS analysis, section scoring, keyword density, ATS checklist, TXT/PDF export, analysis history, and dark mode.
