import { useState, useCallback } from 'react';
import { analyzeResume } from './config';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';

function buildATSFriendlyText({ fileName, resumeText, analysis }) {
  const lines = [];
  lines.push('ATS-FRIENDLY RESUME');
  lines.push('Source file: ' + (fileName || 'uploaded resume'));
  lines.push('');
  lines.push('--- RESUME CONTENT (extracted) ---');
  lines.push(resumeText || '');
  lines.push('');
  lines.push('--- ATS ANALYSIS ---');
  lines.push('ATS Compatibility Score: ' + (analysis.score ?? 0) + '%');
  lines.push('Verdict: ' + (analysis.verdict ?? ''));
  lines.push('');
  lines.push('Sections detected: ' + (analysis.sections?.join(', ') || 'none'));
  lines.push('');
  if (analysis.matchedKeywords?.length) {
    lines.push('Matched keywords: ' + analysis.matchedKeywords.join(', '));
  }
  if (analysis.missingKeywords?.length) {
    lines.push('Missing keywords to add: ' + analysis.missingKeywords.join(', '));
  }
  lines.push('');
  lines.push('Suggestions:');
  (analysis.suggestions ?? []).forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
  lines.push('');
  lines.push(
    'Tip: Use standard section headings (Experience, Education, Skills) and a clean, single-column layout.'
  );
  return lines.join('\n');
}

export default function App() {
  const [page, setPage] = useState('home');
  const [analysis, setAnalysis] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(
    async ({ file, jobDescription }) => {
      setAnalyzing(true);
      setError(null);
      try {
        const result = await analyzeResume(file, jobDescription);
        setResumeText(result.resumeText || '');
        setFileName(result.fileName || file.name);
        setAnalysis({
          score: result.score,
          verdict: result.verdict,
          matchedKeywords: result.matchedKeywords,
          missingKeywords: result.missingKeywords,
          sections: result.sections,
          suggestions: result.suggestions,
        });
        setPage('results');
      } catch (err) {
        setError(err.message || 'Analysis failed. Is the backend running on http://localhost:8000?');
      } finally {
        setAnalyzing(false);
      }
    },
    []
  );

  const handleExport = useCallback(() => {
    if (!analysis) return;
    const content = buildATSFriendlyText({ fileName, resumeText, analysis });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ats-friendly-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [analysis, fileName, resumeText]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ATS<span className="text-brand-600">Resumeer</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setPage('home'); setAnalysis(null); setError(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 'home' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Home
              </button>
              <button
                onClick={() => { setPage('analyze'); setAnalysis(null); setError(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 'analyze' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Analyze Resume
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'home' && <Home onStart={() => setPage('analyze')} />}
        {page === 'analyze' && (
          <Analyze
            onAnalyze={handleAnalyze}
            analyzing={analyzing}
            error={error}
          />
        )}
        {page === 'results' && analysis && (
          <Results
            analysis={analysis}
            onRetry={() => { setPage('analyze'); setAnalysis(null); setError(null); }}
            onExport={handleExport}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>ATS Resumeer — AI-powered resume optimization for Applicant Tracking Systems.</p>
          <p className="flex gap-4">
            <button className="text-slate-500 hover:text-brand-600 transition bg-none border-none p-0 cursor-pointer">Privacy</button>
            <button className="text-slate-500 hover:text-brand-600 transition bg-none border-none p-0 cursor-pointer">Terms</button>
          </p>
        </div>
      </footer>
    </div>
  );
}
