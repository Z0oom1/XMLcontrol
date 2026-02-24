import { useState, useCallback } from 'react';

export interface Action {
  type: 'create' | 'delete' | 'rename' | 'update';
  name: string;
  previousValue?: string;
  newValue?: string;
  timestamp: Date;
}

export interface UseActionHistoryReturn {
  history: Action[];
  canUndo: boolean;
  canRedo: boolean;
  addAction: (action: Action) => void;
  undo: () => Action | null;
  redo: () => Action | null;
  clearHistory: () => void;
  exportHistory: () => string;
}

export function useActionHistory(): UseActionHistoryReturn {
  const [history, setHistory] = useState<Action[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addAction = useCallback((action: Action) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(action);
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1] || null;
    }
    return null;
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1] || null;
    }
    return null;
  }, [history, currentIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const exportHistory = useCallback(() => {
    return JSON.stringify(history.slice(0, currentIndex + 1), null, 2);
  }, [history, currentIndex]);

  return {
    history: history.slice(0, currentIndex + 1),
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    addAction,
    undo,
    redo,
    clearHistory,
    exportHistory,
  };
}
