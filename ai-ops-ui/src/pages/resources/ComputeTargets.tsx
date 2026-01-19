import { 
  Plus, 
  Search, 
  Filter,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Play,
  Pause,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const computeTargets = [
  {
    id: '1',
    name: 'gpu-cluster-01',
    type: 'GPU Cluster',
    provider: 'AWS',
    instances: '8x A100',
    status: 'running',
    utilization: 78,
    jobs: 12,
    costHour: 45.60,
  },
  {
    id: '2',
    name: 'cpu-cluster-main',
    type: 'CPU Cluster',
    provider: 'GCP',
    instances: '32x n2-standard-8',
    status: 'running',
    utilization: 45,
    jobs: 28,
    costHour: 12.80,
  },
  {
    id: '3',
    name: 'inference-cluster',
    type: 'GPU Cluster',
    provider: 'AWS',
    instances: '4x T4',
    status: 'running',
    utilization: 92,
    jobs: 3,
    costHour: 8.40,
  },
  {
    id: '4',
    name: 'dev-cluster',
    type: 'CPU Cluster',
    provider: 'Azure',
    instances: '8x Standard_D4s_v3',
    status: 'stopped',
    utilization: 0,
    jobs: 0,
    costHour: 0,
  },
];

const statusConfig = {
  running: { label: 'Running', className: 'bg-emerald-500/10 text-emerald-400' },
  stopped: { label: 'Stopped', className: 'bg-zinc-500/10 text-zinc-400' },
  starting: { label: 'Starting', className: 'bg-blue-500/10 text-blue-400' },
};

export function ComputeTargets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Compute Targets</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage compute resources</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>Add Cluster</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Clusters', value: '3', icon: <Server size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total GPUs', value: '20', icon: <Cpu size={16} />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Running Jobs', value: '43', icon: <Activity size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Cost/Hour', value: '$66.80', icon: <HardDrive size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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
                placeholder="Search clusters..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Type</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {computeTargets.map((target) => {
          const status = statusConfig[target.status as keyof typeof statusConfig];
          return (
            <Card key={target.id} hover>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Server size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{target.name}</h3>
                      <p className="text-xs text-muted-foreground">{target.type} • {target.provider}</p>
                    </div>
                  </div>
                  <span className={cn('px-2 py-0.5 text-xs font-medium rounded', status.className)}>
                    {status.label}
                  </span>
                </div>

                <div className="p-2.5 rounded-md bg-muted/30 mb-3">
                  <p className="text-xs text-muted-foreground">{target.instances}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 rounded-md bg-muted/30">
                    <p className={cn(
                      'text-sm font-semibold',
                      target.utilization > 80 ? 'text-amber-400' : 'text-foreground'
                    )}>
                      {target.utilization}%
                    </p>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/30">
                    <p className="text-sm font-semibold text-foreground">{target.jobs}</p>
                    <p className="text-xs text-muted-foreground">Jobs</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/30">
                    <p className="text-sm font-semibold text-foreground">${target.costHour.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">/hour</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  {target.status === 'running' ? (
                    <Button size="sm" variant="secondary" leftIcon={<Pause size={12} />}>Stop</Button>
                  ) : (
                    <Button size="sm" variant="secondary" leftIcon={<Play size={12} />}>Start</Button>
                  )}
                  <Button size="sm" variant="ghost" leftIcon={<Settings size={12} />}>Configure</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
