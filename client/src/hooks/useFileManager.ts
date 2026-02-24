import { useState, useCallback } from 'react';

declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  values(): AsyncIterable<FileSystemHandle>;
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write(data: Blob | BufferSource | string): Promise<void>;
  close(): Promise<void>;
}

export interface FileEntry {
  name: string;
  kind: 'file' | 'directory';
  size?: number;
  modified?: Date;
  handle?: FileSystemHandle;
}

export interface FolderMeta {
  color: string;
  icon?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export type ViewMode = 'grid' | 'list' | 'details';

export interface UseFileManagerReturn {
  currentHandle: FileSystemHandle | null;
  entries: FileEntry[];
  selectedNames: Set<string>;
  pathHistory: FileSystemHandle[];
  viewMode: ViewMode;
  searchQuery: string;
  folderMeta: Record<string, FolderMeta>;
  filteredEntries: FileEntry[];
  
  connectStorage: () => Promise<void>;
  navigateToFolder: (entry: FileEntry) => Promise<void>;
  navigateBack: () => void;
  navigateForward: () => void;
  selectEntry: (name: string, multiSelect: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  updateFolderMeta: (name: string, meta: FolderMeta) => void;
  createFolder: (name: string, meta?: FolderMeta) => Promise<void>;
  deleteEntry: (name: string) => Promise<void>;
  renameEntry: (oldName: string, newName: string) => Promise<void>;
}

export function useFileManager(): UseFileManagerReturn {
  const [currentHandle, setCurrentHandle] = useState<FileSystemHandle | null>(null);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const [pathHistory, setPathHistory] = useState<FileSystemHandle[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [folderMeta, setFolderMeta] = useState<Record<string, FolderMeta>>(() => {
    const stored = localStorage.getItem('xmlcontrol_meta');
    return stored ? JSON.parse(stored) : {};
  });

  const filteredEntries = entries.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadEntries = useCallback(async (handle: FileSystemHandle) => {
    const newEntries: FileEntry[] = [];
    try {
      const dirHandle = handle as FileSystemDirectoryHandle;
      for await (const entry of dirHandle.values()) {
        newEntries.push({
          name: entry.name,
          kind: entry.kind as 'file' | 'directory',
          handle: entry,
        });
      }
      newEntries.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setEntries(newEntries);
    } catch (e) {
      console.error('Erro ao carregar entradas:', e);
    }
  }, []);

  const connectStorage = useCallback(async () => {
    try {
      if (!window.showDirectoryPicker) {
        throw new Error('File System Access API não suportada');
      }
      const handle = await window.showDirectoryPicker();
      setCurrentHandle(handle);
      setPathHistory([handle]);
      setHistoryIndex(0);
      await loadEntries(handle);
    } catch (e) {
      console.error('Acesso ao armazenamento negado:', e);
    }
  }, [loadEntries]);

  const navigateToFolder = useCallback(async (entry: FileEntry) => {
    if (entry.kind === 'directory' && entry.handle) {
      const newHistory = pathHistory.slice(0, historyIndex + 1);
      newHistory.push(entry.handle);
      setPathHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentHandle(entry.handle);
      setSelectedNames(new Set<string>());
      await loadEntries(entry.handle);
    }
  }, [pathHistory, historyIndex, loadEntries]);

  const navigateBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentHandle(pathHistory[newIndex]);
      loadEntries(pathHistory[newIndex]);
      setSelectedNames(new Set<string>());
    }
  }, [pathHistory, historyIndex, loadEntries]);

  const navigateForward = useCallback(() => {
    if (historyIndex < pathHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentHandle(pathHistory[newIndex]);
      loadEntries(pathHistory[newIndex]);
      setSelectedNames(new Set<string>());
    }
  }, [pathHistory, historyIndex, loadEntries]);

  const selectEntry = useCallback((name: string, multiSelect: boolean) => {
    setSelectedNames(prev => {
      const newSet = multiSelect ? new Set(prev) : new Set<string>();
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedNames(new Set<string>(entries.map(e => e.name)));
  }, [entries]);

  const clearSelection = useCallback(() => {
    setSelectedNames(new Set<string>());
  }, []);

  const updateFolderMeta = useCallback((name: string, meta: FolderMeta) => {
    setFolderMeta(prev => {
      const newMeta = { ...prev, [name]: meta };
      localStorage.setItem('xmlcontrol_meta', JSON.stringify(newMeta));
      return newMeta;
    });
  }, []);

  const createFolder = useCallback(async (name: string, meta?: FolderMeta) => {
    if (currentHandle && 'getDirectoryHandle' in currentHandle) {
      try {
        const dirHandle = currentHandle as FileSystemDirectoryHandle;
        await dirHandle.getDirectoryHandle(name, { create: true });
        if (meta) {
          updateFolderMeta(name, meta);
        }
        if (currentHandle) await loadEntries(currentHandle);
      } catch (e) {
        console.error('Erro ao criar pasta:', e);
      }
    }
  }, [currentHandle, updateFolderMeta, loadEntries]);

  const deleteEntry = useCallback(async (name: string) => {
    if (currentHandle && 'removeEntry' in currentHandle) {
      try {
        const dirHandle = currentHandle as FileSystemDirectoryHandle;
        await dirHandle.removeEntry(name, { recursive: true });
        if (currentHandle) await loadEntries(currentHandle);
      } catch (e) {
        console.error('Erro ao deletar entrada:', e);
      }
    }
  }, [currentHandle, loadEntries]);

  const renameEntry = useCallback(async (oldName: string, newName: string) => {
    if (currentHandle && 'getFileHandle' in currentHandle) {
      try {
        const dirHandle = currentHandle as FileSystemDirectoryHandle;
        const entry = await dirHandle.getFileHandle(oldName);
        const newEntry = await dirHandle.getFileHandle(newName, { create: true });
        
        if ('getFile' in entry) {
          const file = await (entry as FileSystemFileHandle).getFile();
          const writable = await (newEntry as FileSystemFileHandle).createWritable();
          await writable.write(file);
          await writable.close();
          await dirHandle.removeEntry(oldName);
        }
        
        if (currentHandle) await loadEntries(currentHandle);
      } catch (e) {
        console.error('Erro ao renomear entrada:', e);
      }
    }
  }, [currentHandle, loadEntries]);

  return {
    currentHandle,
    entries,
    selectedNames,
    pathHistory,
    viewMode,
    searchQuery,
    folderMeta,
    filteredEntries,
    connectStorage,
    navigateToFolder,
    navigateBack,
    navigateForward,
    selectEntry,
    selectAll,
    clearSelection,
    setViewMode,
    setSearchQuery,
    updateFolderMeta,
    createFolder,
    deleteEntry,
    renameEntry,
  };
}
