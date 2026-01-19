import { 
  Image,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Tag,
  GitBranch,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CVDatasets() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const datasets = [
    {
      id: 'ds-001',
      name: 'Street Scene Detection',
      description: 'Urban street scenes for vehicle and pedestrian detection',
      task: 'Detection',
      version: 'v2.3',
      imageCount: 45230,
      classCount: 12,
      labeledRatio: 98,
      splitInfo: { train: 36184, val: 4523, test: 4523 },
      owner: 'JaeMyeong',
      updatedAt: '2 hours ago',
      status: 'healthy',
      tags: ['autonomous', 'urban', 'production']
    },
    {
      id: 'ds-002',
      name: 'Factory Defect Segmentation',
      description: 'Manufacturing defect detection with pixel-level masks',
      task: 'Segmentation',
      version: 'v1.8',
      imageCount: 23450,
      classCount: 8,
      labeledRatio: 100,
      splitInfo: { train: 18760, val: 2345, test: 2345 },
      owner: 'DataTeam',
      updatedAt: '1 day ago',
      status: 'healthy',
      tags: ['manufacturing', 'quality-control']
    },
    {
      id: 'ds-003',
      name: 'Pose Estimation Dataset',
      description: 'Human body keypoint annotations for pose estimation',
      task: 'Pose',
      version: 'v3.1',
      imageCount: 67800,
      classCount: 17,
      labeledRatio: 85,
      splitInfo: { train: 54240, val: 6780, test: 6780 },
      owner: 'MLTeam',
      updatedAt: '5 hours ago',
      status: 'warning',
      tags: ['human', 'keypoints', 'sports']
    },
    {
      id: 'ds-004',
      name: 'OCR Document Dataset',
      description: 'Document images with text region annotations',
      task: 'OCR',
      version: 'v2.0',
      imageCount: 15600,
      classCount: 3,
      labeledRatio: 92,
      splitInfo: { train: 12480, val: 1560, test: 1560 },
      owner: 'JaeMyeong',
      updatedAt: '3 days ago',
      status: 'healthy',
      tags: ['document', 'text', 'korean']
    },
    {
      id: 'ds-005',
      name: 'Multi-Class Classification',
      description: 'General image classification dataset',
      task: 'Classification',
      version: 'v4.2',
      imageCount: 120000,
      classCount: 100,
      labeledRatio: 100,
      splitInfo: { train: 96000, val: 12000, test: 12000 },
      owner: 'DataTeam',
      updatedAt: '1 week ago',
      status: 'healthy',
      tags: ['general', 'benchmark']
    },
    {
      id: 'ds-006',
      name: 'Video Tracking Dataset',
      description: 'Multi-object tracking sequences',
      task: 'Tracking',
      version: 'v1.2',
      imageCount: 89000,
      classCount: 5,
      labeledRatio: 78,
      splitInfo: { train: 71200, val: 8900, test: 8900 },
      owner: 'MLTeam',
      updatedAt: '2 weeks ago',
      status: 'warning',
      tags: ['video', 'tracking', 'surveillance']
    },
  ];

  const getTaskBadge = (task: string) => {
    const styles: Record<string, string> = {
      'Detection': 'badge-cyan',
      'Segmentation': 'badge-violet',
      'Pose': 'badge-amber',
      'OCR': 'badge-emerald',
      'Classification': 'badge-blue',
      'Tracking': 'badge-rose',
    };
    return styles[task] || 'badge-slate';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CV Datasets</h1>
          <p className="text-slate-400 mt-1">컴퓨터 비전 데이터셋 관리 및 버전 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Dataset
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Image className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">361,080</p>
              <p className="text-sm text-slate-400">Total Images</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-sm text-slate-400">Datasets</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">92.2%</p>
              <p className="text-sm text-slate-400">Avg Labeled</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-sm text-slate-400">Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search datasets..." 
              className="input-field pl-10 w-80"
            />
          </div>
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg">
          <button 
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 데이터셋 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {datasets.map((dataset, index) => (
          <div 
            key={dataset.id}
            className="glass-card p-5 hover:border-brand-500/30 transition-all cursor-pointer group"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => navigate('/cv/data/datasets/detail')}
          >
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                    {dataset.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`badge ${getTaskBadge(dataset.task)} text-xs`}>
                      {dataset.task}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {dataset.version}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* 설명 */}
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{dataset.description}</p>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <p className="text-lg font-semibold text-white">{dataset.imageCount.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Images</p>
              </div>
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <p className="text-lg font-semibold text-white">{dataset.classCount}</p>
                <p className="text-xs text-slate-500">Classes</p>
              </div>
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <p className={`text-lg font-semibold ${dataset.labeledRatio >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {dataset.labeledRatio}%
                </p>
                <p className="text-xs text-slate-500">Labeled</p>
              </div>
            </div>

            {/* 태그 */}
            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              {dataset.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-800/50 text-slate-400 text-xs rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

            {/* 푸터 */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {dataset.owner}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {dataset.updatedAt}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
