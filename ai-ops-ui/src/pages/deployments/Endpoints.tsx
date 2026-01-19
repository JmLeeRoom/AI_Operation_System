import { 
  Plus, 
  Search, 
  Rocket,
  Activity,
  Clock,
  Zap,
  Server,
  Play,
  Pause,
  RotateCcw,
  Globe,
  AlertTriangle
} from 'lucide-react';

const deployments = [
  {
    id: '1',
    name: 'cv-classifier-prod',
    modelName: 'cv-object-detector',
    modelVersion: 'v2.3.1',
    endpoint: 'https://api.ml.company.com/cv-classifier',
    status: 'running',
    replicas: 3,
    latency: 45,
    throughput: 1250,
    uptime: '99.9%',
  },
  {
    id: '2',
    name: 'llm-inference-prod',
    modelName: 'llm-customer-support',
    modelVersion: 'v1.1.0',
    endpoint: 'https://api.ml.company.com/llm-support',
    status: 'running',
    replicas: 5,
    latency: 250,
    throughput: 450,
    uptime: '99.7%',
  },
  {
    id: '3',
    name: 'llm-inference-staging',
    modelName: 'llm-customer-support',
    modelVersion: 'v1.2.0',
    endpoint: 'https://staging.ml.company.com/llm-support',
    status: 'deploying',
    replicas: 2,
    latency: 0,
    throughput: 0,
    uptime: '-',
  },
  {
    id: '4',
    name: 'anomaly-detector-canary',
    modelName: 'anomaly-detector',
    modelVersion: 'v1.8.2',
    endpoint: 'https://canary.ml.company.com/anomaly',
    status: 'failed',
    replicas: 0,
    latency: 0,
    throughput: 0,
    uptime: '0%',
  },
];

const stats = [
  { label: 'Active', value: '8', color: 'text-emerald-400' },
  { label: 'Requests/min', value: '2,020', color: 'text-blue-400' },
  { label: 'Avg Latency', value: '85ms', color: 'text-amber-400' },
  { label: 'Uptime', value: '99.8%', color: 'text-violet-400' },
];

const getStatusConfig = (status: string) => {
  const config: Record<string, { badge: string; icon: React.ReactNode }> = {
    running: { badge: 'badge-emerald', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    stopped: { badge: 'badge-slate', icon: <Pause className="w-4 h-4 text-slate-400" /> },
    deploying: { badge: 'badge-blue', icon: <Clock className="w-4 h-4 text-blue-400 animate-spin" /> },
    failed: { badge: 'badge-rose', icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
  };
  return config[status] || config.stopped;
};

export function Endpoints() {
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deployments</h1>
          <p className="text-slate-400 mt-1">Manage model endpoints</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Deployment
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search deployments..."
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* 배포 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {deployments.map((deployment) => {
          const statusConfig = getStatusConfig(deployment.status);
          return (
            <div key={deployment.id} className="glass-card hover:border-brand-500/30 transition-all group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      deployment.status === 'running' ? 'bg-emerald-500/20' :
                      deployment.status === 'deploying' ? 'bg-blue-500/20' :
                      deployment.status === 'failed' ? 'bg-rose-500/20' : 'bg-slate-800'
                    }`}>
                      <Globe className={`w-5 h-5 ${
                        deployment.status === 'running' ? 'text-emerald-400' :
                        deployment.status === 'deploying' ? 'text-blue-400' :
                        deployment.status === 'failed' ? 'text-rose-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                        {deployment.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {deployment.modelName} <span className="font-mono text-brand-400/80">{deployment.modelVersion}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${statusConfig.badge} flex items-center gap-1`}>
                    {statusConfig.icon}
                    {deployment.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/50 mb-4">
                  <p className="text-xs font-mono text-slate-400 truncate">{deployment.endpoint}</p>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-2.5 rounded-lg bg-slate-800/30">
                    <p className="text-lg font-semibold text-white">{deployment.replicas}</p>
                    <p className="text-xs text-slate-500">Replicas</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-slate-800/30">
                    <p className="text-lg font-semibold text-white">{deployment.latency}ms</p>
                    <p className="text-xs text-slate-500">Latency</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-slate-800/30">
                    <p className="text-lg font-semibold text-white">{deployment.throughput}</p>
                    <p className="text-xs text-slate-500">RPS</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-slate-800/30">
                    <p className={`text-lg font-semibold ${deployment.uptime === '0%' ? 'text-rose-400' : 'text-white'}`}>
                      {deployment.uptime}
                    </p>
                    <p className="text-xs text-slate-500">Uptime</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                  {deployment.status === 'running' && (
                    <>
                      <button className="btn-secondary flex-1">
                        <Pause className="w-4 h-4" />
                        Stop
                      </button>
                      <button className="btn-ghost">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {deployment.status === 'failed' && (
                    <button className="btn-danger flex-1">
                      <RotateCcw className="w-4 h-4" />
                      Retry
                    </button>
                  )}
                  {deployment.status === 'stopped' && (
                    <button className="btn-primary flex-1">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}
                  <button className="btn-ghost ml-auto">
                    <Activity className="w-4 h-4" />
                    Metrics
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
