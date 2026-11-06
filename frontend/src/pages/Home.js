export default function Home({ onStart }) {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-6 uppercase tracking-wider">
        AI-powered ATS optimization
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
        Optimize your resume for{' '}
        <span className="text-brand-600">Applicant Tracking Systems</span>
      </h1>
      <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
        Upload your resume and paste a job description to get an instant ATS compatibility score,
        keyword analysis, section checks, and actionable suggestions.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onStart}
          className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-lg transition shadow-lg shadow-brand-500/30"
        >
          Start analyzing
        </button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {[{
          icon: '📂',
          title: 'Resume Upload',
          desc: 'PDF, DOCX, and TXT support.',
        }, {
          icon: '🔍',
          title: 'Keyword Analysis',
          desc: 'Match resume against the job description.',
        }, {
          icon: '⚡',
          title: 'ATS Score',
          desc: 'Instant compatibility percentage.',
        }].map((f, i) => (
          <div key={i} className="p-6 rounded-xl border border-slate-200 bg-white hover:border-brand-200/60 hover:shadow-md transition">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
