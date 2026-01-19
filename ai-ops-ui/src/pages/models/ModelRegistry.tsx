import { 
  Plus, 
  Search, 
  Filter,
  Box,
  User,
  Calendar,
  TrendingUp,
  Rocket,
  ArrowUpRight,
  Eye,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const models = [
  {
    id: '1',
    name: 'cv-object-detector',
    latestVersion: 'v2.3.1',
    stage: 'production',
    owner: 'CV Team',
    lastEvalScore: 94.2,
    metricName: 'mAP@50',
    domain: 'CV',
    updatedAt: '2 days ago',
    versions: 8,
    deployments: 3,
  },
  {
    id: '2',
    name: 'llm-customer-support',
    latestVersion: 'v1.2.0',
    stage: 'staging',
    owner: 'NLP Team',
    lastEvalScore: 0.89,
    metricName: 'BLEU',
    domain: 'LLM',
    updatedAt: '5 hours ago',
    versions: 12,
    deployments: 1,
  },
  {
    id: '3',
    name: 'audio-transcriber',
    latestVersion: 'v3.0.0',
    stage: 'production',
    owner: 'Audio Team',
    lastEvalScore: 96.8,
    metricName: 'WER',
    domain: 'Audio',
    updatedAt: '1 week ago',
    versions: 15,
    deployments: 5,
  },
  {
    id: '4',
    name: 'anomaly-detector',
    latestVersion: 'v1.8.2',
    stage: 'development',
    owner: 'DataOps',
    lastEvalScore: 0.92,
    metricName: 'AUC-ROC',
    domain: 'Time',
    updatedAt: '3 hours ago',
    versions: 6,
    deployments: 0,
  },
];

const stats = [
  { label: 'Production', value: '12', color: 'text-emerald-400' },
  { label: 'Staging', value: '8', color: 'text-amber-400' },
  { label: 'Development', value: '24', color: 'text-blue-400' },
  { label: 'Total Versions', value: '156', color: 'text-violet-400' },
];

const getStageBadge = (stage: string) => {
  const styles: Record<string, string> = {
    production: 'badge-emerald',
    staging: 'badge-amber',
    development: 'badge-blue',
    archived: 'badge-slate',
  };
  return styles[stage] || 'badge-slate';
};

const getDomainBadge = (domain: string) => {
  const styles: Record<string, string> = {
    CV: 'badge-violet',
    LLM: 'badge-emerald',
    Audio: 'badge-cyan',
    Time: 'badge-amber',
  };
  return styles[domain] || 'badge-slate';
};

export function ModelRegistry() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Model Registry</h1>
          <p className="text-slate-400 mt-1">Manage and version your ML models</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Model
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search models..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Production', 'Staging', 'Dev'].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'All' 
                    ? 'bg-brand-500 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 모델 리스트 */}
      <div className="space-y-3">
        {models.map((model, idx) => (
          <div 
            key={model.id}
            className="glass-card p-5 hover:border-brand-500/30 transition-all cursor-pointer group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Box className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                    {model.name}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-mono bg-slate-800 text-brand-400 rounded border border-slate-700">
                    {model.latestVersion}
                  </span>
                  <span className={`badge ${getStageBadge(model.stage)}`}>
                    {model.stage}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {model.owner}
                  </span>
                  <span className={`badge ${getDomainBadge(model.domain)}`}>
                    {model.domain}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    {model.metricName}: <span className="text-emerald-400 font-medium">{model.lastEvalScore}</span>
                  </span>
                  <span>{model.versions} versions</span>
                  <span>{model.deployments} deployments</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Updated {model.updatedAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="btn-secondary">
                  <Eye className="w-4 h-4" />
                  Versions
                </button>
                <button className="btn-primary">
                  <Rocket className="w-4 h-4" />
                  Deploy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
