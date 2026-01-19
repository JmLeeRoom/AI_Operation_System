import { 
  Plus, 
  Search, 
  Filter,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const policies = [
  {
    id: '1',
    name: 'Model Approval Required',
    description: 'All production deployments require manual approval',
    type: 'deployment',
    enabled: true,
    violations: 0,
  },
  {
    id: '2',
    name: 'Data Validation Gate',
    description: 'Training data must pass validation before use',
    type: 'data',
    enabled: true,
    violations: 2,
  },
  {
    id: '3',
    name: 'Cost Limit per Run',
    description: 'Single run cannot exceed $500 without approval',
    type: 'cost',
    enabled: true,
    violations: 0,
  },
  {
    id: '4',
    name: 'GPU Time Limit',
    description: 'Maximum 8 hours GPU time per run',
    type: 'resource',
    enabled: false,
    violations: 0,
  },
  {
    id: '5',
    name: 'Model Performance Threshold',
    description: 'Models must meet minimum accuracy before promotion',
    type: 'model',
    enabled: true,
    violations: 1,
  },
];

const policyTypes = {
  deployment: 'bg-violet-500/10 text-violet-400',
  data: 'bg-blue-500/10 text-blue-400',
  cost: 'bg-amber-500/10 text-amber-400',
  resource: 'bg-emerald-500/10 text-emerald-400',
  model: 'bg-orange-500/10 text-orange-400',
};

export function Policies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Policies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage governance and compliance rules</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>Create Policy</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Policies', value: '12', icon: <Shield size={16} />, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Active', value: '9', icon: <CheckCircle size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Violations', value: '3', icon: <AlertTriangle size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Disabled', value: '3', icon: <XCircle size={16} />, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
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
                placeholder="Search policies..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Deployment', 'Data', 'Cost', 'Model'].map((filter) => (
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
        {policies.map((policy) => (
          <Card key={policy.id} hover className={cn(!policy.enabled && 'opacity-60')}>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  policy.enabled ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <Shield size={18} className={policy.enabled ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{policy.name}</h3>
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded uppercase',
                      policyTypes[policy.type as keyof typeof policyTypes]
                    )}>
                      {policy.type}
                    </span>
                    {policy.violations > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded flex items-center gap-1">
                        <AlertTriangle size={10} />
                        {policy.violations} violations
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className={cn(
                    'p-1 rounded',
                    policy.enabled ? 'text-emerald-400' : 'text-muted-foreground'
                  )}>
                    {policy.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
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
