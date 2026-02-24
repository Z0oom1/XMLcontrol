import { FileEntry, FolderMeta } from '@/hooks/useFileManager';
import { Folder, File, Heart, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface InspectorPanelProps {
  entry: FileEntry | null;
  meta: FolderMeta | undefined;
  onMetaUpdate: (meta: FolderMeta) => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export default function InspectorPanel({
  entry,
  meta,
  onMetaUpdate,
  onDelete,
  onRename,
}: InspectorPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(entry?.name || '');
  const [selectedColor, setSelectedColor] = useState(meta?.color || '#3b82f6' as string);

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#6366f1', // indigo
  ];

  const handleSaveName = () => {
    if (editName && editName !== entry?.name) {
      onRename(editName);
    }
    setIsEditing(false);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (entry) {
      onMetaUpdate({
        color,
        icon: meta?.icon,
        tags: meta?.tags,
        isFavorite: meta?.isFavorite,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (entry) {
      onMetaUpdate({
        color: meta?.color || selectedColor,
        icon: meta?.icon,
        tags: meta?.tags,
        isFavorite: !meta?.isFavorite,
      });
    }
  };

  if (!entry) {
    return (
      <div className="w-72 bg-card border-l border-border flex flex-col items-center justify-center h-screen p-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto">
            <File className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Selecione um arquivo para ver detalhes
          </p>
        </div>
      </div>
    );
  }

  const isFolder = entry.kind === 'directory';

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border sticky top-0 bg-card">
        <h2 className="font-semibold text-foreground text-sm">Detalhes do Item</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Icon Preview */}
        <div
          className={cn(
            'w-full h-32 rounded-lg flex items-center justify-center',
            isFolder ? 'bg-blue-100' : 'bg-gray-100'
          )}
          style={isFolder && meta?.color ? { backgroundColor: meta.color + '20' } : undefined}
        >
          {isFolder ? (
            <Folder className="w-12 h-12 text-blue-600" />
          ) : (
            <File className="w-12 h-12 text-gray-600" />
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Nome</label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-sm"
              />
              <Button
                onClick={handleSaveName}
                size="sm"
                variant="default"
              >
                Salvar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground break-words">{entry.name}</p>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="ghost"
              >
                Editar
              </Button>
            </div>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Tipo</label>
          <p className="text-sm text-foreground">
            {isFolder ? 'Pasta' : 'Arquivo'}
          </p>
        </div>

        {/* Size */}
        {entry.size && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Tamanho</label>
            <p className="text-sm text-foreground">
              {(entry.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {/* Modified Date */}
        {entry.modified && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Modificado
            </label>
            <p className="text-sm text-foreground">
              {entry.modified.toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {/* Color Picker */}
        {isFolder && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Cor</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    'w-8 h-8 rounded-lg transition-all duration-200',
                    selectedColor === color && 'ring-2 ring-offset-2 ring-offset-card ring-foreground'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Favorite */}
        <div className="space-y-2">
          <Button
            onClick={handleToggleFavorite}
            variant={meta?.isFavorite ? 'default' : 'outline'}
            className="w-full justify-start gap-2"
          >
            <Heart className={cn('w-4 h-4', meta?.isFavorite && 'fill-current')} />
            {meta?.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          onClick={onDelete}
          variant="destructive"
          className="w-full"
        >
          Deletar
        </Button>
      </div>
    </div>
  );
}
