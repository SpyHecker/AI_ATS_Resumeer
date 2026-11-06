export default function Results({ analysis, onRetry, onExport }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysis results</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review your ATS compatibility and suggested improvements.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onExport} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm transition shadow shadow-brand-500/30 dark:shadow-brand-900/20 flex items-center gap-2">
            <span>⬇</span> Export ATS-friendly TXT
          </button>
          <button onClick={onRetry} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Analyze another
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">ATS Compatibility Score</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{analysis.score ?? 0}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 mb-4">
              <div className="bg-brand-600 h-3 rounded-full" style={{ width: `${analysis.score ?? 0}%` }}></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.verdict ?? 'Review your resume against the suggestions below.'}</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Sections detected</h3>
            <ul className="space-y-2 text-sm">
              {(analysis.sections ?? []).map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs flex items-center justify-center">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">{s}</span>
                </li>
              ))}
              {(analysis.sections ?? []).length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500">No standard sections detected.</p>
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-brand-200 dark:border-brand-900/30 bg-brand-50 dark:bg-brand-900/20 p-6 shadow-sm dark:shadow-brand-900/20">
            <h3 className="font-bold text-brand-900 dark:text-brand-100 mb-4 text-sm uppercase tracking-wider text-brand-700 dark:text-brand-300">Missing keywords</h3>
            <div className="flex flex-wrap gap-2">
              {(analysis.missingKeywords ?? []).slice(0, 12).map((k) => (
                <span key={k} className="px-3 py-1 rounded-full border border-brand-200 dark:border-brand-700 bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 text-xs font-medium">
                  {k}
                </span>
              ))}
              {(analysis.missingKeywords ?? []).length === 0 && (
                <p className="text-sm text-brand-600 dark:text-brand-400">No major missing keywords.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Suggestions</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {(analysis.suggestions ?? []).map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {(analysis.matchedKeywords ?? []).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Matched keywords</h3>
              <div className="flex flex-wrap gap-2">
                {(analysis.matchedKeywords ?? []).slice(0, 15).map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
