import { 
  Plus, 
  Search, 
  Cpu,
  HardDrive,
  Zap,
  Settings,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const profiles = [
  {
    id: '1',
    name: 'GPU-2x (A100)',
    description: 'High-performance training profile',
    cpu: '16 cores',
    memory: '128 GB',
    gpu: '2x A100 80GB',
    storage: '500 GB SSD',
    costHour: 12.50,
    isSpot: false,
    usedBy: 24,
  },
  {
    id: '2',
    name: 'GPU-1x (T4)',
    description: 'Inference and light training',
    cpu: '8 cores',
    memory: '32 GB',
    gpu: '1x T4 16GB',
    storage: '100 GB SSD',
    costHour: 2.80,
    isSpot: false,
    usedBy: 45,
  },
  {
    id: '3',
    name: 'CPU-Large',
    description: 'Data processing and preprocessing',
    cpu: '32 cores',
    memory: '64 GB',
    gpu: null,
    storage: '200 GB SSD',
    costHour: 1.20,
    isSpot: true,
    usedBy: 89,
  },
  {
    id: '4',
    name: 'CPU-Small',
    description: 'Light tasks and testing',
    cpu: '4 cores',
    memory: '8 GB',
    gpu: null,
    storage: '50 GB SSD',
    costHour: 0.15,
    isSpot: true,
    usedBy: 156,
  },
];

export function ResourceProfiles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Resource Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage compute resource templates</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>New Profile</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search profiles..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'GPU', 'CPU', 'Spot'].map((filter) => (
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
        {profiles.map((profile) => (
          <Card key={profile.id} hover>
            <CardContent>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{profile.name}</h3>
                    {profile.isSpot && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-400 rounded">
                        Spot
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">${profile.costHour.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">/hour</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="p-2 rounded-md bg-muted/30 text-center">
                  <Cpu size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">{profile.cpu}</p>
                </div>
                <div className="p-2 rounded-md bg-muted/30 text-center">
                  <HardDrive size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">{profile.memory}</p>
                </div>
                <div className="p-2 rounded-md bg-muted/30 text-center">
                  <Zap size={14} className={cn('mx-auto mb-1', profile.gpu ? 'text-emerald-400' : 'text-muted-foreground')} />
                  <p className="text-xs font-medium text-foreground">{profile.gpu || 'None'}</p>
                </div>
                <div className="p-2 rounded-md bg-muted/30 text-center">
                  <HardDrive size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">{profile.storage}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Used by {profile.usedBy} pipelines</p>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Copy size={12} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Edit size={12} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-400">
                    <Trash2 size={12} />
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
