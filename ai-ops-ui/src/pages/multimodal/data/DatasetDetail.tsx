import { 
  ArrowLeft,
  Image,
  FileText,
  BarChart3,
  GitBranch,
  Layers,
  Clock,
  Download,
  Settings,
  Play,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function DatasetDetail() {
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'splits' | 'samples'>('overview');
  const [currentSample, setCurrentSample] = useState(0);

  const dataset = {
    id: 'ds-001',
    name: 'COCO-Captions-Extended',
    modality: 'Image-Text',
    samples: 1200000,
    avgFrames: 1,
    avgCaptionLen: 42,
    versions: [
      { version: 'v5', date: '2024-01-15', samples: 1200000, changes: 'Added 50K new pairs' },
      { version: 'v4', date: '2024-01-02', samples: 1150000, changes: 'Quality filtering' },
      { version: 'v3', date: '2023-12-20', samples: 1100000, changes: 'Removed duplicates' },
    ],
    splits: [
      { name: 'train', samples: 960000, percentage: 80 },
      { name: 'val', samples: 120000, percentage: 10 },
      { name: 'test', samples: 120000, percentage: 10 },
    ],
    stats: {
      imageResolution: '640x480 avg',
      captionLength: '12-85 tokens',
      languages: ['en'],
      domains: ['general', 'scene', 'object'],
    }
  };

  const sampleData = [
    { id: 1, image: null, caption: 'A dog playing with a frisbee in the park on a sunny day.' },
    { id: 2, image: null, caption: 'A group of people sitting at a table eating dinner together.' },
    { id: 3, image: null, caption: 'A red sports car parked on the street in front of a building.' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link 
          to="/multimodal/data/datasets" 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Image className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{dataset.name}</h1>
              <p className="text-slate-400 text-sm">Image-Text Paired Dataset</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Use in Training
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400 text-sm">Total Samples</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{dataset.samples.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-sm">Avg. Resolution</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{dataset.stats.imageResolution}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-sm">Avg. Caption</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{dataset.avgCaptionLen} tokens</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-sm">Versions</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{dataset.versions.length}</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="glass-card p-0">
        <div className="border-b border-slate-700/50">
          <nav className="flex">
            {(['overview', 'versions', 'splits', 'samples'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-violet-500 text-violet-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Dataset Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Modality</span>
                    <span className="text-slate-200">{dataset.modality}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Caption Length Range</span>
                    <span className="text-slate-200">{dataset.stats.captionLength}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Languages</span>
                    <span className="text-slate-200">{dataset.stats.languages.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Domains</span>
                    <div className="flex gap-1">
                      {dataset.stats.domains.map((d, i) => (
                        <span key={i} className="badge badge-slate text-xs">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Split Distribution</h3>
                <div className="space-y-4">
                  {dataset.splits.map((split, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">{split.name}</span>
                        <span className="text-slate-400">{split.samples.toLocaleString()} ({split.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${split.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Version History</h3>
              {dataset.versions.map((v, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="badge badge-violet">{v.version}</span>
                      <span className="font-medium text-slate-200">{v.samples.toLocaleString()} samples</span>
                    </div>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {v.date}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{v.changes}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'splits' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Data Splits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dataset.splits.map((split, idx) => (
                  <div key={idx} className="p-6 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                    <h4 className="text-lg font-semibold text-slate-200 mb-2">{split.name}</h4>
                    <p className="text-3xl font-bold text-violet-400 mb-1">{split.percentage}%</p>
                    <p className="text-slate-400 text-sm">{split.samples.toLocaleString()} samples</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Sample Browser</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 이미지 뷰어 */}
                <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-center relative">
                  <Image className="w-16 h-16 text-slate-600" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentSample(Math.max(0, currentSample - 1))}
                      className="p-2 bg-slate-900/80 rounded-lg hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-slate-400 px-3">
                      {currentSample + 1} / {sampleData.length}
                    </span>
                    <button 
                      onClick={() => setCurrentSample(Math.min(sampleData.length - 1, currentSample + 1))}
                      className="p-2 bg-slate-900/80 rounded-lg hover:bg-slate-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* 텍스트 뷰어 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Caption</h4>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <p className="text-slate-200 leading-relaxed">
                      {sampleData[currentSample]?.caption}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                    <span>Tokens: {sampleData[currentSample]?.caption.split(' ').length}</span>
                    <span>Language: English</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
