import { 
  Search, 
  Filter,
  Calendar,
  Download,
  Eye,
  User,
  Activity,
  GitBranch,
  Database,
  Box,
  Shield
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const auditLogs = [
  { 
    id: '1', 
    action: 'pipeline.run.started', 
    resource: 'CV Training Pipeline', 
    user: 'JaeMyeong',
    timestamp: '2 min ago',
    details: 'Run run-001 started manually',
    category: 'pipeline',
  },
  { 
    id: '2', 
    action: 'model.deployed', 
    resource: 'cv-detector-v2.3', 
    user: 'TeamML',
    timestamp: '15 min ago',
    details: 'Deployed to cv-classifier-prod endpoint',
    category: 'model',
  },
  { 
    id: '3', 
    action: 'dataset.version.created', 
    resource: 'ImageNet-Subset', 
    user: 'CV Team',
    timestamp: '1 hour ago',
    details: 'Version v2.1.0 created',
    category: 'data',
  },
  { 
    id: '4', 
    action: 'user.role.updated', 
    resource: 'alice@company.com', 
    user: 'Admin',
    timestamp: '2 hours ago',
    details: 'Role changed from Viewer to MLEngineer',
    category: 'access',
  },
  { 
    id: '5', 
    action: 'secret.accessed', 
    resource: 'AWS_ACCESS_KEY', 
    user: 'Pipeline Service',
    timestamp: '3 hours ago',
    details: 'Secret accessed by run-001',
    category: 'access',
  },
];

const categoryConfig = {
  pipeline: { icon: <GitBranch size={14} />, className: 'bg-violet-500/10 text-violet-400' },
  model: { icon: <Box size={14} />, className: 'bg-emerald-500/10 text-emerald-400' },
  data: { icon: <Database size={14} />, className: 'bg-blue-500/10 text-blue-400' },
  access: { icon: <Shield size={14} />, className: 'bg-amber-500/10 text-amber-400' },
};

export function AuditLog() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all system activities</p>
        </div>
        <Button variant="outline" leftIcon={<Download size={14} />}>Export Logs</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search audit logs..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Calendar size={14} />}>Date Range</Button>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Category</Button>
            <div className="flex gap-2">
              {['All', 'Pipeline', 'Model', 'Data', 'Access'].map((filter) => (
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

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {auditLogs.map((log) => {
              const category = categoryConfig[log.category as keyof typeof categoryConfig];
              return (
                <div key={log.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div className={cn('w-8 h-8 rounded-md flex items-center justify-center', category.className)}>
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{log.action}</span>
                      <span className="text-xs text-muted-foreground">on</span>
                      <span className="text-sm text-primary">{log.resource}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                      <User size={12} />
                      {log.user}
                    </p>
                    <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Eye size={12} />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
