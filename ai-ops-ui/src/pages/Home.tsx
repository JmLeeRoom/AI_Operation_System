import { 
  Activity,
  Play, 
  Box,
  Rocket,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  Zap,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { 
    title: 'Active Runs', 
    value: '12', 
    change: '+3 today',
    changeType: 'positive',
    icon: <Play className="w-6 h-6" />,
    iconBg: 'bg-blue-500/20 text-blue-400'
  },
  { 
    title: 'Deployed Models', 
    value: '8', 
    change: '99.8% uptime',
    changeType: 'positive',
    icon: <Rocket className="w-6 h-6" />,
    iconBg: 'bg-emerald-500/20 text-emerald-400'
  },
  { 
    title: 'Active Alerts', 
    value: '3', 
    change: '2 warnings',
    changeType: 'warning',
    icon: <AlertTriangle className="w-6 h-6" />,
    iconBg: 'bg-amber-500/20 text-amber-400'
  },
  { 
    title: 'Total Models', 
    value: '24', 
    change: '+5 this week',
    changeType: 'positive',
    icon: <Box className="w-6 h-6" />,
    iconBg: 'bg-violet-500/20 text-violet-400'
  },
];

const recentRuns = [
  { id: 'run-001', name: 'CV Object Detection Training', status: 'running', progress: 65, time: '2h ago' },
  { id: 'run-002', name: 'LLM Fine-tuning Pipeline', status: 'succeeded', time: '4h ago' },
  { id: 'run-003', name: 'Data Validation', status: 'failed', time: '5h ago' },
  { id: 'run-004', name: 'Model Evaluation', status: 'queued', time: '6h ago' },
];

const quickActions = [
  { label: 'New Pipeline', icon: <Play className="w-5 h-5" />, path: '/pipelines/builder' },
  { label: 'Deploy Model', icon: <Rocket className="w-5 h-5" />, path: '/deployments/endpoints' },
  { label: 'View Metrics', icon: <Activity className="w-5 h-5" />, path: '/monitoring/dashboard' },
];

export function Home() {
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

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 환영 배너 */}
      <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-r from-brand-600/20 via-violet-600/20 to-purple-600/20 border-brand-500/30">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, JaeMyeong! 👋
          </h2>
          <p className="mt-2 text-slate-400 max-w-xl">
            You have 12 active runs and 3 alerts that need attention. 
            The ML platform is running smoothly.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button 
              className="btn-primary"
              onClick={() => navigate('/pipelines/builder')}
            >
              <Zap className="w-4 h-4" />
              New Pipeline
            </button>
            <button 
              className="btn-ghost"
              onClick={() => navigate('/monitoring/dashboard')}
            >
              View Dashboard
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial from-brand-500/20 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="stat-card animate-[slideUp_0.3s_ease-out]"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-emerald-400' :
                stat.changeType === 'warning' ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 메인 그리드 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 최근 실행 */}
        <div className="col-span-2 glass-card">
          <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Recent Runs</h3>
                <p className="text-sm text-slate-500">Pipeline executions</p>
              </div>
            </div>
            <button 
              className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
              onClick={() => navigate('/runs')}
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="divide-y divide-slate-700/50">
            {recentRuns.map((run, idx) => (
              <div 
                key={run.id}
                className="p-4 hover:bg-slate-800/30 cursor-pointer transition-colors"
                onClick={() => navigate('/runs/detail')}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400">
                    {getStatusIcon(run.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{run.name}</span>
                      <span className={`badge ${getStatusBadge(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 font-mono">{run.id}</span>
                      <span className="text-xs text-slate-500">{run.time}</span>
                    </div>
                  </div>
                  {run.progress && (
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-blue-400 font-medium">{run.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${run.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사이드 패널 */}
        <div className="space-y-6">
          {/* 빠른 액션 */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group"
                  onClick={() => navigate(action.path)}
                >
                  <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-brand-400 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* 시스템 상태 */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">System Health</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'GPU Utilization', value: 78, color: 'bg-violet-500' },
                { label: 'Memory Usage', value: 65, color: 'bg-blue-500' },
                { label: 'Storage', value: 89, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-medium ${item.value >= 80 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 비용 */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Cost This Month</h3>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold gradient-text">$2,450</p>
            <p className="text-sm text-slate-500 mt-1">-12% vs last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
