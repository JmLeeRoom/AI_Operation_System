import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  BarChart3,
  RefreshCw,
  Calendar,
  Zap,
  Target,
  Bell,
  Database
} from 'lucide-react';
import { useState } from 'react';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const performanceMetrics = {
    forecasting: {
      mape: 4.2,
      mae: 12.5,
      rmse: 18.3,
      trend: 'improving',
    },
    anomaly: {
      precision: 92.5,
      recall: 87.3,
      f1: 89.8,
      trend: 'stable',
    }
  };

  const backtestResults = [
    { model: 'XGBoost-v2.1', sharpe: 1.85, returns: '+12.3%', drawdown: '-4.2%', status: 'production' },
    { model: 'LSTM-v1.5', sharpe: 1.62, returns: '+10.1%', drawdown: '-5.8%', status: 'staging' },
    { model: 'Prophet-v3.0', sharpe: 1.45, returns: '+8.5%', drawdown: '-6.1%', status: 'archived' },
  ];

  const qualityAlerts = [
    { type: 'Missing Data', message: 'sensor_temp 컬럼 결측률 증가 (2.1% → 5.8%)', severity: 'warning', time: '1h ago' },
    { type: 'Distribution Shift', message: 'price_volume PSI > 0.25 (기준: 0.1)', severity: 'critical', time: '30m ago' },
    { type: 'Outlier Spike', message: 'transaction_amount 이상치 12건 탐지', severity: 'info', time: '2h ago' },
  ];

  const retrainSchedule = [
    { model: 'XGBoost-v2.1', nextRun: '2024-01-19 06:00', trigger: 'scheduled', status: 'pending' },
    { model: 'AnomalyDetector-v1.2', nextRun: 'On drift', trigger: 'conditional', status: 'monitoring' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Time Series / Tabular Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Forecasting, Anomaly Detection, Tabular ML 현황</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Picker - 필수 컴포넌트 */}
          <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-emerald-500/20 text-emerald-400'
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

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Forecasting MAPE</span>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{performanceMetrics.forecasting.mape}%</p>
          <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3" />
            -0.3% vs last week
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Anomaly Precision</span>
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{performanceMetrics.anomaly.precision}%</p>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            Recall: {performanceMetrics.anomaly.recall}%
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Active Alerts</span>
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">23</p>
          <p className="text-sm text-amber-400 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            5 critical
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Inference Cost</span>
            <DollarSign className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">$1,280</p>
          <p className="text-sm text-rose-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +8% this month
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 백테스트 결과 (금융/수요예측) */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Latest Backtest Results
          </h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Sharpe Ratio</th>
                  <th>Returns</th>
                  <th>Max Drawdown</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {backtestResults.map((result, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-slate-200">{result.model}</td>
                    <td className="text-emerald-400 font-mono">{result.sharpe}</td>
                    <td className="text-emerald-400">{result.returns}</td>
                    <td className="text-rose-400">{result.drawdown}</td>
                    <td>
                      <span className={`badge ${
                        result.status === 'production' ? 'badge-emerald' :
                        result.status === 'staging' ? 'badge-amber' : 'badge-slate'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Actual vs Predicted Chart Placeholder */}
          <div className="mt-6 h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">Actual vs Predicted Overlay Chart</p>
            </div>
          </div>
        </div>

        {/* 데이터 품질 알림 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            Data Quality Alerts
          </h2>
          <div className="space-y-3">
            {qualityAlerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-rose-900/10 border-rose-500/30' :
                  alert.severity === 'warning' ? 'bg-amber-900/10 border-amber-500/30' :
                  'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    alert.severity === 'critical' ? 'text-rose-400' :
                    alert.severity === 'warning' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-400">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 재학습 스케줄 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            Retrain Schedule
          </h2>
          <div className="space-y-3">
            {retrainSchedule.map((schedule, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{schedule.model}</span>
                  <span className={`badge ${
                    schedule.status === 'pending' ? 'badge-amber' : 'badge-cyan'
                  }`}>
                    {schedule.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {schedule.nextRun}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {schedule.trigger}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 성능 요약 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            Performance Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs text-slate-400 mb-1">Forecasting</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">MAPE</span>
                  <span className="text-emerald-400 font-mono">{performanceMetrics.forecasting.mape}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">MAE</span>
                  <span className="text-emerald-400 font-mono">{performanceMetrics.forecasting.mae}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">RMSE</span>
                  <span className="text-emerald-400 font-mono">{performanceMetrics.forecasting.rmse}</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <p className="text-xs text-slate-400 mb-1">Anomaly Detection</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Precision</span>
                  <span className="text-violet-400 font-mono">{performanceMetrics.anomaly.precision}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Recall</span>
                  <span className="text-violet-400 font-mono">{performanceMetrics.anomaly.recall}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">F1</span>
                  <span className="text-violet-400 font-mono">{performanceMetrics.anomaly.f1}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
