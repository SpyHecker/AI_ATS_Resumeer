export default function Results({ analysis, resumeText, onResumeTextChange, onRetry, onExport, onExportPdf }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysis results</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review your ATS compatibility and suggested improvements.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onExport} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm transition shadow shadow-brand-500/30 dark:shadow-brand-900/20 flex items-center gap-2">
            <span>⬇</span> Export TXT
          </button>
          {onExportPdf && (
            <button onClick={onExportPdf} className="px-5 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition flex items-center gap-2">
              <span>📄</span> Export PDF
            </button>
          )}
          <button onClick={onRetry} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Analyze another
          </button>
        </div>
      </div>

      {/* Score card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm dark:shadow-brand-900/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-24 h-24" transform="rotate(-90)">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="brand-600"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-brand-600 dark:text-brand-400 transition-colors"
                  style={{
                    strokeDasharray: 314,
                    strokeDashoffset: 314 - (314 * (analysis.score ?? 0)) / 100,
                  }}
                />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analysis.score ?? 0}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">ATS Score</span>
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{analysis.verdict ?? ''}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Compatibility with the job description</p>
            </div>
          </div>
          <div className="w-full md:w-64 border-l border-slate-200 dark:border-slate-800 pl-6 md:pl-0 md:border-l-0 md:pt-6 md:border-t space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Keyword match</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{analysis.keywordMatchPct ?? 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Semantic similarity</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{analysis.tfidfScore ?? 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Section coverage</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{analysis.sectionCoveragePct ?? 0}%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Keyword match', value: analysis.keywordMatchPct ?? 0, desc: 'JD keywords found in resume' },
            { label: 'Semantic similarity', value: analysis.tfidfScore ?? 0, desc: 'TF-IDF content match' },
            { label: 'Section coverage', value: analysis.sectionCoveragePct ?? 0, desc: 'Standard sections found' },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{m.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{m.value}%</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section scores */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Section scores</h3>
          <div className="space-y-3">
            {(analysis.sectionScores ?? []).map((s) => (
              <div key={s.name} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.score}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: s.score + '%' }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-500 dark:text-slate-500">{s.wordCount} words</span>
                  <span className="text-slate-500 dark:text-slate-500">{s.matchedKeywords.length} matched</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword density */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Keyword density</h3>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex flex-wrap gap-2">
              {(analysis.keywordDensity ?? []).slice(0, 12).map((k) => {
                const dense = k.density >= 1;
                const cls = dense
                  ? 'px-3 py-1 rounded-full border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-medium'
                  : 'px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium';
                return (
                  <span key={k.word} className={cls} title={k.word + ' — ' + k.density + '%'}>
                    {k.word}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing keywords */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Missing keywords</h3>
          <div className="rounded-2xl border border-brand-200 dark:border-brand-900/30 bg-brand-50 dark:bg-brand-900/20 p-6 shadow-sm dark:shadow-brand-900/20">
            <div className="flex flex-wrap gap-2">
              {(analysis.missingKeywords ?? []).slice(0, 15).map((k) => (
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

        {/* ATS checklist */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">ATS formatting checklist</h3>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
            <ul className="space-y-3">
              {(analysis.atsChecks ?? []).map((c) => {
                const passedCls = c.passed
                  ? 'w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600';
                return (
                  <li key={c.id} className="flex items-center gap-3 text-sm">
                    <span className={passedCls}>{c.passed ? '✓' : '✗'}</span>
                    <div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{c.label}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Editable resume text */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-0 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Edit extracted resume text</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Changes apply to the exported file</span>
        </div>
        <textarea
          value={resumeText ?? ''}
          onChange={(e) => onResumeTextChange(e.target.value)}
          rows="12"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-700 dark:text-slate-300 font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
          placeholder="Extracted resume text will appear here..."
        ></textarea>
      </div>

      {/* Matched keywords */}
      {(analysis.matchedKeywords ?? []).length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Matched keywords</h3>
          <div className="flex flex-wrap gap-2">
            {(analysis.matchedKeywords ?? []).slice(0, 20).map((k) => (
              <span key={k} className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-brand-900/20">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Suggestions</h3>
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          {(analysis.suggestions ?? []).map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
