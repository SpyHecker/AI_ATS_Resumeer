import { createContext, useContext, useEffect, useState } from 'react';

const HISTORY_KEY = 'ats-history';
const MAX_HISTORY = 50;

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
    } catch (e) {
      // localStorage may be unavailable or quota exceeded.
    }
  }, [history]);

  const saveAnalysis = (entry) => {
    const next = [entry, ...history.filter((h) => h.id !== entry.id)];
    setHistory(next);
  };

  const restoreAnalysis = (id) => history.find((h) => h.id === id);

  const removeAnalysis = (id) => {
    setHistory(history.filter((h) => h.id !== id));
  };

  const clearHistory = () => setHistory([]);

  return (
    <HistoryContext.Provider value={{ history, saveAnalysis, restoreAnalysis, removeAnalysis, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
