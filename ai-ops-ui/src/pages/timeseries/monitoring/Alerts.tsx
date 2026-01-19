import { 
  Bell,
  Plus,
  Search,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Pause,
  Play,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

export function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');

  const alertRules = [
    {
      id: 1,
      name: 'MAPE Degradation',
      condition: 'MAPE > baseline * 1.1',
      severity: 'warning',
      action: 'Notify + Review',
      status: 'active',
      triggered: 3,
      cooldown: '30 min',
    },
    {
      id: 2,
      name: 'High Drift PSI',
      condition: 'Any feature PSI > 0.25',
      severity: 'critical',
      action: 'Auto retrain trigger',
      status: 'active',
      triggered: 1,
      cooldown: '1 hour',
    },
    {
      id: 3,
      name: 'Alert Flood',
      condition: 'Alerts/hour > 50',
      severity: 'critical',
      action: 'Suppress + Escalate',
      status: 'active',
      triggered: 0,
      cooldown: '15 min',
    },
    {
      id: 4,
      name: 'Inference Latency',
      condition: 'p99 latency > 100ms',
      severity: 'warning',
      action: 'Notify',
      status: 'paused',
      triggered: 5,
      cooldown: '10 min',
    },
    {
      id: 5,
      name: 'Anomaly FP Rate',
      condition: 'FP rate > 10%',
      severity: 'warning',
      action: 'Notify + Threshold review',
      status: 'active',
      triggered: 2,
      cooldown: '1 hour',
    },
  ];

  const recentAlerts = [
    { id: 1, rule: 'High Drift PSI', timestamp: '2024-01-19 14:32', entity: 'volume', status: 'new' },
    { id: 2, rule: 'MAPE Degradation', timestamp: '2024-01-19 13:45', entity: 'stock-forecaster', status: 'acknowledged' },
    { id: 3, rule: 'MAPE Degradation', timestamp: '2024-01-19 12:20', entity: 'stock-forecaster', status: 'resolved' },
    { id: 4, rule: 'Anomaly FP Rate', timestamp: '2024-01-19 11:15', entity: 'sensor-anomaly', status: 'resolved' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Alert Rules
          </h1>
          <p className="text-slate-400 mt-1">경보 룰 설정 - 쿨다운, 중복 제거, 에스컬레이션</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Active Rules</p>
          <p className="text-2xl font-bold text-emerald-400">{alertRules.filter(r => r.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Paused Rules</p>
          <p className="text-2xl font-bold text-amber-400">{alertRules.filter(r => r.status === 'paused').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Total Triggered (24h)</p>
          <p className="text-2xl font-bold text-slate-100">{alertRules.reduce((acc, r) => acc + r.triggered, 0)}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Open Alerts</p>
          <p className="text-2xl font-bold text-rose-400">{recentAlerts.filter(a => a.status === 'new').length}</p>
        </div>
      </div>

      {/* 알림 룰 테이블 */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100">Alert Rules Configuration</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Condition</th>
              <th>Severity</th>
              <th>Action</th>
              <th>Cooldown</th>
              <th>Triggered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alertRules.map((rule) => (
              <tr key={rule.id}>
                <td className="font-medium text-slate-200">{rule.name}</td>
                <td className="font-mono text-xs text-slate-400">{rule.condition}</td>
                <td>
                  <span className={`badge ${rule.severity === 'critical' ? 'badge-rose' : 'badge-amber'}`}>
                    {rule.severity}
                  </span>
                </td>
                <td className="text-slate-300 text-sm">{rule.action}</td>
                <td className="text-slate-400">{rule.cooldown}</td>
                <td className="font-mono text-slate-300">{rule.triggered}</td>
                <td>
                  <span className={`badge ${rule.status === 'active' ? 'badge-emerald' : 'badge-slate'}`}>
                    {rule.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-slate-700 transition-colors">
                      {rule.status === 'active' ? (
                        <Pause className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Play className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-700 transition-colors">
                      <Settings className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 최근 발생 알림 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Alert Instances</h3>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                alert.status === 'new' ? 'bg-rose-500/10 border-rose-500/30' :
                alert.status === 'acknowledged' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {alert.status === 'new' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
                {alert.status === 'acknowledged' && <Clock className="w-5 h-5 text-amber-400" />}
                {alert.status === 'resolved' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                <div>
                  <p className="font-medium text-slate-200">{alert.rule}</p>
                  <p className="text-sm text-slate-500">{alert.entity} • {alert.timestamp}</p>
                </div>
              </div>
              <span className={`badge ${
                alert.status === 'new' ? 'badge-rose' :
                alert.status === 'acknowledged' ? 'badge-amber' : 'badge-emerald'
              }`}>
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 쿨다운/중복제거 설명 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Alert Flood Control Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">Cooldown</span>
            </div>
            <p className="text-xs text-slate-500">
              동일 조건 알람이 반복 발생 시, 설정된 시간 동안 추가 알람을 억제합니다.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-medium">Deduplication</span>
            </div>
            <p className="text-xs text-slate-500">
              동일한 엔티티에서 동일한 유형의 알람이 발생하면 하나로 집계합니다.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <span className="text-slate-300 font-medium">Escalation</span>
            </div>
            <p className="text-xs text-slate-500">
              알람 폭주 감지 시 자동으로 심각도를 상향하고 담당자에게 에스컬레이션합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
