export default function Analyze({ onAnalyze }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Analyze your resume</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload resume</label>
            <div className="flex items-center gap-3">
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx,.txt"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
              />
              <span id="resume-file-name" className="text-sm text-slate-500">No file chosen</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or TXT</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job description</label>
            <textarea
              id="job-description"
              rows="10"
              placeholder="Paste the job description here..."
              className="w-full rounded-lg border border-slate-300 p-4 text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              disabled={true}
              id="analyze-btn"
              className="w-full py-4 bg-slate-300 text-slate-500 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
