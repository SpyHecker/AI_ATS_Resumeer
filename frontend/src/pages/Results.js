export default function Results({ analysis, onRetry, onExport }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analysis results</h2>
          <p className="text-sm text-slate-500">Review your ATS compatibility and suggested improvements.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onExport} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm transition shadow shadow-brand-500/30 flex items-center gap-2">
            <span>⬇</span> Export ATS-friendly TXT
          </button>
          <button onClick={onRetry} className="px-5 py-2.5 border border-slate-300 rounded-lg font-medium text-sm text-slate-700 hover:bg-slate-100 transition">
            Analyze another
          </button>
        </div>
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
              {(analysis.sections ?? []).length === 0 && (
                <p className="text-sm text-slate-400">No standard sections detected.</p>
              )}
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
              {(analysis.missingKeywords ?? []).length === 0 && (
                <p className="text-sm text-brand-600">No major missing keywords.</p>
              )}
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

        {(analysis.matchedKeywords ?? []).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider text-slate-500">Matched keywords</h3>
              <div className="flex flex-wrap gap-2">
                {(analysis.matchedKeywords ?? []).slice(0, 15).map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium">
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
