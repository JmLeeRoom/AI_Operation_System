import { 
  Activity,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Image,
  FileText,
  Shield,
  Bell,
  RefreshCw,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function Monitoring() {
  const [timeRange, setTimeRange] = useState('24h');

  const latencyBreakdown = [
    { name: 'Preprocess', time: 120, percentage: 8, color: 'cyan' },
    { name: 'Encode', time: 450, percentage: 30, color: 'violet' },
    { name: 'Generation', time: 680, percentage: 45, color: 'emerald' },
    { name: 'Retrieval', time: 150, percentage: 10, color: 'amber' },
    { name: 'Tools', time: 100, percentage: 7, color: 'rose' },
  ];

  const costMetrics = {
    frames: { count: 2500000, cost: 1250 },
    tokens: { count: 8500000, cost: 850 },
    total: 2100,
    trend: '+12%',
  };

  const driftAlerts = [
    { type: 'Resolution Drift', message: 'Input resolution decreased by 15%', severity: 'warning', time: '2h ago' },
    { type: 'FPS Change', message: 'Video frame rate increased from 24 to 30 fps', severity: 'info', time: '5h ago' },
    { type: 'Audio Quality', message: 'Audio sample rate dropped below threshold', severity: 'warning', time: '1d ago' },
  ];

  const safetyAlerts = [
    { type: 'Content Filter', message: '3 requests blocked by safety filter', severity: 'high', time: '30m ago' },
    { type: 'Hallucination', message: 'Grounding score below 70% for 5 samples', severity: 'medium', time: '2h ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            Monitoring
          </h1>
          <p className="text-slate-400 mt-1">Latency, 비용, 안전성 모니터링</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field py-2 w-32"
          >
            <option value="1h">Last 1h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
          </select>
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="btn-ghost">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Avg Latency</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">1.5s</p>
          <p className="text-sm text-emerald-400">-8% vs yesterday</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Requests</span>
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">125K</p>
          <p className="text-sm text-emerald-400">+15% vs yesterday</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Cost (24h)</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">${costMetrics.total}</p>
          <p className="text-sm text-rose-400">{costMetrics.trend} vs yesterday</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Safety Alerts</span>
            <Shield className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{safetyAlerts.length}</p>
          <p className="text-sm text-amber-400">Requires attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Latency Breakdown
          </h2>
          <div className="space-y-4">
            {latencyBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span className="text-sm text-slate-400">{item.time}ms ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${item.color}-500 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">Total avg: 1500ms</p>
        </div>

        {/* Cost Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Cost Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-slate-400">Frames</span>
              </div>
              <p className="text-xl font-bold text-slate-100">{(costMetrics.frames.count / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-violet-400">${costMetrics.frames.cost}</p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400">Tokens</span>
              </div>
              <p className="text-xl font-bold text-slate-100">{(costMetrics.tokens.count / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-cyan-400">${costMetrics.tokens.cost}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <span className="text-slate-300 font-medium">Total Cost (24h)</span>
            <span className="text-amber-400 font-bold">${costMetrics.total}</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Drift Alerts */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-400" />
            Input Drift Alerts
          </h2>
          <div className="space-y-3">
            {driftAlerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border flex items-start gap-3 ${
                  alert.severity === 'warning' ? 'bg-amber-900/10 border-amber-500/30' : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 shrink-0 ${
                  alert.severity === 'warning' ? 'text-amber-400' : 'text-slate-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{alert.type}</p>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
            ))}
          </div>
          <button className="btn-ghost w-full mt-4 justify-center">
            Configure Drift Rules
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Alerts */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            Safety Alerts
          </h2>
          <div className="space-y-3">
            {safetyAlerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border flex items-start gap-3 ${
                  alert.severity === 'high' ? 'bg-rose-900/10 border-rose-500/30' : 'bg-amber-900/10 border-amber-500/30'
                }`}
              >
                <Bell className={`w-5 h-5 shrink-0 ${
                  alert.severity === 'high' ? 'text-rose-400' : 'text-amber-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{alert.type}</p>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full mt-4 justify-center">
            View All Safety Events
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all text-left">
            <TrendingUp className="w-6 h-6 text-violet-400 mb-2" />
            <p className="text-sm font-medium text-slate-200">Scale Up</p>
            <p className="text-xs text-slate-500">Increase instances</p>
          </button>
          <button className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-left">
            <RefreshCw className="w-6 h-6 text-cyan-400 mb-2" />
            <p className="text-sm font-medium text-slate-200">Trigger Retrain</p>
            <p className="text-xs text-slate-500">Based on drift</p>
          </button>
          <button className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-all text-left">
            <Bell className="w-6 h-6 text-amber-400 mb-2" />
            <p className="text-sm font-medium text-slate-200">Configure Alerts</p>
            <p className="text-xs text-slate-500">Set thresholds</p>
          </button>
          <button className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left">
            <Shield className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-sm font-medium text-slate-200">Safety Review</p>
            <p className="text-xs text-slate-500">Review flagged items</p>
          </button>
        </div>
      </div>
    </div>
  );
}
