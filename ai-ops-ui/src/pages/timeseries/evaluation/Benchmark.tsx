import { 
  Trophy,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
  GitBranch,
  ChevronUp,
  ChevronDown,
  Clock
} from 'lucide-react';
import { useState } from 'react';

export function Benchmark() {
  const [sortBy, setSortBy] = useState('mape');
  const [sortOrder, setSortOrder] = useState('asc');

  const models = [
    {
      rank: 1,
      name: 'XGBoost-v2.4',
      type: 'GBDT',
      mape: 4.2,
      mae: 12.5,
      rmse: 18.3,
      r2: 0.89,
      trainTime: '4h 15m',
      inferenceTime: '2ms',
      status: 'production',
      change: 'up',
    },
    {
      rank: 2,
      name: 'LightGBM-v2.1',
      type: 'GBDT',
      mape: 4.4,
      mae: 13.1,
      rmse: 19.2,
      r2: 0.87,
      trainTime: '3h 45m',
      inferenceTime: '1.5ms',
      status: 'staging',
      change: 'same',
    },
    {
      rank: 3,
      name: 'LSTM-v1.8',
      type: 'Deep Learning',
      mape: 4.6,
      mae: 13.8,
      rmse: 20.1,
      r2: 0.86,
      trainTime: '8h 30m',
      inferenceTime: '5ms',
      status: 'archived',
      change: 'down',
    },
    {
      rank: 4,
      name: 'Prophet-v3.0',
      type: 'Statistical',
      mape: 4.8,
      mae: 14.2,
      rmse: 21.0,
      r2: 0.84,
      trainTime: '45m',
      inferenceTime: '10ms',
      status: 'baseline',
      change: 'same',
    },
    {
      rank: 5,
      name: 'CatBoost-v1.5',
      type: 'GBDT',
      mape: 4.5,
      mae: 13.4,
      rmse: 19.8,
      r2: 0.86,
      trainTime: '5h 20m',
      inferenceTime: '2.5ms',
      status: 'archived',
      change: 'up',
    },
    {
      rank: 6,
      name: 'Baseline (MA-20)',
      type: 'Naive',
      mape: 5.8,
      mae: 17.2,
      rmse: 25.1,
      r2: 0.78,
      trainTime: '-',
      inferenceTime: '<1ms',
      status: 'baseline',
      change: 'same',
    },
  ];

  const improvements = [
    { from: 'Baseline', to: 'XGBoost-v2.4', metric: 'MAPE', improvement: '-27.6%' },
    { from: 'Prophet', to: 'XGBoost-v2.4', metric: 'MAPE', improvement: '-12.5%' },
    { from: 'LSTM', to: 'XGBoost-v2.4', metric: 'MAPE', improvement: '-8.7%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            Model Benchmark
          </h1>
          <p className="text-slate-400 mt-1">모델 성능 비교 - Leaderboard</p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* 상위 모델 하이라이트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.slice(0, 3).map((model, idx) => (
          <div 
            key={model.name}
            className={`glass-card p-5 ${
              idx === 0 ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent' :
              idx === 1 ? 'border-slate-400/50' : 'border-orange-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-2xl ${
                  idx === 0 ? '' : idx === 1 ? 'text-slate-400' : 'text-orange-700'
                }`}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </span>
                <span className="font-semibold text-slate-100">{model.name}</span>
              </div>
              <span className={`badge ${
                model.status === 'production' ? 'badge-emerald' :
                model.status === 'staging' ? 'badge-amber' : 'badge-slate'
              }`}>
                {model.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">MAPE</p>
                <p className="text-xl font-bold text-emerald-400">{model.mape}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">R²</p>
                <p className="text-xl font-bold text-slate-200">{model.r2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 전체 리더보드 */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100">Full Leaderboard</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Model</th>
              <th>Type</th>
              <th className="cursor-pointer" onClick={() => setSortBy('mape')}>
                <span className="flex items-center gap-1">
                  MAPE {sortBy === 'mape' && <ChevronUp className="w-3 h-3" />}
                </span>
              </th>
              <th>MAE</th>
              <th>RMSE</th>
              <th>R²</th>
              <th>Train Time</th>
              <th>Inference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.name} className={model.status === 'production' ? 'bg-emerald-500/5' : ''}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">#{model.rank}</span>
                    {model.change === 'up' && <ChevronUp className="w-4 h-4 text-emerald-400" />}
                    {model.change === 'down' && <ChevronDown className="w-4 h-4 text-rose-400" />}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-200">{model.name}</span>
                  </div>
                </td>
                <td>
                  <span className="badge badge-slate">{model.type}</span>
                </td>
                <td className="font-mono text-emerald-400 font-bold">{model.mape}%</td>
                <td className="font-mono text-slate-300">{model.mae}</td>
                <td className="font-mono text-slate-300">{model.rmse}</td>
                <td className="font-mono text-slate-300">{model.r2}</td>
                <td className="text-slate-400">{model.trainTime}</td>
                <td className="text-slate-400">{model.inferenceTime}</td>
                <td>
                  <span className={`badge ${
                    model.status === 'production' ? 'badge-emerald' :
                    model.status === 'staging' ? 'badge-amber' :
                    model.status === 'baseline' ? 'badge-cyan' : 'badge-slate'
                  }`}>
                    {model.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 개선 요약 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Improvement Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {improvements.map((imp, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">{imp.from} → {imp.to}</span>
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{imp.improvement}</p>
              <p className="text-xs text-slate-500">{imp.metric} reduction</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
