import { 
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  BarChart2,
  FileText,
  Download,
  RefreshCw,
  ArrowLeft,
  GitBranch,
  Cpu,
  Database,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function RunDetail() {
  const [activeTab, setActiveTab] = useState('metrics');

  const run = {
    id: 'run-2024-0119-001',
    name: 'XGBoost Stock Forecaster v2.4',
    status: 'completed',
    startTime: '2024-01-19 10:30:00',
    endTime: '2024-01-19 14:45:00',
    duration: '4h 15m',
    dataset: 'Stock Prices (KOSPI) v2.3',
    featureSet: 'Stock Features v2.3',
    model: 'XGBoost',
    metrics: {
      mape: 4.2,
      mae: 12.5,
      rmse: 18.3,
      r2: 0.89,
    },
    backtestFolds: 5,
    artifacts: ['model.pkl', 'scaler.pkl', 'feature_importance.json', 'backtest_report.html'],
  };

  const metricsHistory = [
    { fold: 1, mape: 4.5, mae: 13.2, rmse: 19.1 },
    { fold: 2, mape: 4.1, mae: 12.1, rmse: 17.8 },
    { fold: 3, mape: 4.3, mae: 12.8, rmse: 18.5 },
    { fold: 4, mape: 4.0, mae: 11.9, rmse: 17.2 },
    { fold: 5, mape: 4.1, mae: 12.5, rmse: 18.9 },
  ];

  const featureImportance = [
    { feature: 'close_lag_1', importance: 0.25 },
    { feature: 'close_ma_5', importance: 0.18 },
    { feature: 'volume_zscore', importance: 0.12 },
    { feature: 'close_ma_20', importance: 0.10 },
    { feature: 'volatility', importance: 0.08 },
    { feature: 'dayofweek', importance: 0.06 },
    { feature: 'momentum', importance: 0.05 },
    { feature: 'others', importance: 0.16 },
  ];

  const logs = [
    { time: '10:30:00', level: 'INFO', message: 'Starting training run...' },
    { time: '10:30:05', level: 'INFO', message: 'Loading dataset: Stock Prices (KOSPI) v2.3' },
    { time: '10:31:20', level: 'INFO', message: 'Loaded 2,534,128 rows' },
    { time: '10:32:00', level: 'INFO', message: 'Applying feature pipeline: Stock Features v2.3' },
    { time: '10:35:00', level: 'INFO', message: 'Generated 32 features' },
    { time: '10:36:00', level: 'INFO', message: 'Starting fold 1/5 training...' },
    { time: '11:15:00', level: 'INFO', message: 'Fold 1 completed - MAPE: 4.5%' },
    { time: '14:45:00', level: 'INFO', message: 'Training completed successfully' },
  ];

  const tabs = [
    { id: 'metrics', label: 'Metrics', icon: BarChart2 },
    { id: 'charts', label: 'Charts', icon: Activity },
    { id: 'features', label: 'Feature Importance', icon: TrendingUp },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'artifacts', label: 'Artifacts', icon: GitBranch },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/timeseries/runs" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100">{run.name}</h1>
              <span className="badge badge-emerald">
                <CheckCircle className="w-3 h-3 mr-1" />
                {run.status}
              </span>
            </div>
            <p className="text-slate-400 mt-1 font-mono text-sm">{run.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Rerun
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Duration</p>
          <p className="text-xl font-bold text-slate-100">{run.duration}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">MAPE</p>
          <p className="text-xl font-bold text-emerald-400">{run.metrics.mape}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">MAE</p>
          <p className="text-xl font-bold text-slate-100">{run.metrics.mae}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">RMSE</p>
          <p className="text-xl font-bold text-slate-100">{run.metrics.rmse}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">R²</p>
          <p className="text-xl font-bold text-emerald-400">{run.metrics.r2}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Backtest Folds</p>
          <p className="text-xl font-bold text-slate-100">{run.backtestFolds}</p>
        </div>
      </div>

      {/* Lineage */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-6 overflow-x-auto">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Dataset:</span>
            <span className="badge badge-cyan text-xs">{run.dataset}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-slate-400">Features:</span>
            <span className="badge badge-violet text-xs">{run.featureSet}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Model:</span>
            <span className="badge badge-amber text-xs">{run.model}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Started:</span>
            <span className="text-xs text-slate-300">{run.startTime}</span>
          </div>
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
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Metrics 탭 */}
      {activeTab === 'metrics' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Fold-wise Metrics</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fold</th>
                <th>MAPE</th>
                <th>MAE</th>
                <th>RMSE</th>
              </tr>
            </thead>
            <tbody>
              {metricsHistory.map((m) => (
                <tr key={m.fold}>
                  <td>Fold {m.fold}</td>
                  <td className="font-mono text-emerald-400">{m.mape}%</td>
                  <td className="font-mono text-slate-300">{m.mae}</td>
                  <td className="font-mono text-slate-300">{m.rmse}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-600 font-semibold">
                <td>Average</td>
                <td className="font-mono text-emerald-400">{run.metrics.mape}%</td>
                <td className="font-mono text-slate-300">{run.metrics.mae}</td>
                <td className="font-mono text-slate-300">{run.metrics.rmse}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Charts 탭 */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Actual vs Predicted</h3>
            <div className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">Overlay chart: Blue=Actual, Green=Predicted</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Residuals Over Time</h3>
            <div className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">Error distribution over time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Importance 탭 */}
      {activeTab === 'features' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Feature Importance</h3>
          <div className="space-y-3">
            {featureImportance.map((f) => (
              <div key={f.feature}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-slate-300">{f.feature}</span>
                  <span className="text-sm text-emerald-400">{(f.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${f.importance * 100 * 4}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs 탭 */}
      {activeTab === 'logs' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Training Logs</h3>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-4 py-1">
                <span className="text-slate-600">{log.time}</span>
                <span className={`w-12 ${log.level === 'ERROR' ? 'text-rose-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-cyan-400'}`}>
                  [{log.level}]
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artifacts 탭 */}
      {activeTab === 'artifacts' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Artifacts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {run.artifacts.map((artifact) => (
              <div key={artifact} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 transition-colors cursor-pointer">
                <FileText className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-200 truncate">{artifact}</p>
                <button className="text-xs text-emerald-400 mt-2 hover:underline">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
