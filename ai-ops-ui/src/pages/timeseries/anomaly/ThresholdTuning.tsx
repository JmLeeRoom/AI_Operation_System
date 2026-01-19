import { 
  Sliders,
  Save,
  Play,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart2,
  RefreshCw,
  Eye,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

export function ThresholdTuning() {
  const [threshold, setThreshold] = useState(0.75);
  const [cooldown, setCooldown] = useState(5);

  const metrics = {
    precision: 92.5,
    recall: 87.3,
    f1: 89.8,
    alertsPerDay: 23,
    fpRate: 7.5,
    fnRate: 12.7,
  };

  const thresholdImpact = [
    { threshold: 0.5, precision: 78.2, recall: 95.1, alerts: 85, cost: '$2,500' },
    { threshold: 0.6, precision: 84.5, recall: 92.3, alerts: 52, cost: '$1,800' },
    { threshold: 0.7, precision: 89.8, recall: 89.5, alerts: 35, cost: '$1,200' },
    { threshold: 0.75, precision: 92.5, recall: 87.3, alerts: 23, cost: '$850' },
    { threshold: 0.8, precision: 95.1, recall: 82.8, alerts: 15, cost: '$680' },
    { threshold: 0.85, precision: 97.2, recall: 75.2, alerts: 8, cost: '$520' },
    { threshold: 0.9, precision: 98.5, recall: 65.1, alerts: 4, cost: '$380' },
  ];

  const previewCases = [
    { id: 1, timestamp: '2024-01-19 14:32', score: 0.92, status: 'detected', actual: 'anomaly' },
    { id: 2, timestamp: '2024-01-19 14:15', score: 0.78, status: 'detected', actual: 'anomaly' },
    { id: 3, timestamp: '2024-01-19 13:45', score: 0.72, status: 'missed', actual: 'anomaly' },
    { id: 4, timestamp: '2024-01-19 12:30', score: 0.85, status: 'detected', actual: 'normal' },
    { id: 5, timestamp: '2024-01-19 11:20', score: 0.68, status: 'correct', actual: 'normal' },
  ];

  const alertPolicies = [
    { policy: 'Cooldown Period', value: `${cooldown} minutes`, description: '동일 엔티티 재알람 방지' },
    { policy: 'Deduplication', value: 'Enabled', description: '중복 이벤트 집계' },
    { policy: 'Aggregation', value: '5-minute window', description: '윈도우 내 알람 집계' },
    { policy: 'Severity Escalation', value: '3 consecutive', description: '연속 이상 시 심각도 상향' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            Threshold Tuning Studio
          </h1>
          <p className="text-slate-400 mt-1">이상탐지 임계값 및 알람 정책 튜닝</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Simulate
          </button>
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Policy
          </button>
        </div>
      </div>

      {/* 현재 성능 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Precision</p>
          <p className="text-2xl font-bold text-emerald-400">{metrics.precision}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Recall</p>
          <p className="text-2xl font-bold text-amber-400">{metrics.recall}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">F1 Score</p>
          <p className="text-2xl font-bold text-violet-400">{metrics.f1}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Alerts/Day</p>
          <p className="text-2xl font-bold text-slate-100">{metrics.alertsPerDay}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">FP Rate</p>
          <p className="text-2xl font-bold text-amber-400">{metrics.fpRate}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">FN Rate</p>
          <p className="text-2xl font-bold text-rose-400">{metrics.fnRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threshold Slider */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Anomaly Threshold</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Threshold</span>
              <span className="text-2xl font-bold text-violet-400">{threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>High Recall (0.5)</span>
              <span>High Precision (0.95)</span>
            </div>
          </div>

          {/* PR Curve Placeholder */}
          <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center mb-4">
            <div className="text-center">
              <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">Precision-Recall Curve</p>
              <p className="text-xs text-slate-600 mt-1">Current threshold marked</p>
            </div>
          </div>

          {/* Cost Curve */}
          <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-slate-600 mx-auto mb-1" />
              <p className="text-slate-500 text-sm">Alert Cost Curve</p>
              <p className="text-xs text-slate-600">FP cost + FN cost optimization</p>
            </div>
          </div>
        </div>

        {/* Threshold Impact Table */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Threshold Impact Analysis</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Threshold</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>Alerts/Day</th>
                <th>Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {thresholdImpact.map((row) => (
                <tr 
                  key={row.threshold}
                  className={row.threshold === threshold ? 'bg-violet-500/20' : ''}
                >
                  <td className={`font-mono ${row.threshold === threshold ? 'text-violet-400 font-bold' : 'text-slate-300'}`}>
                    {row.threshold.toFixed(2)}
                  </td>
                  <td className="font-mono text-emerald-400">{row.precision}%</td>
                  <td className="font-mono text-amber-400">{row.recall}%</td>
                  <td className="font-mono text-slate-300">{row.alerts}</td>
                  <td className="font-mono text-cyan-400">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Policy Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Alert Policy (Flood Control)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alertPolicies.map((policy) => (
            <div key={policy.policy} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-slate-300 font-medium">{policy.policy}</p>
              <p className="text-lg font-bold text-violet-400 mt-1">{policy.value}</p>
              <p className="text-xs text-slate-500 mt-1">{policy.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-medium">Alert Flood Prevention</span>
          </div>
          <p className="text-sm text-slate-400">
            쿨다운 및 중복 제거 정책으로 알람 폭주를 방지합니다.
            시뮬레이션으로 정책 효과를 미리 확인하세요.
          </p>
        </div>
      </div>

      {/* Preview Cases */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Preview: Recent Cases at Threshold {threshold.toFixed(2)}
        </h3>
        <div className="space-y-2">
          {previewCases.map((c) => (
            <div 
              key={c.id}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                c.status === 'detected' && c.actual === 'anomaly' ? 'bg-emerald-500/10 border-emerald-500/30' :
                c.status === 'missed' ? 'bg-rose-500/10 border-rose-500/30' :
                c.status === 'detected' && c.actual === 'normal' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {c.status === 'detected' && c.actual === 'anomaly' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {c.status === 'missed' && <XCircle className="w-4 h-4 text-rose-400" />}
                {c.status === 'detected' && c.actual === 'normal' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {c.status === 'correct' && c.actual === 'normal' && <CheckCircle className="w-4 h-4 text-slate-400" />}
                <span className="font-mono text-slate-300">{c.timestamp}</span>
                <span className="font-mono text-violet-400">Score: {c.score}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${c.actual === 'anomaly' ? 'badge-rose' : 'badge-slate'}`}>
                  Actual: {c.actual}
                </span>
                <span className={`badge ${
                  c.status === 'detected' && c.actual === 'anomaly' ? 'badge-emerald' :
                  c.status === 'missed' ? 'badge-rose' :
                  c.status === 'detected' && c.actual === 'normal' ? 'badge-amber' : 'badge-slate'
                }`}>
                  {c.status === 'detected' && c.actual === 'anomaly' ? 'TP' :
                   c.status === 'missed' ? 'FN' :
                   c.status === 'detected' && c.actual === 'normal' ? 'FP' : 'TN'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
