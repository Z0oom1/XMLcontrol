import { FileEntry } from '@/hooks/useFileManager';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StorageStatsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: FileEntry[];
}

export default function StorageStats({
  open,
  onOpenChange,
  entries,
}: StorageStatsProps) {
  const calculateStats = () => {
    let totalSize = 0;
    let fileCount = 0;
    let folderCount = 0;
    const typeStats: Record<string, number> = {};

    entries.forEach((entry) => {
      if (entry.kind === 'directory') {
        folderCount++;
      } else {
        fileCount++;
        if (entry.size) {
          totalSize += entry.size;
          const ext = entry.name.split('.').pop() || 'sem extensão';
          typeStats[ext] = (typeStats[ext] || 0) + entry.size;
        }
      }
    });

    const chartData = Object.entries(typeStats)
      .map(([name, size]) => ({
        name,
        value: Math.round((size / 1024 / 1024) * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      totalSize: Math.round((totalSize / 1024 / 1024) * 100) / 100,
      fileCount,
      folderCount,
      chartData,
    };
  };

  const stats = calculateStats();
  const colors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#6366f1',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Estatísticas de Armazenamento</DialogTitle>
          <DialogDescription>
            Análise detalhada do uso de espaço em disco
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Tamanho Total</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalSize} MB
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Arquivos</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.fileCount}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Pastas</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.folderCount}
              </p>
            </div>
          </div>

          {/* Chart */}
          {stats.chartData.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-4 text-foreground">
                Uso por Tipo de Arquivo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}MB`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} MB`}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Detailed List */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">
              Detalhamento por Tipo
            </h3>
            <div className="space-y-2">
              {stats.chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-foreground">.{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value} MB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
