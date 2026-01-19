import { 
  Search, 
  Filter,
  BarChart2,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Play
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const evaluations = [
  {
    id: '1',
    model: 'cv-object-detector',
    version: 'v2.3.1',
    dataset: 'test-set-v1.0',
    metrics: { 'mAP@50': 94.2, 'Precision': 92.8, 'Recall': 95.1 },
    status: 'passed',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    model: 'llm-customer-support',
    version: 'v1.2.0',
    dataset: 'eval-conversations',
    metrics: { 'BLEU': 0.89, 'ROUGE-L': 0.85, 'Perplexity': 12.3 },
    status: 'passed',
    createdAt: '1 day ago',
  },
  {
    id: '3',
    model: 'cv-object-detector',
    version: 'v2.3.0',
    dataset: 'test-set-v1.0',
    metrics: { 'mAP@50': 91.8, 'Precision': 90.2, 'Recall': 93.4 },
    status: 'warning',
    createdAt: '3 days ago',
  },
];

export function Evaluations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Model Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">Track model performance metrics</p>
        </div>
        <Button leftIcon={<Play size={14} />}>Run Evaluation</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Evals', value: '156', color: 'text-foreground' },
          { label: 'Passed', value: '142', color: 'text-emerald-400' },
          { label: 'Warnings', value: '12', color: 'text-amber-400' },
          { label: 'Failed', value: '2', color: 'text-red-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn('text-2xl font-semibold', stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search evaluations..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Model</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} hover>
            <CardContent>
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  'p-2 rounded-lg',
                  evaluation.status === 'passed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                )}>
                  {evaluation.status === 'passed' 
                    ? <CheckCircle size={16} className="text-emerald-400" />
                    : <AlertTriangle size={16} className="text-amber-400" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{evaluation.model}</h3>
                    <span className="px-1.5 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded">
                      {evaluation.version}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Dataset: {evaluation.dataset}</p>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} />
                  {evaluation.createdAt}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {Object.entries(evaluation.metrics).map(([name, value]) => (
                  <div key={name} className="p-3 rounded-md bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">{name}</p>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                      {typeof value === 'number' && value > 1 ? value.toFixed(1) : value}
                      <TrendingUp size={14} className="text-emerald-400" />
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <Button size="sm" variant="secondary" leftIcon={<BarChart2 size={12} />}>View Details</Button>
                <Button size="sm" variant="ghost">Compare</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
