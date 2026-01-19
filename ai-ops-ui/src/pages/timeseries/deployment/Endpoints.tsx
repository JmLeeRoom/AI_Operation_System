import { 
  Globe,
  Plus,
  Search,
  Clock,
  Zap,
  Server,
  CheckCircle,
  Activity,
  Play,
  Pause,
  Settings,
  Calendar,
  Database
} from 'lucide-react';
import { useState } from 'react';

export function Endpoints() {
  const [endpointType, setEndpointType] = useState('all');

  const endpoints = [
    {
      id: 'stock-batch',
      name: 'Stock Forecaster Batch',
      type: 'batch',
      model: 'Stock Forecaster v2.4',
      schedule: '매일 06:00 KST',
      output: 's3://predictions/stock/',
      status: 'active',
      lastRun: '2024-01-19 06:00',
      nextRun: '2024-01-20 06:00',
      avgDuration: '45m',
    },
    {
      id: 'stock-realtime',
      name: 'Stock Forecaster Realtime',
      type: 'realtime',
      model: 'Stock Forecaster v2.4',
      latency: '12ms',
      qps: 850,
      status: 'active',
      uptime: '99.95%',
      rateLimit: '1000 req/s',
    },
    {
      id: 'sensor-realtime',
      name: 'Sensor Anomaly Realtime',
      type: 'realtime',
      model: 'Sensor Anomaly v1.8',
      latency: '8ms',
      qps: 2500,
      status: 'shadow',
      uptime: '99.99%',
      rateLimit: '5000 req/s',
    },
    {
      id: 'demand-batch',
      name: 'Demand Forecaster Batch',
      type: 'batch',
      model: 'Demand Forecaster v1.5',
      schedule: '매주 월요일 03:00 KST',
      output: 'db://warehouse.demand_forecast',
      status: 'active',
      lastRun: '2024-01-15 03:00',
      nextRun: '2024-01-22 03:00',
      avgDuration: '2h 30m',
    },
  ];

  const filteredEndpoints = endpoints.filter(e => 
    endpointType === 'all' || e.type === endpointType
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            Endpoints
          </h1>
          <p className="text-slate-400 mt-1">Batch Scoring / Real-time Scoring 엔드포인트 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Endpoint
        </button>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          {['all', 'batch', 'realtime'].map((type) => (
            <button
              key={type}
              onClick={() => setEndpointType(type)}
              className={`px-4 py-2 text-sm rounded-md capitalize transition-all ${
                endpointType === type
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'All' : type === 'batch' ? 'Batch' : 'Real-time'}
            </button>
          ))}
        </div>
      </div>

      {/* 엔드포인트 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEndpoints.map((endpoint) => (
          <div key={endpoint.id} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  endpoint.type === 'batch' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                }`}>
                  {endpoint.type === 'batch' ? (
                    <Clock className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Zap className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{endpoint.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${endpoint.type === 'batch' ? 'badge-amber' : 'badge-emerald'}`}>
                      {endpoint.type}
                    </span>
                    <span className={`badge ${
                      endpoint.status === 'active' ? 'badge-emerald' :
                      endpoint.status === 'shadow' ? 'badge-violet' : 'badge-slate'
                    }`}>
                      {endpoint.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn-ghost p-2">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-4">
              <p className="text-xs text-slate-500 mb-1">Model</p>
              <p className="text-sm text-cyan-400">{endpoint.model}</p>
            </div>

            {endpoint.type === 'batch' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Schedule</p>
                    <p className="text-sm text-slate-200">{endpoint.schedule}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Avg Duration</p>
                    <p className="text-sm text-slate-200">{endpoint.avgDuration}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Output</p>
                  <p className="text-sm text-emerald-400 font-mono">{endpoint.output}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Last: {endpoint.lastRun}</span>
                  <span>Next: {endpoint.nextRun}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Latency</p>
                    <p className="text-lg font-bold text-emerald-400">{endpoint.latency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">QPS</p>
                    <p className="text-lg font-bold text-slate-200">{endpoint.qps?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Uptime</p>
                    <p className="text-lg font-bold text-emerald-400">{endpoint.uptime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rate Limit</p>
                  <p className="text-sm text-slate-200">{endpoint.rateLimit}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              {endpoint.status === 'active' ? (
                <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                  <Pause className="w-3 h-3" />
                  Pause
                </button>
              ) : (
                <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                  <Play className="w-3 h-3" />
                  Activate
                </button>
              )}
              <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                <Activity className="w-3 h-3" />
                Logs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shadow/Canary 설정 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Deployment Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-slate-300 font-medium">Shadow Mode</span>
            </div>
            <p className="text-xs text-slate-500">
              프로덕션 트래픽 미러링으로 새 모델 테스트.
              응답은 기록만 하고 반환하지 않음.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300 font-medium">Canary Release</span>
            </div>
            <p className="text-xs text-slate-500">
              트래픽의 일부(예: 5%)만 새 모델로 라우팅.
              점진적 롤아웃.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-300 font-medium">Rollback</span>
            </div>
            <p className="text-xs text-slate-500">
              문제 발생 시 이전 버전으로 즉시 롤백.
              자동 롤백 룰 설정 가능.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
