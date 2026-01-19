import { 
  BarChart2,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { useState } from 'react';

export function Metrics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [segmentFilter, setSegmentFilter] = useState('all');

  const overallMetrics = {
    mape: 4.2,
    mae: 12.5,
    rmse: 18.3,
    r2: 0.89,
    mapeChange: -0.3,
    maeChange: -0.8,
  };

  const timeSegmentMetrics = [
    { segment: 'Morning (9-12)', mape: 4.8, mae: 14.2, samples: '25%', icon: Sun },
    { segment: 'Afternoon (12-15)', mape: 3.9, mae: 11.5, samples: '35%', icon: Clock },
    { segment: 'Evening (15-18)', mape: 4.1, mae: 12.1, samples: '30%', icon: Moon },
    { segment: 'Night (18-09)', mape: 5.2, mae: 15.8, samples: '10%', icon: Moon },
  ];

  const daySegmentMetrics = [
    { segment: 'Monday', mape: 4.5, mae: 13.2 },
    { segment: 'Tuesday', mape: 4.0, mae: 11.8 },
    { segment: 'Wednesday', mape: 3.8, mae: 11.2 },
    { segment: 'Thursday', mape: 4.1, mae: 12.1 },
    { segment: 'Friday', mape: 4.4, mae: 13.0 },
    { segment: 'Weekend', mape: 5.8, mae: 17.2 },
  ];

  const specialPeriods = [
    { period: 'Earnings Season', mape: 5.5, baseline: 4.2, impact: '+31%' },
    { period: 'Holiday Season', mape: 5.2, baseline: 4.2, impact: '+24%' },
    { period: 'High Volatility', mape: 6.8, baseline: 4.2, impact: '+62%' },
    { period: 'Low Volatility', mape: 3.2, baseline: 4.2, impact: '-24%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            Metrics Analysis
          </h1>
          <p className="text-slate-400 mt-1">구간별 성능 분석 - 시간대, 요일, 특수 구간</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            {['7d', '30d', '90d', '1y'].map((range) => (
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
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* 전체 메트릭 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Overall MAPE</span>
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{overallMetrics.mape}%</p>
          <p className="text-xs text-emerald-400 mt-1">{overallMetrics.mapeChange}% vs prev</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Overall MAE</span>
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{overallMetrics.mae}</p>
          <p className="text-xs text-emerald-400 mt-1">{overallMetrics.maeChange} vs prev</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Overall RMSE</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{overallMetrics.rmse}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">R² Score</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{overallMetrics.r2}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간대별 성능 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Time-of-Day Performance</h3>
          <div className="space-y-3">
            {timeSegmentMetrics.map((seg) => (
              <div key={seg.segment} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <seg.icon className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-200">{seg.segment}</span>
                  </div>
                  <span className={`font-mono font-bold ${seg.mape < 4.2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {seg.mape}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>MAE: {seg.mae}</span>
                  <span>Samples: {seg.samples}</span>
                </div>
                <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${seg.mape < 4.2 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${100 - (seg.mape * 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 요일별 성능 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Day-of-Week Performance</h3>
          <div className="space-y-3">
            {daySegmentMetrics.map((seg) => (
              <div key={seg.segment} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-200">{seg.segment}</span>
                <div className="flex items-center gap-4">
                  <span className={`font-mono ${seg.mape < 4.2 ? 'text-emerald-400' : seg.mape > 5 ? 'text-rose-400' : 'text-amber-400'}`}>
                    MAPE: {seg.mape}%
                  </span>
                  <span className="text-slate-400 font-mono">
                    MAE: {seg.mae}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <p className="text-xs text-rose-400">
              ⚠️ 주말 예측 성능이 평일 대비 38% 낮음 - 추가 피처 검토 필요
            </p>
          </div>
        </div>
      </div>

      {/* 특수 구간 분석 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Special Period Impact</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>MAPE</th>
              <th>Baseline</th>
              <th>Impact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {specialPeriods.map((period) => (
              <tr key={period.period}>
                <td className="font-medium text-slate-200">{period.period}</td>
                <td className="font-mono text-amber-400">{period.mape}%</td>
                <td className="font-mono text-slate-400">{period.baseline}%</td>
                <td className={`font-mono ${period.impact.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {period.impact}
                </td>
                <td>
                  <span className={`badge ${
                    period.impact.startsWith('+') && parseInt(period.impact) > 50 ? 'badge-rose' :
                    period.impact.startsWith('+') ? 'badge-amber' : 'badge-emerald'
                  }`}>
                    {parseInt(period.impact) > 50 ? 'critical' : parseInt(period.impact) > 0 ? 'warning' : 'good'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 메트릭 트렌드 차트 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Metrics Trend Over Time</h3>
        <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500">MAPE/MAE/RMSE trend over selected period</p>
          </div>
        </div>
      </div>
    </div>
  );
}
