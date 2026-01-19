import { 
  Plus, 
  Search, 
  Filter,
  Bell,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const alerts = [
  {
    id: '1',
    title: 'High error rate on audio-transcriber-prod',
    description: 'Error rate exceeded threshold of 1% (currently 2.5%)',
    severity: 'warning',
    source: 'audio-transcriber-prod',
    triggeredAt: '5 min ago',
    acknowledged: false,
  },
  {
    id: '2',
    title: 'GPU memory > 90% on training cluster',
    description: 'GPU 0 memory usage is at 94%',
    severity: 'warning',
    source: 'gpu-cluster-01',
    triggeredAt: '12 min ago',
    acknowledged: true,
  },
  {
    id: '3',
    title: 'Run cv-training-45 failed',
    description: 'Pipeline failed at task "Train Model" - OOM error',
    severity: 'error',
    source: 'cv-training-45',
    triggeredAt: '25 min ago',
    acknowledged: false,
  },
  {
    id: '4',
    title: 'Model drift detected on cv-classifier',
    description: 'Feature drift score exceeded threshold (0.15 > 0.1)',
    severity: 'info',
    source: 'cv-classifier-prod',
    triggeredAt: '1 hour ago',
    acknowledged: true,
  },
];

const severityConfig = {
  error: { icon: <XCircle size={16} />, className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  warning: { icon: <AlertTriangle size={16} />, className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  info: { icon: <Info size={16} />, className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

export function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor system alerts and notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Settings size={14} />}>Rules</Button>
          <Button leftIcon={<Plus size={14} />}>Create Alert</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Critical', value: '0', icon: <XCircle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Warning', value: '2', icon: <AlertTriangle size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Info', value: '1', icon: <Info size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Resolved (24h)', value: '12', icon: <CheckCircle size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
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
                placeholder="Search alerts..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Severity</Button>
            <div className="flex gap-2">
              {['All', 'Active', 'Acknowledged'].map((filter) => (
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

      <div className="space-y-3">
        {alerts.map((alert) => {
          const severity = severityConfig[alert.severity as keyof typeof severityConfig];
          return (
            <Card key={alert.id}>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className={cn('p-2 rounded-lg', severity.className)}>
                    {severity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{alert.title}</h3>
                      {alert.acknowledged && (
                        <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">Acknowledged</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Source: {alert.source}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{alert.triggeredAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.acknowledged && (
                      <Button size="sm" variant="secondary">Acknowledge</Button>
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
