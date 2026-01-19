import { 
  Plus, 
  Search, 
  Filter,
  Beaker,
  Calendar,
  User,
  TrendingUp,
  BarChart2,
  GitCompare
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { cn } from '../../lib/utils';
import type { RunStatus } from '../../types';

const experiments = [
  {
    id: '1',
    name: 'ResNet vs EfficientNet on ImageNet',
    description: 'Compare performance of different backbone architectures',
    owner: 'JaeMyeong',
    runs: 24,
    bestMetric: { name: 'mAP@50', value: 94.2 },
    status: 'RUNNING' as RunStatus,
    createdAt: '2 days ago',
    tags: ['cv', 'classification'],
  },
  {
    id: '2',
    name: 'LLM Fine-tuning Learning Rate Sweep',
    description: 'Finding optimal LR for customer support model',
    owner: 'NLP Team',
    runs: 48,
    bestMetric: { name: 'BLEU', value: 0.89 },
    status: 'SUCCEEDED' as RunStatus,
    createdAt: '1 week ago',
    tags: ['llm', 'hyperparameter'],
  },
  {
    id: '3',
    name: 'Data Augmentation Impact Study',
    description: 'Measuring effect of various augmentation strategies',
    owner: 'CV Team',
    runs: 16,
    bestMetric: { name: 'Accuracy', value: 97.8 },
    status: 'SUCCEEDED' as RunStatus,
    createdAt: '3 days ago',
    tags: ['cv', 'augmentation'],
  },
];

export function ExperimentList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Experiments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and compare ML experiments</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>New Experiment</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active', value: '5', color: 'text-blue-400' },
          { label: 'Total Runs', value: '1,234', color: 'text-foreground' },
          { label: 'Completed', value: '89', color: 'text-emerald-400' },
          { label: 'Best mAP', value: '94.2%', color: 'text-primary' },
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
                placeholder="Search experiments..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Filters</Button>
            <Button variant="outline" size="sm" leftIcon={<GitCompare size={14} />}>Compare</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {experiments.map((experiment) => (
          <Card key={experiment.id} hover>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Beaker size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{experiment.name}</h3>
                    <StatusBadge status={experiment.status} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{experiment.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={12} />{experiment.owner}</span>
                    <span className="flex items-center gap-1"><BarChart2 size={12} />{experiment.runs} runs</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      Best {experiment.bestMetric.name}: <span className="text-emerald-400">{experiment.bestMetric.value}</span>
                    </span>
                    <span className="flex items-center gap-1"><Calendar size={12} />Created {experiment.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" leftIcon={<BarChart2 size={12} />}>Metrics</Button>
                  <Button size="sm" leftIcon={<GitCompare size={12} />}>Compare</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
