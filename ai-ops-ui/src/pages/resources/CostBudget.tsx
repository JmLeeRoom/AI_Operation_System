import { 
  Search, 
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  BarChart2,
  Download
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const costByResource = [
  { name: 'GPU Compute', current: 1250, budget: 2000, color: 'bg-violet-500' },
  { name: 'CPU Compute', current: 450, budget: 800, color: 'bg-blue-500' },
  { name: 'Storage', current: 180, budget: 300, color: 'bg-emerald-500' },
  { name: 'Network', current: 95, budget: 200, color: 'bg-orange-500' },
];

const costByTeam = [
  { name: 'CV Team', cost: 890, runs: 45, change: -12 },
  { name: 'NLP Team', cost: 720, runs: 28, change: +8 },
  { name: 'Audio Team', cost: 340, runs: 12, change: -5 },
  { name: 'DataOps', cost: 180, runs: 89, change: +2 },
];

const recentCosts = [
  { id: 'run-001', name: 'CV Training Pipeline', cost: 45.80, resources: '2x A100', duration: '2h 15m' },
  { id: 'run-002', name: 'LLM Fine-tuning', cost: 128.50, resources: '4x A100', duration: '6h 30m' },
  { id: 'run-003', name: 'Data Processing', cost: 8.20, resources: 'CPU-Large', duration: '45m' },
];

export function CostBudget() {
  const totalCurrent = costByResource.reduce((sum, r) => sum + r.current, 0);
  const totalBudget = costByResource.reduce((sum, r) => sum + r.budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Cost & Budget</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor resource usage and spending</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Calendar size={14} />}>This Month</Button>
          <Button variant="outline" leftIcon={<Download size={14} />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'This Month', value: `$${totalCurrent.toLocaleString()}`, icon: <DollarSign size={16} />, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Budget', value: `$${totalBudget.toLocaleString()}`, icon: <BarChart2 size={16} />, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Remaining', value: `$${(totalBudget - totalCurrent).toLocaleString()}`, icon: <TrendingDown size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'vs Last Month', value: '-12%', icon: <TrendingDown size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
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

      <div className="grid grid-cols-2 gap-6">
        {/* Cost by Resource */}
        <Card>
          <CardHeader title="Cost by Resource" />
          <CardContent>
            <div className="space-y-4">
              {costByResource.map((resource) => {
                const percentage = (resource.current / resource.budget) * 100;
                return (
                  <div key={resource.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{resource.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${resource.current} / ${resource.budget}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full rounded-full', resource.color, percentage > 90 && 'animate-pulse')}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    {percentage > 80 && (
                      <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        {percentage.toFixed(0)}% of budget used
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cost by Team */}
        <Card>
          <CardHeader title="Cost by Team" />
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Team</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Cost</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Runs</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {costByTeam.map((team) => (
                  <tr key={team.name} className="hover:bg-muted/20">
                    <td className="px-4 py-2 text-sm font-medium text-foreground">{team.name}</td>
                    <td className="px-4 py-2 text-sm text-foreground">${team.cost}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">{team.runs}</td>
                    <td className="px-4 py-2">
                      <span className={cn(
                        'text-sm flex items-center gap-1',
                        team.change < 0 ? 'text-emerald-400' : 'text-red-400'
                      )}>
                        {team.change < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                        {Math.abs(team.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Costs */}
      <Card>
        <CardHeader title="Recent Run Costs" action={
          <Button size="sm" variant="ghost">View All</Button>
        } />
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Run</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Resources</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentCosts.map((run) => (
                <tr key={run.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{run.name}</p>
                    <p className="text-xs text-muted-foreground">{run.id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{run.resources}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{run.duration}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">${run.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
