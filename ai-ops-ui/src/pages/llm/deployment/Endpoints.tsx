import { 
  Server,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  ArrowRight,
  Zap,
  Clock,
  DollarSign,
  Activity,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

export function LLMEndpoints() {
  const endpoints = [
    {
      id: 1,
      name: 'prod-chat-v2',
      model: 'Llama-3-8B-Chat-v2.3',
      status: 'healthy',
      qps: 45.2,
      latencyP50: '180ms',
      latencyP99: '520ms',
      errorRate: 0.02,
      gpus: 4,
      region: 'us-east-1',
      cacheHit: 34,
    },
    {
      id: 2,
      name: 'staging-chat',
      model: 'Llama-3-8B-Chat-v2.4',
      status: 'healthy',
      qps: 8.5,
      latencyP50: '195ms',
      latencyP99: '480ms',
      errorRate: 0.01,
      gpus: 2,
      region: 'us-east-1',
      cacheHit: 28,
    },
    {
      id: 3,
      name: 'dev-code-assist',
      model: 'Qwen-7B-Code-v1.0',
      status: 'degraded',
      qps: 2.1,
      latencyP50: '450ms',
      latencyP99: '1.2s',
      errorRate: 5.2,
      gpus: 1,
      region: 'us-west-2',
      cacheHit: 12,
    },
  ];

  const routingConfig = {
    strategy: 'Canary',
    primary: 'prod-chat-v2 (90%)',
    canary: 'staging-chat (10%)',
    fallback: 'Enabled',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'down': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'badge-emerald';
      case 'degraded': return 'badge-amber';
      case 'down': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            LLM Endpoints
          </h1>
          <p className="text-slate-400 mt-1">모델 서빙 엔드포인트 관리 및 모니터링</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Deploy New
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-sm text-slate-400">Active Endpoints</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">55.8</p>
          <p className="text-sm text-slate-400">Total QPS</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">192ms</p>
          <p className="text-sm text-slate-400">Avg Latency (P50)</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">99.8%</p>
          <p className="text-sm text-slate-400">Availability</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">7</p>
          <p className="text-sm text-slate-400">GPUs Used</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="col-span-2 space-y-4">
          {endpoints.map((endpoint, index) => (
            <div 
              key={endpoint.id}
              className="glass-card p-6 hover:border-brand-500/30 transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    endpoint.status === 'healthy' ? 'bg-emerald-500/20' : 
                    endpoint.status === 'degraded' ? 'bg-amber-500/20' : 'bg-rose-500/20'
                  }`}>
                    <Server className={`w-6 h-6 ${
                      endpoint.status === 'healthy' ? 'text-emerald-400' : 
                      endpoint.status === 'degraded' ? 'text-amber-400' : 'text-rose-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{endpoint.name}</h3>
                      <span className={`badge ${getStatusBadge(endpoint.status)} capitalize`}>
                        {getStatusIcon(endpoint.status)}
                        {endpoint.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{endpoint.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost text-sm py-1.5">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost text-sm py-1.5">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                  <p className="text-lg font-bold text-white">{endpoint.qps}</p>
                  <p className="text-xs text-slate-500">QPS</p>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                  <p className="text-lg font-bold text-white">{endpoint.latencyP50}</p>
                  <p className="text-xs text-slate-500">P50 Latency</p>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                  <p className="text-lg font-bold text-white">{endpoint.latencyP99}</p>
                  <p className="text-xs text-slate-500">P99 Latency</p>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                  <p className={`text-lg font-bold ${endpoint.errorRate < 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {endpoint.errorRate}%
                  </p>
                  <p className="text-xs text-slate-500">Error Rate</p>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg text-center">
                  <p className="text-lg font-bold text-cyan-400">{endpoint.cacheHit}%</p>
                  <p className="text-xs text-slate-500">Cache Hit</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-slate-500">
                  <span>{endpoint.gpus} GPU(s)</span>
                  <span>•</span>
                  <span>{endpoint.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  {endpoint.status === 'healthy' ? (
                    <button className="btn-ghost text-sm py-1.5 text-amber-400">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  ) : (
                    <button className="btn-ghost text-sm py-1.5 text-emerald-400">
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  )}
                  <button className="btn-secondary text-sm py-1.5">
                    Scale
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Routing & Config */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Traffic Routing
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Strategy</span>
                <span className="badge badge-cyan">{routingConfig.strategy}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Primary</span>
                <span className="text-slate-200">{routingConfig.primary}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Canary</span>
                <span className="text-slate-200">{routingConfig.canary}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Fallback</span>
                <span className="text-emerald-400">{routingConfig.fallback}</span>
              </div>
            </div>

            <button className="btn-secondary w-full mt-4">
              <Settings className="w-4 h-4" />
              Configure Routing
            </button>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Quick Actions
            </h2>

            <div className="space-y-2">
              <button className="btn-ghost w-full justify-start">
                <RefreshCw className="w-4 h-4" />
                Rollback to Previous
              </button>
              <button className="btn-ghost w-full justify-start">
                <Play className="w-4 h-4" />
                Promote Canary
              </button>
              <button className="btn-ghost w-full justify-start text-rose-400">
                <Pause className="w-4 h-4" />
                Emergency Stop All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
