import { 
  Plus, 
  Play, 
  Search,
  Clock,
  MoreHorizontal,
  Edit,
  Copy,
  TrendingUp,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pipelines = [
  { 
    id: '1', 
    name: 'CV Object Detection Training', 
    owner: 'JaeMyeong', 
    lastRun: '2 hours ago', 
    successRate: 95.2, 
    nextSchedule: 'Tomorrow 09:00', 
    domain: 'CV',
    domainColor: 'badge-violet',
    tags: ['training', 'production'],
    runs: 156,
  },
  { 
    id: '2', 
    name: 'LLM Fine-tuning Pipeline', 
    owner: 'TeamML', 
    lastRun: '5 hours ago', 
    successRate: 88.7, 
    nextSchedule: null, 
    domain: 'LLM',
    domainColor: 'badge-emerald',
    tags: ['fine-tuning'],
    runs: 89,
  },
  { 
    id: '3', 
    name: 'Audio Transcription', 
    owner: 'AudioTeam', 
    lastRun: '1 day ago', 
    successRate: 99.1, 
    nextSchedule: 'Daily 00:00', 
    domain: 'Audio',
    domainColor: 'badge-cyan',
    tags: ['inference'],
    runs: 234,
  },
  { 
    id: '4', 
    name: 'Timeseries Anomaly Detection', 
    owner: 'DataOps', 
    lastRun: '3 hours ago', 
    successRate: 92.4, 
    nextSchedule: 'Hourly', 
    domain: 'Time',
    domainColor: 'badge-amber',
    tags: ['monitoring'],
    runs: 1024,
  },
];

export function PipelineList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipelines</h1>
          <p className="text-slate-400 mt-1">Manage your ML pipelines</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/pipelines/builder')}
        >
          <Plus className="w-4 h-4" />
          New Pipeline
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search pipelines..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'CV', 'LLM', 'Audio', 'Time'].map((filter) => (
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

      {/* 파이프라인 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {pipelines.map((pipeline, idx) => (
          <div 
            key={pipeline.id} 
            className="glass-card hover:border-brand-500/30 transition-all duration-200 cursor-pointer group"
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={() => navigate('/pipelines/builder')}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {pipeline.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${pipeline.domainColor}`}>
                      {pipeline.domain}
                    </span>
                    {pipeline.tags.map((tag) => (
                      <span key={tag} className="badge badge-slate">{tag}</span>
                    ))}
                  </div>
                </div>
                <button 
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-800 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">Last Run</p>
                  <p className="text-sm font-medium text-slate-200">{pipeline.lastRun}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">Success</p>
                  <p className={`text-sm font-semibold flex items-center justify-center gap-1 ${
                    pipeline.successRate >= 95 ? 'text-emerald-400' : 
                    pipeline.successRate >= 90 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    {pipeline.successRate}%
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">Runs</p>
                  <p className="text-sm font-medium text-slate-200">{pipeline.runs}</p>
                </div>
              </div>

              {pipeline.nextSchedule && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                  <Clock className="w-3 h-3 text-brand-400" />
                  <span>Next: <span className="text-slate-300 font-medium">{pipeline.nextSchedule}</span></span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                <button 
                  className="btn-primary flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/runs');
                  }}
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
                <button 
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/pipelines/builder');
                  }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="btn-ghost" onClick={(e) => e.stopPropagation()}>
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
