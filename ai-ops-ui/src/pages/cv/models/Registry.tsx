import { 
  Package,
  Plus,
  Search,
  Filter,
  GitBranch,
  ArrowRight,
  Download,
  Rocket,
  BarChart3,
  Clock,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CVModelRegistry() {
  const navigate = useNavigate();

  const models = [
    {
      id: 'model-001',
      name: 'YOLOv8-StreetScene',
      task: 'Detection',
      latestVersion: 'v3.2',
      stage: 'production',
      versions: 8,
      metrics: { mAP50: 0.847, mAP5095: 0.623 },
      dataset: 'Street Scene Detection v2.3',
      labelSchema: 'COCO-12class',
      owner: 'JaeMyeong',
      updatedAt: '2 hours ago',
      tags: ['autonomous', 'real-time']
    },
    {
      id: 'model-002',
      name: 'UNet-FactoryDefect',
      task: 'Segmentation',
      latestVersion: 'v2.1',
      stage: 'staging',
      versions: 5,
      metrics: { mIoU: 0.912, dice: 0.934 },
      dataset: 'Factory Defect Segmentation v1.8',
      labelSchema: 'Defect-8class',
      owner: 'MLTeam',
      updatedAt: '1 day ago',
      tags: ['manufacturing', 'quality']
    },
    {
      id: 'model-003',
      name: 'HRNet-Pose',
      task: 'Pose',
      latestVersion: 'v1.5',
      stage: 'development',
      versions: 3,
      metrics: { AP: 0.756, OKS: 0.821 },
      dataset: 'Pose Estimation Dataset v3.1',
      labelSchema: 'COCO-17keypoints',
      owner: 'JaeMyeong',
      updatedAt: '5 hours ago',
      tags: ['sports', 'keypoints']
    },
    {
      id: 'model-004',
      name: 'PaddleOCR-Document',
      task: 'OCR',
      latestVersion: 'v2.0',
      stage: 'production',
      versions: 4,
      metrics: { CER: 0.023, WER: 0.078 },
      dataset: 'OCR Document Dataset v2.0',
      labelSchema: 'Korean-Text',
      owner: 'DataTeam',
      updatedAt: '3 days ago',
      tags: ['document', 'korean']
    },
    {
      id: 'model-005',
      name: 'EfficientNet-Classification',
      task: 'Classification',
      latestVersion: 'v4.0',
      stage: 'archived',
      versions: 12,
      metrics: { accuracy: 0.923, f1: 0.918 },
      dataset: 'Multi-Class Classification v4.2',
      labelSchema: '100-class',
      owner: 'MLTeam',
      updatedAt: '1 week ago',
      tags: ['general', 'benchmark']
    },
  ];

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'production': return { badge: 'badge-emerald', icon: CheckCircle };
      case 'staging': return { badge: 'badge-amber', icon: AlertCircle };
      case 'development': return { badge: 'badge-cyan', icon: GitBranch };
      case 'archived': return { badge: 'badge-slate', icon: Package };
      default: return { badge: 'badge-slate', icon: Package };
    }
  };

  const getTaskBadge = (task: string) => {
    const styles: Record<string, string> = {
      'Detection': 'badge-cyan',
      'Segmentation': 'badge-violet',
      'Pose': 'badge-amber',
      'OCR': 'badge-emerald',
      'Classification': 'badge-blue',
    };
    return styles[task] || 'badge-slate';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            CV Model Registry
          </h1>
          <p className="text-slate-400 mt-1">모델 버전 관리 및 배포 스테이지</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Model
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{models.length}</p>
              <p className="text-sm text-slate-400">Total Models</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{models.filter(m => m.stage === 'production').length}</p>
              <p className="text-sm text-slate-400">In Production</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{models.filter(m => m.stage === 'staging').length}</p>
              <p className="text-sm text-slate-400">In Staging</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{models.reduce((a, b) => a + b.versions, 0)}</p>
              <p className="text-sm text-slate-400">Total Versions</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search models..." 
            className="input-field pl-10"
          />
        </div>
        <select className="input-field w-40">
          <option>All Stages</option>
          <option>Production</option>
          <option>Staging</option>
          <option>Development</option>
          <option>Archived</option>
        </select>
        <select className="input-field w-40">
          <option>All Tasks</option>
          <option>Detection</option>
          <option>Segmentation</option>
          <option>Pose</option>
          <option>OCR</option>
          <option>Classification</option>
        </select>
      </div>

      {/* 모델 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {models.map((model, index) => {
          const stageStyle = getStageStyle(model.stage);
          return (
            <div
              key={model.id}
              className="glass-card p-6 hover:border-brand-500/30 transition-all cursor-pointer group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {model.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${getTaskBadge(model.task)} text-xs`}>
                        {model.task}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {model.latestVersion}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${stageStyle.badge} flex items-center gap-1 capitalize`}>
                    <stageStyle.icon className="w-3 h-3" />
                    {model.stage}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lineage */}
              <div className="p-3 bg-slate-800/30 rounded-lg mb-4 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Dataset:</span>
                  <span className="text-slate-200">{model.dataset}</span>
                  <span className="text-slate-600">•</span>
                  <span>Schema:</span>
                  <span className="text-slate-200">{model.labelSchema}</span>
                </div>
              </div>

              {/* 메트릭 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(model.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-2 bg-slate-800/30 rounded-lg">
                    <p className="text-lg font-semibold text-white">{typeof value === 'number' ? value.toFixed(3) : value}</p>
                    <p className="text-xs text-slate-500 uppercase">{key}</p>
                  </div>
                ))}
              </div>

              {/* 태그 */}
              <div className="flex items-center gap-1.5 mb-4">
                {model.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-800/50 text-slate-400 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 푸터 */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {model.owner}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {model.updatedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {model.versions} versions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost text-xs py-1">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Metrics
                  </button>
                  <button className="btn-ghost text-xs py-1">
                    <Rocket className="w-3.5 h-3.5" />
                    Deploy
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
