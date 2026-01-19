import { 
  Plus, 
  Search, 
  Filter,
  Key,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Edit,
  Trash2,
  RefreshCw,
  Shield
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const secrets = [
  {
    id: '1',
    name: 'AWS_ACCESS_KEY',
    description: 'AWS access key for S3 and other services',
    lastUsed: '5 min ago',
    lastRotated: '30 days ago',
    expiresIn: '60 days',
    usedBy: ['CV Training Pipeline', 'Data Loader'],
  },
  {
    id: '2',
    name: 'POSTGRES_CONNECTION',
    description: 'Feature store database connection string',
    lastUsed: '1 hour ago',
    lastRotated: '15 days ago',
    expiresIn: '75 days',
    usedBy: ['Data Validation', 'Feature Pipeline'],
  },
  {
    id: '3',
    name: 'HUGGINGFACE_TOKEN',
    description: 'HuggingFace API token for model downloads',
    lastUsed: '2 days ago',
    lastRotated: '45 days ago',
    expiresIn: '45 days',
    usedBy: ['LLM Fine-tuning'],
  },
  {
    id: '4',
    name: 'WANDB_API_KEY',
    description: 'Weights & Biases experiment tracking',
    lastUsed: '30 min ago',
    lastRotated: '7 days ago',
    expiresIn: '83 days',
    usedBy: ['All training pipelines'],
  },
];

export function Secrets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Secrets</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage encrypted credentials and API keys</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>Add Secret</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Secrets', value: '12', icon: <Key size={16} />, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Active', value: '10', icon: <Shield size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Expiring Soon', value: '2', icon: <Clock size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Expired', value: '0', icon: <Clock size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className={cn('text-2xl font-semibold', stat.color)}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
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
                placeholder="Search secrets..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {secrets.map((secret) => (
          <Card key={secret.id} hover>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-mono font-medium text-foreground">{secret.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{secret.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye size={12} />Last used {secret.lastUsed}</span>
                    <span className="flex items-center gap-1"><RefreshCw size={12} />Rotated {secret.lastRotated}</span>
                    <span className={cn(
                      'flex items-center gap-1',
                      parseInt(secret.expiresIn) < 60 ? 'text-amber-400' : ''
                    )}>
                      <Clock size={12} />Expires in {secret.expiresIn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Used by:</span>
                    {secret.usedBy.map((user) => (
                      <span key={user} className="px-1.5 py-0.5 text-xs bg-muted rounded">{user}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="secondary" leftIcon={<RefreshCw size={12} />}>Rotate</Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-400">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
