import { useState, useEffect } from 'react';
import { useFileManager, FileEntry } from '@/hooks/useFileManager';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/Toolbar';
import FileCard from '@/components/FileCard';
import InspectorPanel from '@/components/InspectorPanel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ExportDialog from '@/components/ExportDialog';
import KeyboardShortcutsDialog from '@/components/KeyboardShortcutsDialog';
import StorageStats from '@/components/StorageStats';
import { MoreVertical, HelpCircle, BarChart3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Design Philosophy: Minimalista Corporativo
 * - Hierarquia visual clara com espaçamento generoso
 * - Paleta azul profunda (#1e40af) com neutros cuidadosos
 * - Transições suaves de 200-300ms
 * - Feedback visual imediato em todas as ações
 */

export default function Home() {
  const fileManager = useFileManager();
  const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [contextEntry, setContextEntry] = useState<FileEntry | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  const breadcrumbs = fileManager.pathHistory
    .map((h) => h.name)
    .join(' / ');

  const handleConnect = async () => {
    await fileManager.connectStorage();
    toast.success('Pasta conectada com sucesso!');
  };

  const handleNewFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Digite um nome para a pasta');
      return;
    }
    await fileManager.createFolder(newFolderName);
    setNewFolderName('');
    setShowNewFolderDialog(false);
    toast.success(`Pasta "${newFolderName}" criada!`);
  };

  const handleSelectEntry = (entry: FileEntry, multiSelect: boolean) => {
    fileManager.selectEntry(entry.name, multiSelect);
    setSelectedEntry(entry);
  };

  const handleDoubleClick = async (entry: FileEntry) => {
    if (entry.kind === 'directory') {
      await fileManager.navigateToFolder(entry);
      setSelectedEntry(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, entry: FileEntry) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setContextEntry(entry);
  };

  const handleDeleteEntry = async () => {
    if (selectedEntry) {
      await fileManager.deleteEntry(selectedEntry.name);
      setSelectedEntry(null);
      toast.success('Item deletado com sucesso!');
    }
  };

  const handleRenameEntry = async (newName: string) => {
    if (selectedEntry) {
      await fileManager.renameEntry(selectedEntry.name, newName);
      setSelectedEntry(null);
      toast.success('Item renomeado com sucesso!');
    }
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        fileManager.selectAll();
      }
      if (e.key === 'Delete' && selectedEntry) {
        handleDeleteEntry();
      }
      if (e.key === 'Backspace' && fileManager.pathHistory.length > 1) {
        fileManager.navigateBack();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setShowExportDialog(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        setShowShortcutsDialog(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowNewFolderDialog(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntry, fileManager]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onConnect={handleConnect}
        onNewFolder={() => setShowNewFolderDialog(true)}
        selectedCount={fileManager.selectedNames.size}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <Toolbar
          searchQuery={fileManager.searchQuery}
          onSearchChange={fileManager.setSearchQuery}
          viewMode={fileManager.viewMode}
          onViewModeChange={fileManager.setViewMode}
          onBack={fileManager.navigateBack}
          onForward={fileManager.navigateForward}
          canGoBack={fileManager.pathHistory.length > 1}
          canGoForward={false}
          breadcrumbs={breadcrumbs}
        />
        {/* Menu Button */}
        <div className="absolute top-4 right-4 z-40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowStatsDialog(true)} className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Estatísticas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExportDialog(true)} className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowShortcutsDialog(true)} className="gap-2">
                <HelpCircle className="w-4 h-4" />
                Atalhos (Ctrl + ?)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 overflow-auto">
          {!fileManager.currentHandle ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Nenhuma pasta conectada
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique em "Conectar Pasta" para começar
                  </p>
                </div>
                <Button onClick={handleConnect} className="mt-4">
                  Conectar Pasta
                </Button>
              </div>
            </div>
          ) : fileManager.filteredEntries.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Nenhum arquivo encontrado</p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'p-6',
                fileManager.viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                  : 'space-y-2'
              )}
            >
              {fileManager.filteredEntries.map((entry) => (
                <FileCard
                  key={entry.name}
                  entry={entry}
                  meta={fileManager.folderMeta[entry.name]}
                  isSelected={fileManager.selectedNames.has(entry.name)}
                  onSelect={(e) =>
                    handleSelectEntry(entry, e.ctrlKey || e.metaKey)
                  }
                  onDoubleClick={() => handleDoubleClick(entry)}
                  onContextMenu={(e) => handleContextMenu(e, entry)}
                  viewMode={fileManager.viewMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-card border-t border-border px-6 py-3 text-xs text-muted-foreground flex justify-between">
          <span>{fileManager.filteredEntries.length} itens</span>
          <span>{fileManager.selectedNames.size} selecionados</span>
        </div>
      </div>

      {/* Inspector Panel */}
      <InspectorPanel
        entry={selectedEntry}
        meta={selectedEntry ? fileManager.folderMeta[selectedEntry.name] : undefined}
        onMetaUpdate={(meta) => {
          if (selectedEntry) {
            fileManager.updateFolderMeta(selectedEntry.name, meta);
          }
        }}
        onDelete={handleDeleteEntry}
        onRename={handleRenameEntry}
      />

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Pasta</DialogTitle>
            <DialogDescription>
              Digite o nome da nova pasta que deseja criar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Nome da Pasta</Label>
              <Input
                id="folder-name"
                placeholder="Minha Pasta"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNewFolder();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewFolderDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleNewFolder}>Criar Pasta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu && contextEntry && (
        <div
          className="fixed bg-card border border-border rounded-lg shadow-lg z-50 py-1 min-w-48"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <button
            className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted text-left"
            onClick={() => {
              setSelectedEntry(contextEntry);
              setContextMenu(null);
            }}
          >
            Selecionar
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 text-left"
            onClick={() => {
              fileManager.deleteEntry(contextEntry.name);
              setContextMenu(null);
              toast.success('Item deletado!');
            }}
          >
            Deletar
          </button>
        </div>
      )}

      {/* Additional Dialogs */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        entries={fileManager.filteredEntries}
        folderMeta={fileManager.folderMeta}
      />
      <KeyboardShortcutsDialog
        open={showShortcutsDialog}
        onOpenChange={setShowShortcutsDialog}
      />
      <StorageStats
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        entries={fileManager.filteredEntries}
      />
    </div>
  );
}
