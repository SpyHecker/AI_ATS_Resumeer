import { useState, useCallback } from 'react';
import { analyzeResume } from './config';
import { useTheme } from './context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();
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
    <div className={`min-h-screen text-slate-900 antialiased transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">ATS<span className="text-brand-600 dark:text-brand-400">Resumeer</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setPage('home'); setAnalysis(null); setError(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  page === 'home' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => { setPage('analyze'); setAnalysis(null); setError(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  page === 'analyze' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Analyze Resume
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
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

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className={`text-slate-500 dark:text-slate-400`}>ATS Resumeer — AI-powered resume optimization for Applicant Tracking Systems.</p>
          <p className="flex gap-4">
            <button className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition bg-none border-none p-0 cursor-pointer">Privacy</button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition bg-none border-none p-0 cursor-pointer">Terms</button>
          </p>
        </div>
      </footer>
    </div>
  );
}
