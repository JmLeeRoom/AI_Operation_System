import { 
  FileText,
  Download,
  Calendar,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function BacktestReport() {
  const [activeSegment, setActiveSegment] = useState('all');

  const summary = {
    model: 'XGBoost-v2.4',
    plan: 'Stock 5-Fold WF',
    folds: 5,
    avgMape: 4.2,
    avgMae: 12.5,
    avgRmse: 18.3,
    improvement: '+8.5%',
    baselineMape: 4.6,
  };

  const foldResults = [
    { fold: 1, mape: 4.5, mae: 13.2, rmse: 19.1, period: '2021-07 ~ 2021-12', status: 'pass' },
    { fold: 2, mape: 4.1, mae: 12.1, rmse: 17.8, period: '2022-01 ~ 2022-06', status: 'pass' },
    { fold: 3, mape: 4.3, mae: 12.8, rmse: 18.5, period: '2022-07 ~ 2022-12', status: 'pass' },
    { fold: 4, mape: 4.0, mae: 11.9, rmse: 17.2, period: '2023-01 ~ 2023-06', status: 'pass' },
    { fold: 5, mape: 4.1, mae: 12.5, rmse: 18.9, period: '2023-07 ~ 2023-12', status: 'pass' },
  ];

  const segmentPerformance = [
    { segment: 'Weekday', mape: 3.8, samples: '78%', status: 'good' },
    { segment: 'Weekend/Holiday', mape: 5.2, samples: '12%', status: 'warning' },
    { segment: 'Market Open (9-10AM)', mape: 5.8, samples: '5%', status: 'warning' },
    { segment: 'Market Close (2-3PM)', mape: 4.1, samples: '5%', status: 'good' },
    { segment: 'High Volatility Days', mape: 6.5, samples: '8%', status: 'critical' },
    { segment: 'Low Volatility Days', mape: 3.2, samples: '92%', status: 'good' },
  ];

  const errorHotspots = [
    { period: '2023-03-10 ~ 03-15', error: 'MAPE 12.5%', reason: 'SVB 사태 영향', severity: 'high' },
    { period: '2022-09-20 ~ 09-25', error: 'MAPE 9.8%', reason: '금리 인상 발표', severity: 'medium' },
    { period: '2022-02-24 ~ 03-01', error: 'MAPE 11.2%', reason: '우크라이나 전쟁', severity: 'high' },
  ];

  // 금융 전용 KPI (옵션)
  const financialKpis = {
    sharpe: 1.85,
    returns: '+12.3%',
    maxDrawdown: '-4.2%',
    winRate: '62%',
    profitFactor: 1.45,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/timeseries/evaluation/backtest" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              Backtest Report
            </h1>
            <p className="text-slate-400 mt-1">{summary.model} • {summary.plan}</p>
          </div>
        </div>
        <button className="btn-primary">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Avg MAPE</p>
          <p className="text-2xl font-bold text-emerald-400">{summary.avgMape}%</p>
          <p className="text-xs text-emerald-400 mt-1">{summary.improvement} vs baseline</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Baseline MAPE</p>
          <p className="text-2xl font-bold text-slate-400">{summary.baselineMape}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Avg MAE</p>
          <p className="text-2xl font-bold text-slate-100">{summary.avgMae}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Avg RMSE</p>
          <p className="text-2xl font-bold text-slate-100">{summary.avgRmse}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Folds Passed</p>
          <p className="text-2xl font-bold text-emerald-400">{summary.folds}/{summary.folds}</p>
        </div>
      </div>

      {/* 금융 KPI (옵션) */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Financial KPIs (Optional)
        </h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-500">Sharpe Ratio</p>
            <p className="text-lg font-bold text-emerald-400">{financialKpis.sharpe}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Returns</p>
            <p className="text-lg font-bold text-emerald-400">{financialKpis.returns}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Max Drawdown</p>
            <p className="text-lg font-bold text-rose-400">{financialKpis.maxDrawdown}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Win Rate</p>
            <p className="text-lg font-bold text-slate-200">{financialKpis.winRate}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Profit Factor</p>
            <p className="text-lg font-bold text-slate-200">{financialKpis.profitFactor}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fold별 성능 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Fold-wise Performance</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fold</th>
                <th>Period</th>
                <th>MAPE</th>
                <th>MAE</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {foldResults.map((fold) => (
                <tr key={fold.fold}>
                  <td className="font-medium">Fold {fold.fold}</td>
                  <td className="text-slate-400 text-sm">{fold.period}</td>
                  <td className="font-mono text-emerald-400">{fold.mape}%</td>
                  <td className="font-mono text-slate-300">{fold.mae}</td>
                  <td>
                    <span className="badge badge-emerald">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {fold.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 실제 vs 예측 차트 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Actual vs Predicted</h3>
          <div className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">Overlay chart: Blue=Actual, Green=Predicted</p>
            </div>
          </div>
        </div>
      </div>

      {/* 구간별 성능 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Segment-wise Performance</h3>
        <p className="text-sm text-slate-400 mb-4">시간대, 요일, 변동성 구간별 성능 분석</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segmentPerformance.map((seg) => (
            <div 
              key={seg.segment}
              className={`p-4 rounded-lg border ${
                seg.status === 'good' ? 'bg-emerald-500/10 border-emerald-500/30' :
                seg.status === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-200">{seg.segment}</span>
                <span className={`font-mono font-bold ${
                  seg.status === 'good' ? 'text-emerald-400' :
                  seg.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {seg.mape}%
                </span>
              </div>
              <p className="text-xs text-slate-500">Sample ratio: {seg.samples}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 에러 핫스팟 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Error Hotspots
        </h3>
        <p className="text-sm text-slate-400 mb-4">예측 오차가 큰 구간 자동 탐지</p>
        <div className="space-y-3">
          {errorHotspots.map((spot, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-lg border ${
                spot.severity === 'high' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-300">{spot.period}</span>
                  <span className={`badge ${spot.severity === 'high' ? 'badge-rose' : 'badge-amber'}`}>
                    {spot.error}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">Reason: {spot.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
