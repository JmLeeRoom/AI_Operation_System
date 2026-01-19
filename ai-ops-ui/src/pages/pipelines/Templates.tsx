import { 
  Search, 
  Filter,
  Star,
  Download,
  Eye,
  Cpu,
  Mic,
  Activity,
  Layers,
  Play
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';
import type { DomainType } from '../../types';

const templates = [
  {
    id: '1',
    name: 'Image Classification Training',
    description: 'End-to-end pipeline for training image classification models with data validation and evaluation',
    domain: 'cv' as DomainType,
    stars: 128,
    uses: 456,
    author: 'ML Platform Team',
  },
  {
    id: '2',
    name: 'LLM Fine-tuning',
    description: 'Fine-tune large language models with LoRA, data preprocessing and evaluation',
    domain: 'llm' as DomainType,
    stars: 95,
    uses: 234,
    author: 'NLP Team',
  },
  {
    id: '3',
    name: 'Audio Transcription',
    description: 'Speech-to-text pipeline with preprocessing, model inference and post-processing',
    domain: 'audio' as DomainType,
    stars: 67,
    uses: 189,
    author: 'Audio Team',
  },
  {
    id: '4',
    name: 'Time Series Forecasting',
    description: 'Forecasting pipeline with feature engineering, training and evaluation',
    domain: 'timeseries' as DomainType,
    stars: 54,
    uses: 145,
    author: 'DataOps',
  },
  {
    id: '5',
    name: 'Data Validation Only',
    description: 'Standalone data validation pipeline with schema checks and quality metrics',
    domain: 'common' as DomainType,
    stars: 82,
    uses: 678,
    author: 'Data Engineering',
  },
];

const domainConfig: Record<DomainType, { icon: React.ReactNode; className: string }> = {
  cv: { icon: <Eye size={16} />, className: 'bg-violet-500/10 text-violet-400' },
  llm: { icon: <Cpu size={16} />, className: 'bg-emerald-500/10 text-emerald-400' },
  audio: { icon: <Mic size={16} />, className: 'bg-blue-500/10 text-blue-400' },
  multimodal: { icon: <Layers size={16} />, className: 'bg-orange-500/10 text-orange-400' },
  timeseries: { icon: <Activity size={16} />, className: 'bg-cyan-500/10 text-cyan-400' },
  common: { icon: <Layers size={16} />, className: 'bg-zinc-500/10 text-zinc-400' },
};

export function Templates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pipeline Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Start from pre-built pipeline templates</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'CV', 'LLM', 'Audio', 'Timeseries'].map((filter) => (
                <button
                  key={filter}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    filter === 'All' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => {
          const domain = domainConfig[template.domain];
          return (
            <Card key={template.id} hover>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', domain.className)}>
                    {domain.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{template.name}</h3>
                      <span className={cn('px-1.5 py-0.5 text-xs font-medium rounded uppercase', domain.className)}>
                        {template.domain}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400" />
                        {template.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={12} />
                        {template.uses} uses
                      </span>
                      <span>by {template.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <Button size="sm" leftIcon={<Play size={12} />} className="flex-1">Use Template</Button>
                  <Button size="sm" variant="secondary" leftIcon={<Eye size={12} />}>Preview</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
