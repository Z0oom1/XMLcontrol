import { FileEntry, FolderMeta } from '@/hooks/useFileManager';
import { Folder, File, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileCardProps {
  entry: FileEntry;
  meta?: FolderMeta;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  viewMode: 'grid' | 'list' | 'details';
}

export default function FileCard({
  entry,
  meta,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
  viewMode,
}: FileCardProps) {
  const isFolder = entry.kind === 'directory';
  const isFavorite = meta?.isFavorite || false;

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200',
          'hover:bg-accent/5 cursor-pointer group',
          isSelected && 'bg-accent/10 border-accent'
        )}
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              isFolder ? 'bg-blue-100' : 'bg-gray-100'
            )}
            style={isFolder && meta?.color ? { backgroundColor: meta.color + '20' } : undefined}
          >
            {isFolder ? (
              <Folder className="w-5 h-5 text-blue-600" />
            ) : (
              <File className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{entry.name}</p>
            {entry.size && (
              <p className="text-xs text-muted-foreground">
                {(entry.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
        </div>
        {isFavorite && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
      </div>
    );
  }

  if (viewMode === 'details') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 px-4 py-4 rounded-lg border transition-all duration-200',
          'hover:bg-accent/5 cursor-pointer',
          isSelected && 'bg-accent/10 border-accent'
        )}
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
            isFolder ? 'bg-blue-100' : 'bg-gray-100'
          )}
          style={isFolder && meta?.color ? { backgroundColor: meta.color + '20' } : undefined}
        >
          {isFolder ? (
            <Folder className="w-6 h-6 text-blue-600" />
          ) : (
            <File className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{entry.name}</p>
          <p className="text-xs text-muted-foreground">
            {isFolder ? 'Pasta' : 'Arquivo'} • {entry.modified?.toLocaleDateString('pt-BR')}
          </p>
        </div>
        {entry.size && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {(entry.size / 1024).toFixed(1)} KB
            </p>
          </div>
        )}
        {isFavorite && <Heart className="w-5 h-5 text-red-500 fill-red-500" />}
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200',
        'hover:bg-accent/5 cursor-pointer group',
        isSelected && 'bg-accent/10 border-accent'
      )}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-lg flex items-center justify-center relative',
          isFolder ? 'bg-blue-100' : 'bg-gray-100'
        )}
        style={isFolder && meta?.color ? { backgroundColor: meta.color + '20' } : undefined}
      >
        {isFolder ? (
          <Folder className="w-8 h-8 text-blue-600" />
        ) : (
          <File className="w-8 h-8 text-gray-600" />
        )}
        {isFavorite && (
          <Heart className="w-4 h-4 text-red-500 fill-red-500 absolute -top-1 -right-1" />
        )}
      </div>
      <p className="text-xs font-medium text-center truncate w-full text-foreground">
        {entry.name}
      </p>
      {entry.size && (
        <p className="text-xs text-muted-foreground">
          {(entry.size / 1024).toFixed(1)} KB
        </p>
      )}
    </div>
  );
}
