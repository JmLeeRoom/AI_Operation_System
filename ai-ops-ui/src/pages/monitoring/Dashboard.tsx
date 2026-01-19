import { 
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Server,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const metrics = [
  { label: 'Active Runs', value: '12', change: '+3 today', trend: 'up', icon: <Activity className="w-6 h-6" />, iconBg: 'bg-blue-500/20 text-blue-400' },
  { label: 'Alerts', value: '3', change: '2 warnings', trend: 'warning', icon: <AlertTriangle className="w-6 h-6" />, iconBg: 'bg-amber-500/20 text-amber-400' },
  { label: 'Avg Latency', value: '85ms', change: '-12ms', trend: 'down', icon: <Clock className="w-6 h-6" />, iconBg: 'bg-emerald-500/20 text-emerald-400' },
  { label: 'GPU Usage', value: '78%', change: '+5%', trend: 'up', icon: <Server className="w-6 h-6" />, iconBg: 'bg-violet-500/20 text-violet-400' },
];

const deploymentMetrics = [
  { name: 'cv-classifier-prod', requests: '12.5K', latency: '45ms', errorRate: '0.02%', status: 'healthy' },
  { name: 'llm-inference-prod', requests: '4.5K', latency: '250ms', errorRate: '0.1%', status: 'healthy' },
  { name: 'audio-transcriber-prod', requests: '8.9K', latency: '120ms', errorRate: '2.5%', status: 'warning' },
];

const recentAlerts = [
  { id: '1', message: 'High error rate on audio-transcriber-prod', severity: 'warning', time: '5 min ago' },
  { id: '2', message: 'GPU memory > 90% on training cluster', severity: 'warning', time: '12 min ago' },
  { id: '3', message: 'Run cv-training-45 failed', severity: 'error', time: '25 min ago' },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitoring</h1>
          <p className="text-slate-400 mt-1">Real-time system overview</p>
        </div>
        <button className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* 메트릭 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="stat-card">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg ${metric.iconBg}`}>
                {metric.icon}
              </div>
              <span className={`text-xs font-medium ${
                metric.trend === 'up' ? 'text-emerald-400' :
                metric.trend === 'down' ? 'text-emerald-400' :
                metric.trend === 'warning' ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 요청 차트 */}
        <div className="col-span-2 glass-card">
          <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-500/20">
                <BarChart3 className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Request Volume</h3>
                <p className="text-sm text-slate-500">API requests over time</p>
              </div>
            </div>
            <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
              {['1h', '6h', '24h', '7d'].map((range) => (
                <button 
                  key={range} 
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    range === '24h' 
                      ? 'bg-brand-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="h-48 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Request Volume Chart</p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 알림 */}
        <div className="glass-card">
          <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white">Recent Alerts</h3>
            </div>
            <button 
              className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
              onClick={() => navigate('/monitoring/alerts')}
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-700/50">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-slate-800/30 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    alert.severity === 'error' ? 'bg-rose-400' : 'bg-amber-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 배포 상태 */}
      <div className="glass-card">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Deployment Health</h3>
              <p className="text-sm text-slate-500">Active endpoint metrics</p>
            </div>
          </div>
          <button 
            className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
            onClick={() => navigate('/deployments/endpoints')}
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Requests/hr</th>
              <th>Avg Latency</th>
              <th>Error Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deploymentMetrics.map((deployment) => (
              <tr key={deployment.name}>
                <td>
                  <span className="font-medium text-slate-200">{deployment.name}</span>
                </td>
                <td>{deployment.requests}</td>
                <td>{deployment.latency}</td>
                <td>
                  <span className={parseFloat(deployment.errorRate) > 1 ? 'text-amber-400' : ''}>
                    {deployment.errorRate}
                  </span>
                </td>
                <td>
                  <span className={`badge ${deployment.status === 'healthy' ? 'badge-emerald' : 'badge-amber'}`}>
                    {deployment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
