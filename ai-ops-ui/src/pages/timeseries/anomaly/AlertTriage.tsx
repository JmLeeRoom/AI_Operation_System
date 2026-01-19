import { 
  Bell,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Tag,
  ChevronRight,
  BarChart2,
  RefreshCw,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';

export function AlertTriage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<number | null>(1);

  const alerts = [
    { 
      id: 1, 
      timestamp: '2024-01-19 14:32:15', 
      entity: 'Sensor-A12', 
      score: 0.92, 
      status: 'new',
      severity: 'critical',
      type: 'Temperature spike',
      details: '온도 급상승 감지 (48.5°C → 72.3°C)',
    },
    { 
      id: 2, 
      timestamp: '2024-01-19 14:15:42', 
      entity: 'Sensor-B03', 
      score: 0.85, 
      status: 'acknowledged',
      severity: 'warning',
      type: 'Vibration anomaly',
      details: '진동 패턴 이상 감지',
    },
    { 
      id: 3, 
      timestamp: '2024-01-19 13:45:30', 
      entity: 'Sensor-C08', 
      score: 0.78, 
      status: 'resolved',
      severity: 'info',
      type: 'Pressure deviation',
      details: '압력 편차 (정상 범위 내 복귀)',
    },
    { 
      id: 4, 
      timestamp: '2024-01-19 12:30:18', 
      entity: 'Sensor-A05', 
      score: 0.88, 
      status: 'false_positive',
      severity: 'warning',
      type: 'Current surge',
      details: '정기 점검 중 발생 (FP 처리)',
    },
    { 
      id: 5, 
      timestamp: '2024-01-19 11:20:55', 
      entity: 'Sensor-D02', 
      score: 0.95, 
      status: 'new',
      severity: 'critical',
      type: 'Multi-sensor correlation',
      details: '다중 센서 동시 이상 감지',
    },
  ];

  const alertStats = {
    total: 45,
    new: 12,
    acknowledged: 8,
    resolved: 20,
    falsePositive: 5,
  };

  const selectedAlertData = alerts.find(a => a.id === selectedAlert);

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.entity.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Alert Triage Queue
          </h1>
          <p className="text-slate-400 mt-1">이상탐지 알람 검토 및 라벨링</p>
        </div>
        <button className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Total (24h)</p>
          <p className="text-2xl font-bold text-slate-100">{alertStats.total}</p>
        </div>
        <div className="stat-card border-rose-500/30">
          <p className="text-slate-400 text-xs mb-1">New</p>
          <p className="text-2xl font-bold text-rose-400">{alertStats.new}</p>
        </div>
        <div className="stat-card border-amber-500/30">
          <p className="text-slate-400 text-xs mb-1">Acknowledged</p>
          <p className="text-2xl font-bold text-amber-400">{alertStats.acknowledged}</p>
        </div>
        <div className="stat-card border-emerald-500/30">
          <p className="text-slate-400 text-xs mb-1">Resolved</p>
          <p className="text-2xl font-bold text-emerald-400">{alertStats.resolved}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">False Positive</p>
          <p className="text-2xl font-bold text-slate-400">{alertStats.falsePositive}</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {['all', 'new', 'acknowledged', 'resolved', 'false_positive'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-all ${
                statusFilter === status
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 알람 목록 */}
        <div className="lg:col-span-1 glass-card p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Alert Queue</h3>
          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => setSelectedAlert(alert.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAlert === alert.id 
                    ? 'bg-rose-500/20 border-rose-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                } ${alert.status === 'new' ? 'border-l-4 border-l-rose-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {alert.severity === 'info' && <Activity className="w-4 h-4 text-cyan-400" />}
                    <span className="badge badge-slate text-xs">{alert.entity}</span>
                  </div>
                  <span className={`badge text-xs ${
                    alert.status === 'new' ? 'badge-rose' :
                    alert.status === 'acknowledged' ? 'badge-amber' :
                    alert.status === 'resolved' ? 'badge-emerald' : 'badge-slate'
                  }`}>
                    {alert.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-200">{alert.type}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>{alert.timestamp}</span>
                  <span className="font-mono text-violet-400">Score: {alert.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 알람 상세 */}
        <div className="lg:col-span-2 glass-card p-6">
          {selectedAlertData ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-100">{selectedAlertData.type}</h3>
                    <span className={`badge ${
                      selectedAlertData.severity === 'critical' ? 'badge-rose' :
                      selectedAlertData.severity === 'warning' ? 'badge-amber' : 'badge-cyan'
                    }`}>
                      {selectedAlertData.severity}
                    </span>
                  </div>
                  <p className="text-slate-400">{selectedAlertData.entity} • {selectedAlertData.timestamp}</p>
                </div>
                <span className="text-2xl font-bold text-violet-400">Score: {selectedAlertData.score}</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-6">
                <p className="text-slate-300">{selectedAlertData.details}</p>
              </div>

              {/* 시계열 확대 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Time Series Context</h4>
                <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">Sensor readings with anomaly highlight</p>
                  </div>
                </div>
              </div>

              {/* 관련 정보 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Related Sensors</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="badge badge-slate text-xs">Sensor-A11</span>
                    <span className="badge badge-slate text-xs">Sensor-A13</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Recent History</p>
                  <p className="text-sm text-slate-300">Last 7 days: 2 similar alerts</p>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center gap-3">
                <button className="btn-secondary flex-1">
                  <Clock className="w-4 h-4" />
                  Acknowledge
                </button>
                <button className="btn-primary flex-1">
                  <CheckCircle className="w-4 h-4" />
                  Resolve (True Positive)
                </button>
                <button className="btn-ghost flex-1 border border-slate-600">
                  <XCircle className="w-4 h-4" />
                  False Positive
                </button>
              </div>

              {/* 라벨링 → 재학습 */}
              <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-400 font-medium text-sm">Label for Retraining</p>
                    <p className="text-xs text-slate-400 mt-1">
                      이 케이스를 라벨링하면 재학습 데이터셋에 추가됩니다.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      <Tag className="w-3 h-3" />
                      Normal
                    </button>
                    <button className="btn-primary text-xs px-3 py-1.5">
                      <Tag className="w-3 h-3" />
                      Anomaly
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select an alert to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
