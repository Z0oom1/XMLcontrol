import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  {
    category: 'Navegação',
    items: [
      { key: 'Backspace', description: 'Voltar para pasta anterior' },
      { key: 'Ctrl + A', description: 'Selecionar todos os itens' },
      { key: 'Delete', description: 'Deletar item selecionado' },
    ],
  },
  {
    category: 'Visualização',
    items: [
      { key: 'Ctrl + 1', description: 'Visualização em Grade' },
      { key: 'Ctrl + 2', description: 'Visualização em Lista' },
      { key: 'Ctrl + 3', description: 'Visualização Detalhada' },
    ],
  },
  {
    category: 'Edição',
    items: [
      { key: 'Ctrl + Z', description: 'Desfazer ação' },
      { key: 'Ctrl + Y', description: 'Refazer ação' },
      { key: 'F2', description: 'Renomear item selecionado' },
    ],
  },
  {
    category: 'Arquivo',
    items: [
      { key: 'Ctrl + E', description: 'Exportar dados' },
      { key: 'Ctrl + N', description: 'Criar nova pasta' },
      { key: 'Ctrl + ?', description: 'Abrir atalhos de teclado' },
    ],
  },
];

export default function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Atalhos de Teclado</DialogTitle>
          <DialogDescription>
            Conheça todos os atalhos disponíveis para usar o XMLcontrol Pro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-sm mb-3 text-foreground">
                {group.category}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{item.description}</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono font-semibold border border-border">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
