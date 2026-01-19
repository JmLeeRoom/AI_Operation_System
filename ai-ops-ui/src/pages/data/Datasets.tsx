import { 
  Plus, 
  Search, 
  Filter,
  Database,
  Calendar,
  User,
  Tag,
  Eye,
  Cpu,
  Mic,
  Activity,
  Layers
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';
import type { DomainType } from '../../types';

const datasets = [
  {
    id: '1',
    name: 'ImageNet-Subset',
    description: 'Curated subset of ImageNet for object classification',
    owner: 'CV Team',
    domain: 'cv' as DomainType,
    tags: ['training', 'classification'],
    latestVersion: 'v2.1.0',
    rowCount: '1.2M images',
    size: '450 GB',
    updatedAt: '2 days ago',
  },
  {
    id: '2',
    name: 'Customer Support Conversations',
    description: 'Anonymized customer support chat logs',
    owner: 'NLP Team',
    domain: 'llm' as DomainType,
    tags: ['fine-tuning', 'chat'],
    latestVersion: 'v1.5.2',
    rowCount: '2.5M conversations',
    size: '12 GB',
    updatedAt: '1 week ago',
  },
  {
    id: '3',
    name: 'Speech Commands',
    description: 'Voice command recordings for wake word detection',
    owner: 'Audio Team',
    domain: 'audio' as DomainType,
    tags: ['training', 'speech'],
    latestVersion: 'v3.0.0',
    rowCount: '500K clips',
    size: '85 GB',
    updatedAt: '3 days ago',
  },
];

const domainConfig: Record<DomainType, { icon: React.ReactNode; className: string }> = {
  cv: { icon: <Eye size={16} />, className: 'bg-violet-500/10 text-violet-400' },
  llm: { icon: <Cpu size={16} />, className: 'bg-emerald-500/10 text-emerald-400' },
  audio: { icon: <Mic size={16} />, className: 'bg-blue-500/10 text-blue-400' },
  multimodal: { icon: <Layers size={16} />, className: 'bg-orange-500/10 text-orange-400' },
  timeseries: { icon: <Activity size={16} />, className: 'bg-cyan-500/10 text-cyan-400' },
  common: { icon: <Database size={16} />, className: 'bg-zinc-500/10 text-zinc-400' },
};

export function Datasets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Datasets</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your training data</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>Create Dataset</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search datasets..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Filters</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {datasets.map((dataset) => {
          const domain = domainConfig[dataset.domain];
          return (
            <Card key={dataset.id} hover>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', domain.className)}>
                    {domain.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{dataset.name}</h3>
                      <span className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">{dataset.latestVersion}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{dataset.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={12} />{dataset.owner}</span>
                      <span className="flex items-center gap-1"><Database size={12} />{dataset.rowCount}</span>
                      <span>{dataset.size}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />Updated {dataset.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary">Versions</Button>
                    <Button size="sm">Explore</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
