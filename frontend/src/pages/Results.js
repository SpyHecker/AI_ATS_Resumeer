export default function Results({ analysis, onRetry }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Analysis results</h2>
        <button onClick={onRetry} className="text-sm text-brand-600 hover:underline font-medium">
          Analyze another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">ATS Compatibility Score</span>
              <span className="text-3xl font-bold text-slate-900">{analysis.score ?? 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div className="bg-brand-600 h-3 rounded-full" style={{ width: `${analysis.score ?? 0}%` }}></div>
            </div>
            <p className="text-sm text-slate-600">{analysis.verdict ?? 'Review your resume against the suggestions below.'}</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider text-slate-500">Sections detected</h3>
            <ul className="space-y-2 text-sm">
              {(analysis.sections ?? []).map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center">✓</span>
                  <span className="text-slate-600">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-brand-50 p-6 shadow-sm">
            <h3 className="font-bold text-brand-900 mb-4 text-sm uppercase tracking-wider text-brand-700">Missing keywords</h3>
            <div className="flex flex-wrap gap-2">
              {(analysis.missingKeywords ?? []).slice(0, 12).map((k) => (
                <span key={k} className="px-3 py-1 rounded-full border border-brand-200 bg-white text-brand-700 text-xs font-medium">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider text-slate-500">Suggestions</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {(analysis.suggestions ?? []).map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
