import { 
  Plus, 
  Search, 
  Filter,
  Image,
  Video,
  FileAudio,
  Layers,
  Calendar,
  Tag,
  MoreVertical,
  Eye,
  GitBranch,
  Trash2,
  Download,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Datasets() {
  const datasets = [
    {
      id: 'ds-001',
      name: 'COCO-Captions-Extended',
      modality: 'Image-Text',
      icon: Image,
      samples: '1.2M',
      versions: 5,
      splits: ['train', 'val', 'test'],
      avgFrames: 1,
      avgCaptionLen: 42,
      status: 'ready',
      updated: '2024-01-15',
      tags: ['captioning', 'VQA'],
    },
    {
      id: 'ds-002',
      name: 'VideoQA-Custom',
      modality: 'Video-Text',
      icon: Video,
      samples: '45K',
      versions: 3,
      splits: ['train', 'test'],
      avgFrames: 32,
      avgCaptionLen: 85,
      status: 'ready',
      updated: '2024-01-12',
      tags: ['videoQA', 'temporal'],
    },
    {
      id: 'ds-003',
      name: 'AudioCaps-Korean',
      modality: 'Audio-Text',
      icon: FileAudio,
      samples: '180K',
      versions: 2,
      splits: ['train', 'val'],
      avgFrames: null,
      avgCaptionLen: 28,
      status: 'processing',
      updated: '2024-01-18',
      tags: ['audio-caption', 'korean'],
    },
    {
      id: 'ds-004',
      name: 'Multimodal-Instructions',
      modality: 'Multi',
      icon: Layers,
      samples: '500K',
      versions: 7,
      splits: ['train', 'val', 'test'],
      avgFrames: 4,
      avgCaptionLen: 120,
      status: 'ready',
      updated: '2024-01-10',
      tags: ['instruction', 'SFT', 'VLM'],
    },
  ];

  const modalityDistribution = [
    { name: 'Image-Text', count: 1245000, percentage: 65, color: 'violet' },
    { name: 'Video-Text', count: 420000, percentage: 22, color: 'cyan' },
    { name: 'Audio-Text', count: 250000, percentage: 13, color: 'emerald' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Multimodal Datasets</h1>
          <p className="text-slate-400 mt-1">페어링된 멀티모달 데이터셋 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Dataset
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Datasets</p>
          <p className="text-2xl font-bold text-slate-100">{datasets.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Samples</p>
          <p className="text-2xl font-bold text-slate-100">1.92M</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Avg. Caption Length</p>
          <p className="text-2xl font-bold text-slate-100">68 tokens</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Avg. Frames</p>
          <p className="text-2xl font-bold text-slate-100">12</p>
        </div>
      </div>

      {/* 모달리티 분포 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Modality Distribution</h2>
        <div className="flex items-center gap-4 mb-3">
          {modalityDistribution.map((mod, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${mod.color}-500`} />
              <span className="text-sm text-slate-400">{mod.name}</span>
              <span className="text-sm text-slate-500">({mod.percentage}%)</span>
            </div>
          ))}
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex">
          {modalityDistribution.map((mod, idx) => (
            <div 
              key={idx}
              className={`h-full bg-${mod.color}-500`}
              style={{ width: `${mod.percentage}%` }}
            />
          ))}
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search datasets..."
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* 데이터셋 목록 */}
      <div className="glass-card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dataset Name</th>
              <th>Modality</th>
              <th>Samples</th>
              <th>Versions</th>
              <th>Splits</th>
              <th>Avg. Frames</th>
              <th>Avg. Caption</th>
              <th>Status</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((ds) => {
              const Icon = ds.icon;
              return (
                <tr key={ds.id} className="group">
                  <td>
                    <Link 
                      to={`/multimodal/data/datasets/${ds.id}`}
                      className="flex items-center gap-3 hover:text-violet-400 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="font-medium text-slate-200">{ds.name}</span>
                    </Link>
                  </td>
                  <td>
                    <span className={`badge ${
                      ds.modality === 'Image-Text' ? 'badge-violet' :
                      ds.modality === 'Video-Text' ? 'badge-cyan' :
                      ds.modality === 'Audio-Text' ? 'badge-emerald' : 'badge-amber'
                    }`}>
                      {ds.modality}
                    </span>
                  </td>
                  <td className="text-slate-300">{ds.samples}</td>
                  <td>
                    <span className="flex items-center gap-1 text-slate-400">
                      <GitBranch className="w-3 h-3" />
                      {ds.versions}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {ds.splits.map((split, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                          {split}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-slate-400">{ds.avgFrames ?? '-'}</td>
                  <td className="text-slate-400">{ds.avgCaptionLen} tokens</td>
                  <td>
                    <span className={`flex items-center gap-1.5 ${
                      ds.status === 'ready' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      <span className={`status-dot ${ds.status === 'ready' ? 'online' : ''}`} 
                        style={ds.status !== 'ready' ? { background: '#22d3ee' } : {}} 
                      />
                      {ds.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {ds.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="badge badge-slate text-xs">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-slate-700 rounded" title="View">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-slate-700 rounded" title="Download">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-slate-700 rounded" title="More">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
