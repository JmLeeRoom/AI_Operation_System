import { 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  RefreshCw,
  Download,
  Bell,
  BarChart2,
  Database
} from 'lucide-react';
import { useState } from 'react';

export function Monitoring() {
  const [timeRange, setTimeRange] = useState('24h');

  const driftMetrics = [
    { feature: 'close', psi: 0.08, ks: 0.05, status: 'ok', trend: 'stable' },
    { feature: 'volume', psi: 0.28, ks: 0.18, status: 'critical', trend: 'increasing' },
    { feature: 'volatility', psi: 0.15, ks: 0.10, status: 'warning', trend: 'increasing' },
    { feature: 'market_cap', psi: 0.06, ks: 0.04, status: 'ok', trend: 'stable' },
  ];

  const performanceMetrics = {
    mape: { current: 4.5, baseline: 4.2, change: '+7.1%', status: 'warning' },
    mae: { current: 13.8, baseline: 12.5, change: '+10.4%', status: 'warning' },
    alertRate: { current: 28, baseline: 23, change: '+21.7%', status: 'critical' },
    precision: { current: 90.2, baseline: 92.5, change: '-2.5%', status: 'warning' },
  };

  const recentAlerts = [
    { time: '14:32', type: 'Drift', message: 'volume PSI > 0.25', severity: 'critical' },
    { time: '13:45', type: 'Performance', message: 'MAPE increased 7% vs baseline', severity: 'warning' },
    { time: '12:20', type: 'Alert Rate', message: 'Anomaly alerts/day > threshold', severity: 'warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Monitoring Dashboard
          </h1>
          <p className="text-slate-400 mt-1">데이터 드리프트, 성능 모니터링, 알람율 추적</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 상태 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Current MAPE</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{performanceMetrics.mape.current}%</p>
          <p className="text-xs text-rose-400 mt-1">{performanceMetrics.mape.change} vs baseline</p>
        </div>
        <div className="stat-card border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Precision</span>
            <TrendingDown className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{performanceMetrics.precision.current}%</p>
          <p className="text-xs text-rose-400 mt-1">{performanceMetrics.precision.change} vs baseline</p>
        </div>
        <div className="stat-card border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Alert Rate</span>
            <Bell className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">{performanceMetrics.alertRate.current}/day</p>
          <p className="text-xs text-rose-400 mt-1">{performanceMetrics.alertRate.change} vs baseline</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Drift Features</span>
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {driftMetrics.filter(d => d.status !== 'ok').length} / {driftMetrics.length}
          </p>
          <p className="text-xs text-amber-400 mt-1">Features with drift</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 데이터 드리프트 모니터링 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Data Drift Monitoring
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>PSI</th>
                <th>KS</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {driftMetrics.map((d) => (
                <tr key={d.feature}>
                  <td className="font-mono text-slate-200">{d.feature}</td>
                  <td className={`font-mono ${
                    d.status === 'critical' ? 'text-rose-400' :
                    d.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {d.psi}
                  </td>
                  <td className="font-mono text-slate-300">{d.ks}</td>
                  <td>
                    {d.trend === 'increasing' ? (
                      <TrendingUp className="w-4 h-4 text-rose-400" />
                    ) : (
                      <span className="text-slate-500">−</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${
                      d.status === 'critical' ? 'badge-rose' :
                      d.status === 'warning' ? 'badge-amber' : 'badge-emerald'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-3">
            PSI &gt; 0.25: Critical, 0.1-0.25: Warning, &lt; 0.1: OK
          </p>
        </div>

        {/* 최근 알림 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            Recent Monitoring Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                    }`} />
                    <span className={`font-medium ${
                      alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{alert.type}</span>
                  </div>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <p className="text-sm text-slate-300">{alert.message}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-xs text-cyan-400">
              🔔 드리프트 룰 트리거: PSI &gt; 0.25 시 자동 재학습 요청
            </p>
          </div>
        </div>
      </div>

      {/* 성능 트렌드 차트 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance Trend</h3>
        <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500">MAPE/Precision over time with baseline</p>
          </div>
        </div>
      </div>

      {/* 알람 폭주 방지 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Alert Flood Prevention Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-slate-300 font-medium">Cooldown Active</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">5 min</p>
            <p className="text-xs text-slate-500 mt-1">동일 엔티티 재알람 방지</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-slate-300 font-medium">Deduplicated</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">12 alerts</p>
            <p className="text-xs text-slate-500 mt-1">지난 1시간 중복 제거</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-slate-300 font-medium">Aggregated</p>
            <p className="text-2xl font-bold text-violet-400 mt-1">3 groups</p>
            <p className="text-xs text-slate-500 mt-1">유사 알람 그룹화</p>
          </div>
        </div>
      </div>
    </div>
  );
}
