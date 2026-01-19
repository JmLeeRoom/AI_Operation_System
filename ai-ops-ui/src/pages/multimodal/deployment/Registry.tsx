import { 
  Package,
  Plus,
  Search,
  GitBranch,
  ChevronUp,
  ChevronDown,
  Rocket,
  RotateCcw,
  CheckCircle,
  Clock,
  Eye,
  Download,
  MoreVertical,
  Layers
} from 'lucide-react';
import { useState } from 'react';

export function Registry() {
  const [expandedModel, setExpandedModel] = useState<string | null>('vlm-instruct');

  const models = [
    {
      id: 'vlm-instruct',
      name: 'vlm-instruct',
      latestVersion: 'v2.1',
      stage: 'Production',
      bundle: {
        model: 'v2.1',
        prompt: 'v1.5',
        preprocessRecipe: 'v3.0',
        index: 'v1.2',
      },
      versions: [
        { version: 'v2.1', stage: 'Production', date: '2024-01-15', accuracy: '89.2%' },
        { version: 'v2.0', stage: 'Staging', date: '2024-01-10', accuracy: '87.5%' },
        { version: 'v1.5', stage: 'Archived', date: '2024-01-01', accuracy: '85.0%' },
      ],
    },
    {
      id: 'video-qa',
      name: 'video-qa',
      latestVersion: 'v1.3',
      stage: 'Staging',
      bundle: {
        model: 'v1.3',
        prompt: 'v1.0',
        preprocessRecipe: 'v2.0',
        index: null,
      },
      versions: [
        { version: 'v1.3', stage: 'Staging', date: '2024-01-12', accuracy: '78.5%' },
        { version: 'v1.2', stage: 'Production', date: '2024-01-05', accuracy: '76.2%' },
      ],
    },
    {
      id: 'clip-custom',
      name: 'clip-custom',
      latestVersion: 'v3.0',
      stage: 'Production',
      bundle: {
        model: 'v3.0',
        prompt: null,
        preprocessRecipe: 'v2.5',
        index: 'v2.0',
      },
      versions: [
        { version: 'v3.0', stage: 'Production', date: '2024-01-08', accuracy: 'R@1: 68.2%' },
        { version: 'v2.5', stage: 'Archived', date: '2023-12-20', accuracy: 'R@1: 65.5%' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-violet-400" />
            </div>
            Model Registry
          </h1>
          <p className="text-slate-400 mt-1">멀티모달 모델 버전 및 릴리즈 번들 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Model
        </button>
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search models..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Release Bundle 설명 */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <Layers className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-slate-200">Release Bundle</h3>
        </div>
        <p className="text-sm text-slate-400 mb-3">
          멀티모달 모델 배포는 4종 세트(Model + Prompt + Preprocess Recipe + Index)를 원자적으로 릴리즈합니다.
        </p>
        <div className="grid grid-cols-4 gap-3">
          {['Model', 'Prompt', 'Recipe', 'Index'].map((item, i) => (
            <div key={i} className="p-2 rounded bg-slate-800/50 text-center">
              <span className="text-xs text-slate-400">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 모델 목록 */}
      <div className="space-y-4">
        {models.map((model) => (
          <div key={model.id} className="glass-card p-0 overflow-hidden">
            {/* 헤더 */}
            <div 
              className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
              onClick={() => setExpandedModel(expandedModel === model.id ? null : model.id)}
            >
              <div className="flex items-center gap-4">
                {expandedModel === model.id ? (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-slate-500 rotate-180" />
                )}
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Package className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-200">{model.name}</span>
                    <span className="badge badge-violet">{model.latestVersion}</span>
                    <span className={`badge ${model.stage === 'Production' ? 'badge-emerald' : 'badge-amber'}`}>
                      {model.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {model.versions.length} versions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost text-sm">
                    <Rocket className="w-4 h-4" />
                    Promote
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* 상세 */}
            {expandedModel === model.id && (
              <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
                {/* Bundle */}
                <div className="mb-6">
                  <p className="text-xs text-slate-500 mb-2">Current Release Bundle</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                      <p className="text-xs text-slate-500">Model</p>
                      <p className="text-sm font-medium text-violet-400">{model.bundle.model}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${model.bundle.prompt ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-slate-800/50 border border-slate-700/50'}`}>
                      <p className="text-xs text-slate-500">Prompt</p>
                      <p className={`text-sm font-medium ${model.bundle.prompt ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {model.bundle.prompt || 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-slate-500">Recipe</p>
                      <p className="text-sm font-medium text-emerald-400">{model.bundle.preprocessRecipe}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${model.bundle.index ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-800/50 border border-slate-700/50'}`}>
                      <p className="text-xs text-slate-500">Index</p>
                      <p className={`text-sm font-medium ${model.bundle.index ? 'text-amber-400' : 'text-slate-500'}`}>
                        {model.bundle.index || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Versions */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Version History</p>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Version</th>
                        <th>Stage</th>
                        <th>Date</th>
                        <th>Metrics</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.versions.map((ver) => (
                        <tr key={ver.version}>
                          <td>
                            <span className="font-mono text-slate-200">{ver.version}</span>
                          </td>
                          <td>
                            <span className={`badge ${
                              ver.stage === 'Production' ? 'badge-emerald' :
                              ver.stage === 'Staging' ? 'badge-amber' : 'badge-slate'
                            }`}>
                              {ver.stage}
                            </span>
                          </td>
                          <td className="text-slate-400">{ver.date}</td>
                          <td className="text-slate-300">{ver.accuracy}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <button className="p-1 hover:bg-slate-700 rounded" title="View">
                                <Eye className="w-4 h-4 text-slate-400" />
                              </button>
                              <button className="p-1 hover:bg-slate-700 rounded" title="Rollback">
                                <RotateCcw className="w-4 h-4 text-slate-400" />
                              </button>
                              <button className="p-1 hover:bg-slate-700 rounded" title="Download">
                                <Download className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
