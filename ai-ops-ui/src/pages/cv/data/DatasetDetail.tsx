import { 
  Image,
  ArrowLeft,
  GitBranch,
  Tag,
  User,
  Clock,
  Download,
  Settings,
  BarChart3,
  Grid3X3,
  Layers,
  History,
  ChevronRight,
  Eye,
  EyeOff,
  ZoomIn,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CVDatasetDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'samples' | 'versions' | 'splits'>('overview');
  const [overlayVisible, setOverlayVisible] = useState(true);

  const dataset = {
    id: 'ds-001',
    name: 'Street Scene Detection',
    description: 'Urban street scenes for vehicle and pedestrian detection. Captured from multiple cities with various weather conditions and times of day.',
    task: 'Detection',
    version: 'v2.3',
    imageCount: 45230,
    classCount: 12,
    labeledRatio: 98,
    owner: 'JaeMyeong',
    createdAt: '2024-01-15',
    updatedAt: '2 hours ago',
    tags: ['autonomous', 'urban', 'production'],
    schema: 'COCO Detection v1.0',
  };

  const classDistribution = [
    { name: 'Car', count: 125400, percentage: 38 },
    { name: 'Person', count: 89200, percentage: 27 },
    { name: 'Truck', count: 32100, percentage: 10 },
    { name: 'Bus', count: 21500, percentage: 7 },
    { name: 'Motorcycle', count: 18900, percentage: 6 },
    { name: 'Bicycle', count: 15600, percentage: 5 },
    { name: 'Traffic Light', count: 12300, percentage: 4 },
    { name: 'Traffic Sign', count: 8400, percentage: 3 },
  ];

  const versions = [
    { version: 'v2.3', date: '2024-03-15', images: 45230, changes: '+2,450 images, Fixed label errors', status: 'current' },
    { version: 'v2.2', date: '2024-02-28', images: 42780, changes: '+5,000 images', status: 'archived' },
    { version: 'v2.1', date: '2024-02-10', images: 37780, changes: 'Added new class: Bicycle', status: 'archived' },
    { version: 'v2.0', date: '2024-01-25', images: 35000, changes: 'Major restructure', status: 'archived' },
  ];

  const splits = [
    { name: 'train', count: 36184, percentage: 80 },
    { name: 'val', count: 4523, percentage: 10 },
    { name: 'test', count: 4523, percentage: 10 },
  ];

  const sampleImages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    filename: `street_scene_${String(i + 1).padStart(5, '0')}.jpg`,
    resolution: '1920x1080',
    annotations: Math.floor(Math.random() * 15) + 3,
    classes: ['Car', 'Person', 'Traffic Sign'].slice(0, Math.floor(Math.random() * 3) + 1),
  }));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'samples', label: 'Samples', icon: Grid3X3 },
    { id: 'versions', label: 'Versions', icon: History },
    { id: 'splits', label: 'Splits', icon: Layers },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/cv/data/datasets')}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{dataset.name}</h1>
            <span className="badge badge-cyan">{dataset.task}</span>
            <span className="badge badge-slate flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {dataset.version}
            </span>
          </div>
          <p className="text-slate-400 mt-1">{dataset.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          Owner: <span className="text-slate-200">{dataset.owner}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          Updated: <span className="text-slate-200">{dataset.updatedAt}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Tag className="w-4 h-4" />
          Schema: <span className="text-slate-200">{dataset.schema}</span>
        </span>
        <div className="flex items-center gap-1.5">
          {dataset.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-800/50 text-slate-400 text-xs rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-1 border-b border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-brand-500 text-brand-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          {/* 통계 카드 */}
          <div className="col-span-2 space-y-6">
            {/* 기본 통계 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="stat-card">
                <p className="text-2xl font-bold text-white">{dataset.imageCount.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Total Images</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-white">{dataset.classCount}</p>
                <p className="text-sm text-slate-400">Classes</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-emerald-400">{dataset.labeledRatio}%</p>
                <p className="text-sm text-slate-400">Labeled</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-white">329K</p>
                <p className="text-sm text-slate-400">Annotations</p>
              </div>
            </div>

            {/* 클래스 분포 */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-400" />
                Class Distribution
              </h3>
              <div className="space-y-3">
                {classDistribution.map((cls, index) => (
                  <div key={cls.name} className="flex items-center gap-4">
                    <div className="w-28 text-sm text-slate-300">{cls.name}</div>
                    <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all"
                        style={{ width: `${cls.percentage}%`, animationDelay: `${index * 50}ms` }}
                      />
                    </div>
                    <div className="w-20 text-sm text-slate-400 text-right">
                      {cls.count.toLocaleString()}
                    </div>
                    <div className="w-12 text-sm text-slate-500 text-right">
                      {cls.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드 패널 */}
          <div className="space-y-4">
            {/* Split 정보 */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                Data Splits
              </h3>
              <div className="space-y-2">
                {splits.map((split) => (
                  <div key={split.name} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-sm font-medium text-slate-300 capitalize">{split.name}</span>
                    <span className="text-sm text-slate-400">{split.count.toLocaleString()} ({split.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 최근 버전 */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-brand-400" />
                Recent Versions
              </h3>
              <div className="space-y-2">
                {versions.slice(0, 3).map((v) => (
                  <div key={v.version} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                      <span className={`text-sm font-medium ${v.status === 'current' ? 'text-brand-400' : 'text-slate-300'}`}>
                        {v.version}
                      </span>
                      {v.status === 'current' && (
                        <span className="badge badge-emerald text-xs">Current</span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* 퀵 액션 */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn-secondary justify-center">
                  Start Training
                </button>
                <button className="w-full btn-ghost justify-center">
                  Run Evaluation
                </button>
                <button className="w-full btn-ghost justify-center">
                  Create New Version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'samples' && (
        <div className="space-y-4">
          {/* 샘플 뷰어 컨트롤 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative max-w-sm">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter by class, filename..." 
                  className="input-field pl-10 w-64"
                />
              </div>
              <select className="input-field w-40">
                <option>All Classes</option>
                <option>Car</option>
                <option>Person</option>
                <option>Truck</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setOverlayVisible(!overlayVisible)}
                className={`btn-ghost ${overlayVisible ? 'text-brand-400' : ''}`}
              >
                {overlayVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Overlay
              </button>
              <button className="btn-ghost">
                <ZoomIn className="w-4 h-4" />
                Zoom
              </button>
            </div>
          </div>

          {/* 샘플 갤러리 */}
          <div className="grid grid-cols-4 gap-4">
            {sampleImages.map((img) => (
              <div 
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-slate-700/50 hover:border-brand-500/50 transition-all cursor-pointer"
              >
                {/* 이미지 플레이스홀더 */}
                <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                  <Image className="w-12 h-12 text-slate-600" />
                  
                  {/* 오버레이 (bbox 시뮬레이션) */}
                  {overlayVisible && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-8 w-24 h-16 border-2 border-cyan-400 rounded" />
                      <div className="absolute top-6 right-12 w-12 h-20 border-2 border-emerald-400 rounded" />
                      <div className="absolute bottom-8 left-1/3 w-8 h-8 border-2 border-amber-400 rounded" />
                    </div>
                  )}
                </div>

                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs text-white font-medium truncate">{img.filename}</p>
                    <p className="text-xs text-slate-400">{img.resolution}</p>
                  </div>
                </div>

                {/* 하단 정보 */}
                <div className="p-3 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {img.classes.slice(0, 2).map((cls) => (
                        <span key={cls} className="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                          {cls}
                        </span>
                      ))}
                      {img.classes.length > 2 && (
                        <span className="text-xs text-slate-500">+{img.classes.length - 2}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{img.annotations} annot.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="btn-ghost">Previous</button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 45].map((page, i) => (
                <button 
                  key={i}
                  className={`w-8 h-8 rounded-lg text-sm ${page === 1 ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="btn-ghost">Next</button>
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Date</th>
                <th>Images</th>
                <th>Changes</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.version}>
                  <td>
                    <span className="flex items-center gap-2 font-medium text-slate-200">
                      <GitBranch className="w-4 h-4 text-brand-400" />
                      {v.version}
                    </span>
                  </td>
                  <td className="text-slate-400">{v.date}</td>
                  <td className="text-slate-300">{v.images.toLocaleString()}</td>
                  <td className="text-slate-400">{v.changes}</td>
                  <td>
                    <span className={`badge ${v.status === 'current' ? 'badge-emerald' : 'badge-slate'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ghost text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'splits' && (
        <div className="grid grid-cols-3 gap-6">
          {splits.map((split) => (
            <div key={split.name} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white capitalize">{split.name}</h3>
                <span className="badge badge-cyan">{split.percentage}%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{split.count.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mb-4">images</p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                  style={{ width: `${split.percentage}%` }}
                />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <button className="btn-ghost text-sm w-full justify-center">
                  View Samples
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
