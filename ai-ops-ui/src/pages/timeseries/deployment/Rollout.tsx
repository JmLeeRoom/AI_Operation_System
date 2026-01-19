import { 
  Rocket,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Activity,
  ArrowRight,
  Clock,
  Percent
} from 'lucide-react';
import { useState } from 'react';

export function Rollout() {
  const [canaryPercent, setCanaryPercent] = useState(10);

  const currentDeployment = {
    model: 'Stock Forecaster',
    currentVersion: 'v2.3',
    targetVersion: 'v2.4',
    strategy: 'canary',
    status: 'in_progress',
    startedAt: '2024-01-19 10:00',
    progress: 35,
  };

  const rolloutHistory = [
    { version: 'v2.3 → v2.4', strategy: 'canary', status: 'in_progress', date: '2024-01-19', duration: '-' },
    { version: 'v2.2 → v2.3', strategy: 'blue-green', status: 'success', date: '2024-01-12', duration: '2h' },
    { version: 'v2.1 → v2.2', strategy: 'canary', status: 'rollback', date: '2024-01-05', duration: '45m' },
    { version: 'v2.0 → v2.1', strategy: 'blue-green', status: 'success', date: '2023-12-28', duration: '1h 30m' },
  ];

  const metrics = {
    current: { latency: '15ms', errorRate: '0.02%', throughput: '850 req/s' },
    canary: { latency: '12ms', errorRate: '0.01%', throughput: '85 req/s' },
  };

  const rollbackRules = [
    { rule: 'Error rate > 1%', action: 'Auto rollback', status: 'armed' },
    { rule: 'Latency p99 > 100ms', action: 'Alert + Manual', status: 'armed' },
    { rule: 'MAPE increase > 10%', action: 'Auto rollback', status: 'armed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            Rollout Management
          </h1>
          <p className="text-slate-400 mt-1">A/B Test, Canary, Blue-Green 배포 및 롤백</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-danger">
            <RotateCcw className="w-4 h-4" />
            Rollback
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            New Rollout
          </button>
        </div>
      </div>

      {/* 현재 배포 상태 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Current Rollout</h3>
          <span className="badge badge-amber">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            {currentDeployment.status}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 text-sm">Current</span>
              <p className="text-lg font-bold text-slate-200">{currentDeployment.currentVersion}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-violet-400" />
            <div className="p-3 rounded-lg bg-violet-500/20 border border-violet-500/50">
              <span className="text-violet-400 text-sm">Target</span>
              <p className="text-lg font-bold text-violet-300">{currentDeployment.targetVersion}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Rollout Progress</span>
              <span className="text-violet-400 font-bold">{currentDeployment.progress}%</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all"
                style={{ width: `${currentDeployment.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Canary 슬라이더 */}
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Canary Traffic %</span>
            <span className="text-2xl font-bold text-violet-400">{canaryPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={canaryPercent}
            onChange={(e) => setCanaryPercent(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0% (Current only)</span>
            <span>100% (Full rollout)</span>
          </div>
        </div>

        {/* 메트릭 비교 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Current Version ({100 - canaryPercent}%)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Latency</span>
                <span className="text-slate-200">{metrics.current.latency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Error Rate</span>
                <span className="text-emerald-400">{metrics.current.errorRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Throughput</span>
                <span className="text-slate-200">{metrics.current.throughput}</span>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
            <h4 className="text-sm font-medium text-violet-300 mb-3">Canary Version ({canaryPercent}%)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Latency</span>
                <span className="text-emerald-400">{metrics.canary.latency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Error Rate</span>
                <span className="text-emerald-400">{metrics.canary.errorRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Throughput</span>
                <span className="text-slate-200">{metrics.canary.throughput}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 롤백 룰 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Auto Rollback Rules</h3>
        <div className="space-y-3">
          {rollbackRules.map((rule, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200">{rule.rule}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{rule.action}</span>
                <span className="badge badge-emerald">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {rule.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 배포 히스토리 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Rollout History</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Version Change</th>
              <th>Strategy</th>
              <th>Status</th>
              <th>Date</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {rolloutHistory.map((rollout, idx) => (
              <tr key={idx}>
                <td className="font-mono text-slate-200">{rollout.version}</td>
                <td>
                  <span className="badge badge-slate">{rollout.strategy}</span>
                </td>
                <td>
                  <span className={`badge ${
                    rollout.status === 'success' ? 'badge-emerald' :
                    rollout.status === 'rollback' ? 'badge-rose' : 'badge-amber'
                  }`}>
                    {rollout.status}
                  </span>
                </td>
                <td className="text-slate-400">{rollout.date}</td>
                <td className="text-slate-400">{rollout.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
