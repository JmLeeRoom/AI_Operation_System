import { 
  Search, 
  Filter,
  Calendar,
  GitBranch,
  CheckCircle,
  Clock,
  XCircle,
  Rocket,
  RotateCcw,
  User
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const releases = [
  {
    id: '1',
    name: 'cv-classifier-prod v2.3.1',
    model: 'cv-object-detector v2.3.1',
    endpoint: 'cv-classifier-prod',
    status: 'completed',
    strategy: 'Canary (10% → 100%)',
    startedAt: '2 hours ago',
    completedAt: '1 hour ago',
    initiator: 'JaeMyeong',
  },
  {
    id: '2',
    name: 'llm-inference-staging v1.2.0',
    model: 'llm-customer-support v1.2.0',
    endpoint: 'llm-inference-staging',
    status: 'in_progress',
    strategy: 'Blue-Green',
    startedAt: '30 min ago',
    completedAt: null,
    initiator: 'TeamML',
    progress: 65,
  },
  {
    id: '3',
    name: 'audio-transcriber-prod v2.9.0',
    model: 'audio-transcriber v2.9.0',
    endpoint: 'audio-transcriber-prod',
    status: 'failed',
    strategy: 'Rolling',
    startedAt: '1 day ago',
    completedAt: '1 day ago',
    initiator: 'Audio Team',
    error: 'Health check failed after deployment',
  },
];

const statusConfig = {
  completed: { icon: <CheckCircle size={16} />, className: 'bg-emerald-500/10 text-emerald-400', label: 'Completed' },
  in_progress: { icon: <Clock size={16} className="animate-spin" />, className: 'bg-blue-500/10 text-blue-400', label: 'In Progress' },
  failed: { icon: <XCircle size={16} />, className: 'bg-red-500/10 text-red-400', label: 'Failed' },
  rolled_back: { icon: <RotateCcw size={16} />, className: 'bg-amber-500/10 text-amber-400', label: 'Rolled Back' },
};

export function Releases() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Releases</h1>
          <p className="text-sm text-muted-foreground mt-1">Track deployment releases</p>
        </div>
        <Button leftIcon={<Rocket size={14} />}>New Release</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Releases', value: '89', color: 'text-foreground' },
          { label: 'Successful', value: '82', color: 'text-emerald-400' },
          { label: 'In Progress', value: '1', color: 'text-blue-400' },
          { label: 'Failed', value: '6', color: 'text-red-400' },
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
                placeholder="Search releases..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Calendar size={14} />}>Date Range</Button>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Status</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {releases.map((release) => {
          const status = statusConfig[release.status as keyof typeof statusConfig];
          return (
            <Card key={release.id} hover>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className={cn('p-2 rounded-lg', status.className)}>
                    {status.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{release.name}</h3>
                      <span className={cn('px-2 py-0.5 text-xs font-medium rounded', status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><GitBranch size={12} />{release.model}</span>
                      <span className="flex items-center gap-1"><Rocket size={12} />{release.endpoint}</span>
                      <span>{release.strategy}</span>
                    </div>

                    {release.status === 'in_progress' && release.progress && (
                      <div className="mb-2">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${release.progress}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{release.progress}% complete</p>
                      </div>
                    )}

                    {release.error && (
                      <p className="text-xs text-red-400 mb-2">{release.error}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={12} />{release.initiator}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />Started {release.startedAt}</span>
                      {release.completedAt && <span>Completed {release.completedAt}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {release.status === 'failed' && (
                      <Button size="sm" variant="secondary" leftIcon={<RotateCcw size={12} />}>Retry</Button>
                    )}
                    {release.status === 'completed' && (
                      <Button size="sm" variant="ghost" leftIcon={<RotateCcw size={12} />}>Rollback</Button>
                    )}
                    <Button size="sm" variant="ghost">Details</Button>
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
