import { 
  Search, 
  Filter,
  Clock,
  GitBranch,
  Play,
  RotateCcw,
  Ban,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const runs = [
  {
    id: 'run-001',
    pipelineName: 'CV Object Detection Training',
    trigger: 'manual',
    startedAt: '2024-01-15 10:30',
    duration: '15m 23s',
    status: 'succeeded',
    cost: 12.45,
    initiator: 'JaeMyeong',
  },
  {
    id: 'run-002',
    pipelineName: 'LLM Fine-tuning Pipeline',
    trigger: 'schedule',
    startedAt: '2024-01-15 09:00',
    duration: '2h 15m',
    status: 'running',
    cost: 45.80,
    initiator: 'Schedule',
  },
  {
    id: 'run-003',
    pipelineName: 'Data Validation Pipeline',
    trigger: 'webhook',
    startedAt: '2024-01-15 08:45',
    duration: '2m 15s',
    status: 'failed',
    cost: 0.35,
    initiator: 'Webhook',
  },
  {
    id: 'run-004',
    pipelineName: 'Model Evaluation',
    trigger: 'manual',
    startedAt: '2024-01-15 08:30',
    duration: '-',
    status: 'queued',
    cost: 0,
    initiator: 'TeamML',
  },
];

const stats = [
  { label: 'Running', value: '2', badge: 'badge-blue' },
  { label: 'Queued', value: '8', badge: 'badge-amber' },
  { label: 'Completed Today', value: '156', badge: 'badge-emerald' },
  { label: 'Cost Today', value: '$68.70', badge: 'badge-violet' },
];

export function RunList() {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'succeeded': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'queued': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      running: 'badge-blue',
      succeeded: 'badge-emerald',
      failed: 'badge-rose',
      queued: 'badge-amber',
    };
    return styles[status] || 'badge-slate';
  };

  const getTriggerBadge = (trigger: string) => {
    const styles: Record<string, string> = {
      manual: 'badge-blue',
      schedule: 'badge-violet',
      webhook: 'badge-amber',
    };
    return styles[trigger] || 'badge-slate';
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Runs</h1>
          <p className="text-slate-400 mt-1">Monitor pipeline executions</p>
        </div>
        <button className="btn-primary">
          <Play className="w-4 h-4" />
          Run Pipeline
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 검색 및 필터 */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search runs..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            Status
          </button>
          <button className="btn-secondary">
            <Clock className="w-4 h-4" />
            Time Range
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Pipeline</th>
              <th>Trigger</th>
              <th>Started</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr 
                key={run.id} 
                className="cursor-pointer"
                onClick={() => navigate('/runs/detail')}
              >
                <td>
                  <span className="font-mono text-brand-400">{run.id}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-200">{run.pipelineName}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getTriggerBadge(run.trigger)}`}>
                    {run.trigger}
                  </span>
                </td>
                <td>
                  <span className="text-slate-400">{run.startedAt}</span>
                </td>
                <td>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {run.duration}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(run.status)}
                    <span className={`badge ${getStatusBadge(run.status)}`}>
                      {run.status}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="font-medium">${run.cost.toFixed(2)}</span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {run.status === 'failed' && (
                      <button className="btn-ghost p-1.5">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {run.status === 'running' && (
                      <button className="btn-ghost p-1.5">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    <button className="btn-ghost p-1.5">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
