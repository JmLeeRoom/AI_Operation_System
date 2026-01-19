import { 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const driftMetrics = [
  {
    id: '1',
    endpoint: 'cv-classifier-prod',
    model: 'cv-object-detector v2.3.1',
    featureDrift: 0.08,
    predictionDrift: 0.05,
    threshold: 0.1,
    status: 'healthy',
    lastChecked: '5 min ago',
  },
  {
    id: '2',
    endpoint: 'llm-inference-prod',
    model: 'llm-customer-support v1.1.0',
    featureDrift: 0.12,
    predictionDrift: 0.09,
    threshold: 0.1,
    status: 'warning',
    lastChecked: '10 min ago',
  },
  {
    id: '3',
    endpoint: 'audio-transcriber-prod',
    model: 'audio-transcriber v3.0.0',
    featureDrift: 0.03,
    predictionDrift: 0.02,
    threshold: 0.1,
    status: 'healthy',
    lastChecked: '2 min ago',
  },
];

export function Drift() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Model Drift</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor data and prediction drift</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCw size={14} />}>Refresh</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Monitored', value: '8', icon: <Activity size={16} />, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Healthy', value: '6', icon: <TrendingUp size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Warning', value: '2', icon: <AlertTriangle size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Critical', value: '0', icon: <TrendingDown size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
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
                placeholder="Search endpoints..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Status</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {driftMetrics.map((metric) => (
          <Card key={metric.id} hover>
            <CardContent>
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  'p-2 rounded-lg',
                  metric.status === 'healthy' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                )}>
                  {metric.status === 'healthy' 
                    ? <Activity size={16} className="text-emerald-400" />
                    : <AlertTriangle size={16} className="text-amber-400" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{metric.endpoint}</h3>
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded',
                      metric.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    )}>
                      {metric.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.model}</p>
                </div>
                <p className="text-xs text-muted-foreground">Last checked {metric.lastChecked}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Feature Drift</p>
                  <div className="flex items-end justify-between mb-2">
                    <p className={cn(
                      'text-2xl font-semibold',
                      metric.featureDrift > metric.threshold ? 'text-amber-400' : 'text-foreground'
                    )}>
                      {metric.featureDrift.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">threshold: {metric.threshold}</p>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full', metric.featureDrift > metric.threshold ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ width: `${Math.min(metric.featureDrift / metric.threshold * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-md bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Prediction Drift</p>
                  <div className="flex items-end justify-between mb-2">
                    <p className={cn(
                      'text-2xl font-semibold',
                      metric.predictionDrift > metric.threshold ? 'text-amber-400' : 'text-foreground'
                    )}>
                      {metric.predictionDrift.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">threshold: {metric.threshold}</p>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full', metric.predictionDrift > metric.threshold ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ width: `${Math.min(metric.predictionDrift / metric.threshold * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <Button size="sm" variant="secondary" leftIcon={<BarChart2 size={12} />}>View Details</Button>
                <Button size="sm" variant="ghost">Configure Alerts</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
