import { useHistory } from '../context/HistoryContext';

export default function History({ onRestore }) {
  const { history, removeAnalysis, clearHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">📭</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No history yet</h2>
        <p className="text-slate-500 dark:text-slate-400">Analyze a resume to see it appear here.</p>
        <button
          onClick={() => onRestore('analyze')}
          className="mt-6 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition"
        >
          Start analyzing
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysis history</h2>
        <button
          onClick={clearHistory}
          className="text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm dark:shadow-brand-900/20">
        <table className="w-full text-left border-b border-slate-200 dark:border-slate-800">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">File</th>
              <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Score</th>
              <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
              <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {history.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate block max-w-xs">{entry.fileName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{entry.score}%</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onRestore(entry)}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline mr-3"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => removeAnalysis(entry.id)}
                    className="text-xs text-slate-500 dark:text-slate-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
