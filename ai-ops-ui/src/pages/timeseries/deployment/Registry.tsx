import { 
  Package,
  Plus,
  Search,
  GitBranch,
  Database,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Tag,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useState } from 'react';

export function Registry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const models = [
    {
      id: 'stock-forecaster',
      name: 'Stock Forecaster',
      latestVersion: 'v2.4',
      stage: 'production',
      dataset: 'Stock Prices (KOSPI) v2.3',
      featureSet: 'Stock Features v2.3',
      backtestPlan: 'Stock 5-Fold WF',
      mape: 4.2,
      created: '2024-01-19',
      author: 'team-ml',
    },
    {
      id: 'sensor-anomaly',
      name: 'Sensor Anomaly Detector',
      latestVersion: 'v1.8',
      stage: 'staging',
      dataset: 'Industrial Sensors v1.8',
      featureSet: 'Sensor Features v1.8',
      backtestPlan: 'Sensor Rolling',
      mape: null,
      precision: 92.5,
      created: '2024-01-18',
      author: 'team-iot',
    },
    {
      id: 'demand-forecaster',
      name: 'Demand Forecaster',
      latestVersion: 'v1.5',
      stage: 'archived',
      dataset: 'Retail Demand v1.5',
      featureSet: 'Demand Features v1.5',
      backtestPlan: 'Demand Monthly',
      mape: 5.1,
      created: '2024-01-15',
      author: 'team-retail',
    },
  ];

  const versions = [
    { version: 'v2.4', stage: 'production', mape: 4.2, date: '2024-01-19' },
    { version: 'v2.3', stage: 'archived', mape: 4.4, date: '2024-01-12' },
    { version: 'v2.2', stage: 'archived', mape: 4.6, date: '2024-01-05' },
    { version: 'v2.1', stage: 'archived', mape: 4.8, date: '2023-12-28' },
  ];

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || m.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Model Registry
          </h1>
          <p className="text-slate-400 mt-1">모델 버전, 스테이지, Lineage 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Model
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          {['all', 'production', 'staging', 'archived'].map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-all ${
                stageFilter === stage
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* 모델 카드 */}
      <div className="space-y-4">
        {filteredModels.map((model) => (
          <div key={model.id} className="glass-card p-5 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  model.stage === 'production' ? 'bg-emerald-500/20' :
                  model.stage === 'staging' ? 'bg-amber-500/20' : 'bg-slate-700/50'
                }`}>
                  <Package className={`w-7 h-7 ${
                    model.stage === 'production' ? 'text-emerald-400' :
                    model.stage === 'staging' ? 'text-amber-400' : 'text-slate-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-cyan">{model.latestVersion}</span>
                    <span className={`badge ${
                      model.stage === 'production' ? 'badge-emerald' :
                      model.stage === 'staging' ? 'badge-amber' : 'badge-slate'
                    }`}>
                      {model.stage}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">
                  {model.mape ? `${model.mape}%` : `${model.precision}%`}
                </p>
                <p className="text-xs text-slate-500">{model.mape ? 'MAPE' : 'Precision'}</p>
              </div>
            </div>

            {/* Lineage Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/50 text-xs">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-400">Dataset:</span>
                <span className="text-cyan-400">{model.dataset}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/50 text-xs">
                <GitBranch className="w-3 h-3 text-violet-400" />
                <span className="text-slate-400">Features:</span>
                <span className="text-violet-400">{model.featureSet}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/50 text-xs">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="text-slate-400">Backtest:</span>
                <span className="text-amber-400">{model.backtestPlan}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Created: {model.created} by {model.author}
              </div>
              <div className="flex items-center gap-2">
                {model.stage !== 'production' && (
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <ArrowUp className="w-3 h-3" />
                    Promote
                  </button>
                )}
                {model.stage === 'production' && (
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    <ArrowDown className="w-3 h-3" />
                    Rollback
                  </button>
                )}
                <button className="btn-ghost text-xs px-2 py-1.5">
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 버전 히스토리 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          Version History: Stock Forecaster
        </h3>
        <div className="space-y-2">
          {versions.map((v) => (
            <div 
              key={v.version}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                v.stage === 'production' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="badge badge-cyan font-mono">{v.version}</span>
                <span className="text-slate-300">{v.date}</span>
                {v.stage === 'production' && (
                  <span className="badge badge-emerald">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Production
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-emerald-400">MAPE: {v.mape}%</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
