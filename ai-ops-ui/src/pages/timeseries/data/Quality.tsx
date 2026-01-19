import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  BarChart2,
  Activity,
  TrendingUp,
  Calendar,
  Hash,
  Percent,
  FileWarning
} from 'lucide-react';
import { useState } from 'react';

export function Quality() {
  const [activeTab, setActiveTab] = useState('missing');
  const [timeRange, setTimeRange] = useState('30d');

  const qualityMetrics = {
    overall: 96.5,
    missing: 0.8,
    duplicates: 0.02,
    outliers: 1.2,
    driftScore: 0.12,
  };

  const missingData = [
    { column: 'market_cap', missing: '2.1%', trend: 'increasing', severity: 'warning' },
    { column: 'pe_ratio', missing: '1.8%', trend: 'stable', severity: 'info' },
    { column: 'dividend_yield', missing: '5.2%', trend: 'stable', severity: 'warning' },
    { column: 'volume', missing: '0.01%', trend: 'stable', severity: 'ok' },
    { column: 'close', missing: '0%', trend: 'stable', severity: 'ok' },
    { column: 'open', missing: '0.01%', trend: 'stable', severity: 'ok' },
  ];

  const driftMetrics = [
    { feature: 'volume', psi: 0.28, ks: 0.15, severity: 'critical', change: '+45%' },
    { feature: 'close', psi: 0.08, ks: 0.05, severity: 'ok', change: '+3%' },
    { feature: 'market_cap', psi: 0.12, ks: 0.08, severity: 'warning', change: '+12%' },
    { feature: 'volatility', psi: 0.22, ks: 0.14, severity: 'warning', change: '+28%' },
    { feature: 'pe_ratio', psi: 0.05, ks: 0.03, severity: 'ok', change: '-2%' },
  ];

  const tabs = [
    { id: 'missing', label: 'Missing', icon: FileWarning },
    { id: 'duplicates', label: 'Duplicates', icon: Hash },
    { id: 'outliers', label: 'Outliers', icon: AlertTriangle },
    { id: 'drift', label: 'Distribution Drift', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Schema & Quality
          </h1>
          <p className="text-slate-400 mt-1">데이터 품질 모니터링 - 결측, 중복, 이상치, 분포 변화</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Run Quality Check
          </button>
        </div>
      </div>

      {/* 품질 점수 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Overall Score</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">{qualityMetrics.overall}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Missing</span>
            <FileWarning className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{qualityMetrics.missing}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Duplicates</span>
            <Hash className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{qualityMetrics.duplicates}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Outliers</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{qualityMetrics.outliers}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Drift (PSI)</span>
            <TrendingUp className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">{qualityMetrics.driftScore}</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Missing Heatmap */}
      {activeTab === 'missing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Missing Data by Column</h3>
            <div className="space-y-3">
              {missingData.map((item) => (
                <div 
                  key={item.column}
                  className={`p-3 rounded-lg border ${
                    item.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                    item.severity === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30' :
                    'bg-slate-800/50 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-200">{item.column}</span>
                      {item.trend === 'increasing' && (
                        <span className="badge badge-rose text-xs">↑ increasing</span>
                      )}
                    </div>
                    <span className={`font-mono ${
                      item.severity === 'warning' ? 'text-amber-400' :
                      item.severity === 'ok' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {item.missing}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Missing Heatmap (Column × Time)</h3>
            <div className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">Missing data heatmap visualization</p>
                <p className="text-xs text-slate-600 mt-1">Darker = More missing</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Drift */}
      {activeTab === 'drift' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Distribution Shift Analysis</h3>
            <p className="text-slate-400 text-sm mb-4">
              PSI (Population Stability Index): &gt;0.25 = 심각, 0.1-0.25 = 주의, &lt;0.1 = 안정
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>PSI</th>
                  <th>KS Statistic</th>
                  <th>Change</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {driftMetrics.map((metric) => (
                  <tr key={metric.feature}>
                    <td className="font-mono text-slate-200">{metric.feature}</td>
                    <td className={`font-mono ${
                      metric.severity === 'critical' ? 'text-rose-400' :
                      metric.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {metric.psi}
                    </td>
                    <td className="font-mono text-slate-300">{metric.ks}</td>
                    <td className={metric.change.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}>
                      {metric.change}
                    </td>
                    <td>
                      <span className={`badge ${
                        metric.severity === 'critical' ? 'badge-rose' :
                        metric.severity === 'warning' ? 'badge-amber' : 'badge-emerald'
                      }`}>
                        {metric.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Distribution Comparison (Reference vs Current)</h3>
            <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">Distribution comparison chart</p>
                <p className="text-xs text-slate-600 mt-1">Blue = Reference, Red = Current</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outliers */}
      {activeTab === 'outliers' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Outlier Detection</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Outlier Summary</h4>
              <div className="space-y-2">
                {[
                  { column: 'volume', count: 1234, pct: '0.8%', method: 'IQR' },
                  { column: 'price_change', count: 567, pct: '0.3%', method: 'Z-score' },
                  { column: 'market_cap', count: 89, pct: '0.05%', method: 'IQR' },
                ].map((item) => (
                  <div key={item.column} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-200">{item.column}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400 font-mono">{item.count}</span>
                        <span className="text-slate-500">({item.pct})</span>
                        <span className="badge badge-slate text-xs">{item.method}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">Outlier scatter plot</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicates */}
      {activeTab === 'duplicates' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Duplicate Detection</h3>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">No significant duplicates detected</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Duplicate rate: <span className="font-mono text-emerald-400">0.02%</span> (125 rows out of 2.5M)
            </p>
          </div>
          <div className="text-slate-400 text-sm">
            <p>Duplicate detection based on:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Exact timestamp + entity_id combination</li>
              <li>Consecutive identical values (suspicious)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
