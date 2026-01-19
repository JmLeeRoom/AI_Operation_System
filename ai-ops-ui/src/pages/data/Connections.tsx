import { 
  Plus, 
  Search, 
  Filter,
  Database,
  Server,
  Cloud,
  HardDrive,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';
import type { ConnectionType } from '../../types';

const connections = [
  { id: '1', name: 'Production S3', type: 's3' as ConnectionType, endpoint: 's3://ml-data-prod', status: 'healthy', lastTested: '2 min ago' },
  { id: '2', name: 'Training Data', type: 'minio' as ConnectionType, endpoint: 'minio.internal:9000', status: 'healthy', lastTested: '5 min ago' },
  { id: '3', name: 'Feature Store', type: 'postgres' as ConnectionType, endpoint: 'postgres.internal:5432/features', status: 'healthy', lastTested: '1 hour ago' },
  { id: '4', name: 'Event Stream', type: 'kafka' as ConnectionType, endpoint: 'kafka.internal:9092', status: 'unhealthy', lastTested: '10 min ago' },
  { id: '5', name: 'External API', type: 'api' as ConnectionType, endpoint: 'https://api.external.com/v1', status: 'healthy', lastTested: '30 min ago' },
];

const typeConfig: Record<ConnectionType, { icon: React.ReactNode; className: string }> = {
  s3: { icon: <Cloud size={16} />, className: 'bg-orange-500/10 text-orange-400' },
  minio: { icon: <HardDrive size={16} />, className: 'bg-red-500/10 text-red-400' },
  postgres: { icon: <Database size={16} />, className: 'bg-blue-500/10 text-blue-400' },
  mysql: { icon: <Database size={16} />, className: 'bg-cyan-500/10 text-cyan-400' },
  kafka: { icon: <Server size={16} />, className: 'bg-violet-500/10 text-violet-400' },
  api: { icon: <Cloud size={16} />, className: 'bg-emerald-500/10 text-emerald-400' },
  file: { icon: <HardDrive size={16} />, className: 'bg-zinc-500/10 text-zinc-400' },
};

export function Connections() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Connections</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage data source connections</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>New Connection</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '5', color: 'text-foreground' },
          { label: 'Healthy', value: '4', color: 'text-emerald-400' },
          { label: 'Unhealthy', value: '1', color: 'text-red-400' },
          { label: 'Storage', value: '2', color: 'text-blue-400' },
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
                placeholder="Search connections..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Type</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {connections.map((connection) => {
          const type = typeConfig[connection.type];
          return (
            <Card key={connection.id} hover>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', type.className)}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{connection.name}</h3>
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded uppercase">
                        {connection.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{connection.endpoint}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded',
                        connection.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      )}>
                        {connection.status === 'healthy' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {connection.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">Tested {connection.lastTested}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <RefreshCw size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Settings size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-400">
                        <Trash2 size={14} />
                      </Button>
                    </div>
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
