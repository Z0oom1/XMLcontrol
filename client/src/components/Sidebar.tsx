import { HardDrive, Settings, Download, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onConnect: () => void;
  onNewFolder: () => void;
  storageUsage?: number;
  selectedCount: number;
}

export default function Sidebar({
  onConnect,
  onNewFolder,
  storageUsage = 0,
  selectedCount,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Brand Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">XMLcontrol</h1>
            <p className="text-xs text-muted-foreground">Pro v3.0</p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="p-4 space-y-2 border-b border-border">
        <Button
          onClick={onConnect}
          className="w-full justify-start gap-2"
          variant="default"
        >
          <HardDrive className="w-4 h-4" />
          Conectar Pasta
        </Button>
        <Button
          onClick={onNewFolder}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          Nova Pasta
        </Button>
      </div>

      {/* Stats Section */}
      <div className="p-4 space-y-3 border-b border-border flex-1">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Selecionados</span>
            <span className="font-semibold text-foreground">{selectedCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Armazenamento</span>
            <span className="font-semibold text-foreground">{storageUsage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${storageUsage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2 border-t border-border">
        <Button
          onClick={toggleTheme}
          className="w-full justify-start gap-2"
          variant="ghost"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4" />
              Modo Claro
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Modo Escuro
            </>
          )}
        </Button>
        <Button
          className="w-full justify-start gap-2"
          variant="ghost"
        >
          <Settings className="w-4 h-4" />
          Configurações
        </Button>
      </div>
    </aside>
  );
}
