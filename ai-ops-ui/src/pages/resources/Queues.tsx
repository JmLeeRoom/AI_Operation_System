import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  Play,
  Pause,
  Layers,
  ArrowUp,
  ArrowDown,
  Settings
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const queues = [
  {
    id: '1',
    name: 'default',
    pending: 12,
    running: 8,
    maxConcurrent: 10,
    priority: 1,
    status: 'active',
  },
  {
    id: '2',
    name: 'high-priority',
    pending: 3,
    running: 4,
    maxConcurrent: 5,
    priority: 0,
    status: 'active',
  },
  {
    id: '3',
    name: 'batch',
    pending: 45,
    running: 20,
    maxConcurrent: 25,
    priority: 2,
    status: 'active',
  },
  {
    id: '4',
    name: 'gpu-training',
    pending: 8,
    running: 2,
    maxConcurrent: 4,
    priority: 1,
    status: 'paused',
  },
];

const queuedJobs = [
  { id: 'job-1', name: 'cv-training-run-45', queue: 'gpu-training', position: 1, waitTime: '5 min', priority: 1 },
  { id: 'job-2', name: 'llm-finetune-run-12', queue: 'gpu-training', position: 2, waitTime: '12 min', priority: 1 },
  { id: 'job-3', name: 'data-validation-batch', queue: 'batch', position: 1, waitTime: '2 min', priority: 2 },
  { id: 'job-4', name: 'model-evaluation-23', queue: 'default', position: 1, waitTime: '1 min', priority: 1 },
];

export function Queues() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Job Queues</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage job scheduling queues</p>
        </div>
        <Button leftIcon={<Plus size={14} />}>Create Queue</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Queued', value: '68', icon: <Clock size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Running', value: '34', icon: <Play size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Queues Active', value: '3', icon: <Layers size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg Wait Time', value: '8m', icon: <Clock size={16} />, color: 'text-foreground', bg: 'bg-muted' },
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

      {/* Queues */}
      <Card>
        <CardHeader title="Queues" />
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Queue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Pending</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Running</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Max Concurrent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {queues.map((queue) => (
                <tr key={queue.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{queue.name}</td>
                  <td className="px-4 py-3 text-sm text-amber-400">{queue.pending}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{queue.running}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{queue.maxConcurrent}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded',
                      queue.priority === 0 ? 'bg-red-500/10 text-red-400' :
                      queue.priority === 1 ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-500/10 text-zinc-400'
                    )}>
                      {queue.priority === 0 ? 'High' : queue.priority === 1 ? 'Normal' : 'Low'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded',
                      queue.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                    )}>
                      {queue.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        {queue.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Settings size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Queued Jobs */}
      <Card>
        <CardHeader title="Queued Jobs" action={
          <Button size="sm" variant="ghost">View All</Button>
        } />
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {queuedJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground">#{job.position}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{job.name}</p>
                    <p className="text-xs text-muted-foreground">Queue: {job.queue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-muted-foreground">Wait: {job.waitTime}</p>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ArrowUp size={12} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ArrowDown size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
