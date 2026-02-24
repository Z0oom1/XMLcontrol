import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileEntry, FolderMeta } from '@/hooks/useFileManager';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: FileEntry[];
  folderMeta: Record<string, FolderMeta>;
}

export default function ExportDialog({
  open,
  onOpenChange,
  entries,
  folderMeta,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'json' | 'csv'>('json');

  const exportAsJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      entries: entries.map(e => ({
        name: e.name,
        kind: e.kind,
        size: e.size,
        modified: e.modified?.toISOString(),
        meta: folderMeta[e.name],
      })),
      metadata: folderMeta,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    downloadFile(blob, 'xmlcontrol-export.json');
  };

  const exportAsCSV = () => {
    const headers = ['Nome', 'Tipo', 'Tamanho (KB)', 'Modificado', 'Cor', 'Favorito'];
    const rows = entries.map(e => [
      e.name,
      e.kind,
      e.size ? (e.size / 1024).toFixed(2) : '',
      e.modified?.toLocaleDateString('pt-BR') || '',
      folderMeta[e.name]?.color || '',
      folderMeta[e.name]?.isFavorite ? 'Sim' : 'Não',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'xmlcontrol-export.csv');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Arquivo "${filename}" exportado com sucesso!`);
    onOpenChange(false);
  };

  const handleExport = () => {
    if (format === 'json') {
      exportAsJSON();
    } else {
      exportAsCSV();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
          <DialogDescription>
            Escolha o formato para exportar os dados dos arquivos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'json' | 'csv')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="format-json" />
              <Label htmlFor="format-json" className="cursor-pointer">
                <span className="font-medium">JSON</span>
                <p className="text-sm text-muted-foreground">
                  Formato estruturado com todos os metadados
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="format-csv" />
              <Label htmlFor="format-csv" className="cursor-pointer">
                <span className="font-medium">CSV</span>
                <p className="text-sm text-muted-foreground">
                  Formato tabular compatível com planilhas
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
