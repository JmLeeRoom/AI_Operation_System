import { 
  Package,
  Plus,
  Search,
  Clock,
  Cloud,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Server,
  Zap,
  GitBranch,
  Download,
  Settings
} from 'lucide-react';
import { useState } from 'react';

export function FeatureStore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  const featureSets = [
    {
      id: 'stock-features-v2',
      name: 'Stock Features v2.3',
      description: '주가 예측용 피처셋',
      pipeline: 'stock-features-v2',
      features: 32,
      created: '2024-01-19',
      usedInRuns: 15,
      offlineSync: true,
      onlineSync: true,
      servingSchema: 'entity_id: string, timestamp: datetime',
    },
    {
      id: 'sensor-features-v1',
      name: 'Sensor Features v1.8',
      description: '센서 이상탐지용 피처셋',
      pipeline: 'sensor-features-v1',
      features: 64,
      created: '2024-01-18',
      usedInRuns: 8,
      offlineSync: true,
      onlineSync: true,
      servingSchema: 'sensor_id: string, timestamp: datetime',
    },
    {
      id: 'demand-features-v1',
      name: 'Demand Features v1.5',
      description: '수요 예측용 피처셋',
      pipeline: 'demand-features-v1',
      features: 24,
      created: '2024-01-15',
      usedInRuns: 5,
      offlineSync: true,
      onlineSync: false,
      servingSchema: 'store_id: string, product_id: string, timestamp: datetime',
    },
  ];

  const onlineFeatures = [
    { name: 'close_ma_5', latency: '2ms', qps: 1250, lastUpdate: '5s ago' },
    { name: 'close_ma_20', latency: '2ms', qps: 1250, lastUpdate: '5s ago' },
    { name: 'volume_zscore', latency: '3ms', qps: 980, lastUpdate: '5s ago' },
    { name: 'price_momentum', latency: '4ms', qps: 850, lastUpdate: '10s ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Feature Store
          </h1>
          <p className="text-slate-400 mt-1">Offline / Online 피처 저장소 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Feature Set
        </button>
      </div>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Feature Sets</span>
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{featureSets.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Features</span>
            <GitBranch className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{featureSets.reduce((acc, f) => acc + f.features, 0)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Offline Store</span>
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">Healthy</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Online Store</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">3ms avg</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search feature sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          {['all', 'online', 'offline'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-all ${
                filterMode === mode
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 피처셋 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {featureSets.map((fs) => (
            <div key={fs.id} className="glass-card p-5 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-100">{fs.name}</h3>
                  <p className="text-sm text-slate-500">{fs.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-cyan">{fs.features} features</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500">Pipeline</p>
                  <p className="text-sm text-violet-400">{fs.pipeline}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm text-slate-300">{fs.created}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Used in Runs</p>
                  <p className="text-sm text-slate-300">{fs.usedInRuns}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Sync Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`flex items-center gap-1 text-xs ${
                      fs.offlineSync ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      <Database className="w-3 h-3" /> Offline
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${
                      fs.onlineSync ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      <Zap className="w-3 h-3" /> Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-4">
                <p className="text-xs text-slate-500 mb-1">Serving Schema (Point-in-Time Join)</p>
                <code className="text-xs text-cyan-400 font-mono">{fs.servingSchema}</code>
              </div>

              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                  <RefreshCw className="w-3 h-3" />
                  Sync
                </button>
                <button className="btn-ghost text-xs px-2 py-1.5">
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Online Feature 상태 */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Online Store Status
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium">All features synced</span>
              </div>
              <p className="text-xs text-slate-400">Last sync: 5 seconds ago</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Live Features</h4>
              <div className="space-y-2">
                {onlineFeatures.map((f) => (
                  <div key={f.name} className="p-2 rounded bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-cyan-400">{f.name}</span>
                      <span className="text-xs text-emerald-400">{f.latency}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{f.qps} QPS</span>
                      <span>{f.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Point-in-Time Join</h4>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-slate-400">
                  시간 기준 정확한 피처 조인을 보장합니다.
                  미래 데이터 누수(leakage)를 방지합니다.
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  Leakage protection enabled
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
