import { 
  Database,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  RefreshCw,
  Volume2,
  AudioWaveform,
  User
} from 'lucide-react';
import { useState } from 'react';

export function TTSDataset() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const speakers = [
    { id: 1, name: 'Speaker_001', gender: 'Female', hours: 12.5, samples: 4500, quality: 'excellent' },
    { id: 2, name: 'Speaker_002', gender: 'Male', hours: 8.2, samples: 3200, quality: 'good' },
    { id: 3, name: 'Speaker_003', gender: 'Female', hours: 15.8, samples: 5600, quality: 'excellent' },
    { id: 4, name: 'Speaker_004', gender: 'Male', hours: 6.5, samples: 2100, quality: 'fair' },
  ];

  const dataPairs = [
    { 
      id: 1, 
      text: '안녕하세요, 오늘 날씨가 정말 좋네요.', 
      audio: 'pair_001.wav',
      speaker: 'Speaker_001',
      duration: '2.3s',
      status: 'verified',
      issues: []
    },
    { 
      id: 2, 
      text: '내일 오후 3시에 회의가 있습니다.', 
      audio: 'pair_002.wav',
      speaker: 'Speaker_001',
      duration: '2.8s',
      status: 'verified',
      issues: []
    },
    { 
      id: 3, 
      text: '죄송합니다, 다시 한번 말씀해 주시겠어요?', 
      audio: 'pair_003.wav',
      speaker: 'Speaker_002',
      duration: '3.1s',
      status: 'warning',
      issues: ['speed_mismatch']
    },
    { 
      id: 4, 
      text: '감사합니다. 좋은 하루 되세요!', 
      audio: 'pair_004.wav',
      speaker: 'Speaker_003',
      duration: '2.1s',
      status: 'verified',
      issues: []
    },
    { 
      id: 5, 
      text: '주문하신 상품이 발송되었습니다.', 
      audio: 'pair_005.wav',
      speaker: 'Speaker_002',
      duration: '2.5s',
      status: 'error',
      issues: ['text_mismatch', 'low_quality']
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'badge-emerald';
      case 'good': return 'badge-cyan';
      case 'fair': return 'badge-amber';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">TTS Dataset Builder</h1>
          <p className="text-slate-400 mt-1">(Text, Audio) 페어 데이터 관리</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Validate All
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Import Pairs
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-sm text-slate-400">Speakers</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">15,400</p>
          <p className="text-sm text-slate-400">Total Pairs</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">43h</p>
          <p className="text-sm text-slate-400">Total Duration</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">14,850</p>
          <p className="text-sm text-slate-400">Verified</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-amber-400">550</p>
          <p className="text-sm text-slate-400">Need Review</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Speaker List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            Speakers
          </h2>

          <div className="space-y-3">
            {speakers.map((speaker) => (
              <div 
                key={speaker.id}
                className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{speaker.name}</span>
                  <span className={`badge ${getQualityBadge(speaker.quality)} text-xs capitalize`}>
                    {speaker.quality}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{speaker.gender}</span>
                  <span>{speaker.hours}h</span>
                  <span>{speaker.samples.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500"
                    style={{ width: `${(speaker.hours / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="btn-ghost w-full mt-4">
            <Plus className="w-4 h-4" />
            Add Speaker
          </button>
        </div>

        {/* Data Pairs */}
        <div className="col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Text-Audio Pairs
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="input-field pl-10 py-2 text-sm w-48"
                />
              </div>
              <button className="btn-ghost">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {dataPairs.map((pair) => (
              <div 
                key={pair.id}
                className={`p-4 rounded-lg transition-all ${
                  pair.status === 'error' 
                    ? 'bg-rose-500/10 border border-rose-500/30' 
                    : pair.status === 'warning'
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-slate-800/30 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Play Button */}
                    <button 
                      className="btn-ghost p-2"
                      onClick={() => setIsPlaying(isPlaying === pair.id ? null : pair.id)}
                    >
                      {isPlaying === pair.id ? (
                        <Pause className="w-5 h-5 text-brand-400" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <p className="text-slate-200">{pair.text}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{pair.speaker}</span>
                        <span>•</span>
                        <span>{pair.duration}</span>
                        <span>•</span>
                        <span className="font-mono">{pair.audio}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(pair.status)}
                    <button className="btn-ghost text-sm py-1.5">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Waveform Preview */}
                <div className="h-8 bg-slate-800/50 rounded flex items-center px-2">
                  <div className="flex items-center gap-0.5 h-6 flex-1">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-0.5 rounded-full ${isPlaying === pair.id ? 'bg-brand-400' : 'bg-slate-600'}`}
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Issues */}
                {pair.issues.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pair.issues.map((issue, idx) => (
                      <span key={idx} className="badge badge-rose text-xs">
                        {issue.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Filter Options */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                <input type="checkbox" className="rounded text-brand-500" />
                Show only issues
              </label>
              <select className="input-field py-1.5 text-sm w-32">
                <option>All speakers</option>
                {speakers.map(s => <option key={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm">Reject Selected</button>
              <button className="btn-secondary text-sm">Verify Selected</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
