import { Search, Grid3x3, List, LayoutList, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViewMode } from '@/hooks/useFileManager';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  breadcrumbs: string;
}

export default function Toolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  breadcrumbs,
}: ToolbarProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 space-y-4">
      {/* Navigation and Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <Button
            onClick={onBack}
            disabled={!canGoBack}
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={onForward}
            disabled={!canGoForward}
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-muted-foreground font-medium">
          {breadcrumbs || 'Raiz'}
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar arquivos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          <Button
            onClick={() => onViewModeChange('grid')}
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            title="Visualização em Grade"
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onViewModeChange('list')}
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            title="Visualização em Lista"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onViewModeChange('details')}
            size="sm"
            variant={viewMode === 'details' ? 'default' : 'ghost'}
            className="h-8 w-8 p-0"
            title="Visualização Detalhada"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
