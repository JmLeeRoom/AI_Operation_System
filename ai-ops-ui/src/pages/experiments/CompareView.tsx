import { 
  Search, 
  Filter,
  Plus,
  Minus,
  BarChart2,
  TrendingUp,
  Layers
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const selectedRuns = [
  { id: 'run-a', name: 'ResNet-50 baseline', color: 'bg-blue-500' },
  { id: 'run-b', name: 'EfficientNet-B4', color: 'bg-emerald-500' },
  { id: 'run-c', name: 'ResNet-50 + aug', color: 'bg-violet-500' },
];

const metrics = [
  { name: 'Accuracy', values: [0.923, 0.941, 0.956], unit: '' },
  { name: 'mAP@50', values: [0.892, 0.918, 0.934], unit: '' },
  { name: 'F1 Score', values: [0.915, 0.932, 0.948], unit: '' },
  { name: 'Inference Time', values: [45, 62, 48], unit: 'ms' },
  { name: 'Model Size', values: [98, 78, 98], unit: 'MB' },
];

const params = [
  { name: 'Learning Rate', values: ['0.001', '0.0001', '0.001'] },
  { name: 'Batch Size', values: ['32', '16', '32'] },
  { name: 'Epochs', values: ['100', '150', '100'] },
  { name: 'Optimizer', values: ['Adam', 'AdamW', 'Adam'] },
  { name: 'Augmentation', values: ['None', 'RandAugment', 'AutoAugment'] },
];

export function CompareView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Compare Runs</h1>
          <p className="text-sm text-muted-foreground mt-1">Side-by-side comparison of experiment runs</p>
        </div>
        <Button variant="outline" leftIcon={<Plus size={14} />}>Add Run</Button>
      </div>

      {/* Selected Runs */}
      <div className="flex items-center gap-3">
        {selectedRuns.map((run) => (
          <div key={run.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
            <div className={cn('w-2 h-2 rounded-full', run.color)} />
            <span className="text-sm text-foreground">{run.name}</span>
            <button className="p-0.5 rounded hover:bg-muted">
              <Minus size={12} className="text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Metrics Comparison */}
        <Card>
          <CardHeader title="Metrics" action={
            <Button size="sm" variant="ghost" leftIcon={<BarChart2 size={12} />}>Charts</Button>
          } />
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Metric</th>
                  {selectedRuns.map((run) => (
                    <th key={run.id} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', run.color)} />
                        {run.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {metrics.map((metric) => {
                  const maxVal = Math.max(...metric.values);
                  return (
                    <tr key={metric.name} className="hover:bg-muted/20">
                      <td className="px-4 py-2 text-sm font-medium text-foreground">{metric.name}</td>
                      {metric.values.map((value, i) => (
                        <td key={i} className="px-4 py-2">
                          <span className={cn(
                            'text-sm',
                            value === maxVal ? 'text-emerald-400 font-medium' : 'text-foreground'
                          )}>
                            {value}{metric.unit}
                            {value === maxVal && <TrendingUp size={12} className="inline ml-1" />}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Parameters Comparison */}
        <Card>
          <CardHeader title="Parameters" action={
            <Button size="sm" variant="ghost" leftIcon={<Layers size={12} />}>Diff Only</Button>
          } />
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Parameter</th>
                  {selectedRuns.map((run) => (
                    <th key={run.id} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', run.color)} />
                        {run.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {params.map((param) => {
                  const allSame = param.values.every(v => v === param.values[0]);
                  return (
                    <tr key={param.name} className={cn('hover:bg-muted/20', !allSame && 'bg-amber-500/5')}>
                      <td className="px-4 py-2 text-sm font-medium text-foreground">{param.name}</td>
                      {param.values.map((value, i) => (
                        <td key={i} className="px-4 py-2">
                          <span className={cn('text-sm', !allSame && 'text-amber-400')}>
                            {value}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <Card>
        <CardHeader title="Training Curves" />
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart2 size={32} className="mx-auto mb-2" />
              <p className="text-sm">Loss & Accuracy curves over epochs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
