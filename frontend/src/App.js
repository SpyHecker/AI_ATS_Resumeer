import { useState } from 'react';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';

function App() {
  const [page, setPage] = useState('home');
  const [analysis, setAnalysis] = useState(null);

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
                onClick={() => { setPage('home'); setAnalysis(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 'home' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Home
              </button>
              <button
                onClick={() => { setPage('analyze'); setAnalysis(null); }}
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
        {page === 'analyze' && <Analyze onAnalyze={setAnalysis} />}
        {page === 'results' && analysis && <Results analysis={analysis} onRetry={() => setPage('analyze')} />}
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

export default App;
