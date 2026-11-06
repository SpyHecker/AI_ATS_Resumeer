import { useState } from 'react';

export default function Analyze({ onAnalyze, analyzing }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0] ?? null);
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return;
    onAnalyze({ file, jobDescription: jobDescription.trim() });
  };

  const ready = Boolean(file && jobDescription.trim());

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Analyze your resume</h2>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload resume</label>
            <div className="flex items-center gap-3">
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer disabled:opacity-50"
                disabled={analyzing}
              />
              <span id="resume-file-name" className="text-sm text-slate-500">
                {file ? file.name : 'No file chosen'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or TXT (text extraction happens on the server)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job description</label>
            <textarea
              id="job-description"
              rows="10"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={analyzing}
              className="w-full rounded-lg border border-slate-300 p-4 text-sm text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none disabled:bg-slate-100"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!ready || analyzing}
              className="w-full py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <span className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-brand-600 animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-3 h-3 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  </span>
                  Analyzing...
                </>
              ) : (
                'Analyze resume'
              )}
            </button>
          </div>
        </form>

        {!ready && !analyzing && (
          <p className="mt-4 text-sm text-slate-500">Please upload a resume and paste a job description to continue.</p>
        )}
      </div>
    </div>
  );
}
