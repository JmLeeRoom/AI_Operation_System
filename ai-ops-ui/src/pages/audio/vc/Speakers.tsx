import { 
  Users,
  Plus,
  Search,
  Play,
  Eye,
  Lock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Volume2,
  AudioWaveform,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

export function VCSpeakers() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<number>(1);

  const speakers = [
    { 
      id: 1, 
      name: 'Speaker_A', 
      gender: 'Male', 
      refClips: 12,
      quality: 'excellent',
      embedding: true,
      authorized: true,
      dataHours: 2.5,
      lastUsed: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Speaker_B', 
      gender: 'Female', 
      refClips: 8,
      quality: 'good',
      embedding: true,
      authorized: true,
      dataHours: 1.8,
      lastUsed: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Speaker_C', 
      gender: 'Male', 
      refClips: 5,
      quality: 'fair',
      embedding: false,
      authorized: true,
      dataHours: 0.8,
      lastUsed: '3 days ago'
    },
    { 
      id: 4, 
      name: 'Guest_Speaker', 
      gender: 'Female', 
      refClips: 3,
      quality: 'good',
      embedding: true,
      authorized: false,
      dataHours: 0.5,
      lastUsed: '1 week ago'
    },
  ];

  const referenceClips = [
    { id: 1, name: 'ref_001.wav', duration: '5.2s', quality: 'excellent', text: '안녕하세요, 반갑습니다.' },
    { id: 2, name: 'ref_002.wav', duration: '4.8s', quality: 'excellent', text: '오늘 날씨가 정말 좋네요.' },
    { id: 3, name: 'ref_003.wav', duration: '6.1s', quality: 'good', text: '주문하신 상품이 발송되었습니다.' },
  ];

  const similarSpeakers = [
    { name: 'Speaker_B', similarity: 0.78 },
    { name: 'Speaker_E', similarity: 0.65 },
    { name: 'Speaker_F', similarity: 0.52 },
  ];

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
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Speaker Profiles
          </h1>
          <p className="text-slate-400 mt-1">음성 변환용 화자 프로필 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Speaker
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">{speakers.length}</p>
          <p className="text-sm text-slate-400">Total Speakers</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">{speakers.filter(s => s.authorized).length}</p>
          <p className="text-sm text-slate-400">Authorized</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-cyan-400">{speakers.filter(s => s.embedding).length}</p>
          <p className="text-sm text-slate-400">With Embedding</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">5.6h</p>
          <p className="text-sm text-slate-400">Total Reference Data</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Speaker List */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Speakers</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="input-field pl-10 py-2 text-sm w-32"
              />
            </div>
          </div>

          <div className="space-y-2">
            {speakers.map((speaker) => (
              <div 
                key={speaker.id}
                onClick={() => setSelectedSpeaker(speaker.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedSpeaker === speaker.id 
                    ? 'bg-brand-500/20 border border-brand-500/50' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      speaker.gender === 'Male' ? 'bg-cyan-500/20' : 'bg-rose-500/20'
                    }`}>
                      <span className={`text-sm font-bold ${
                        speaker.gender === 'Male' ? 'text-cyan-400' : 'text-rose-400'
                      }`}>
                        {speaker.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{speaker.name}</p>
                      <p className="text-xs text-slate-500">{speaker.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!speaker.authorized && (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    {speaker.embedding && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{speaker.refClips} clips</span>
                  <span>{speaker.dataHours}h</span>
                  <span className={`badge ${getQualityBadge(speaker.quality)} text-xs`}>{speaker.quality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speaker Detail */}
        <div className="col-span-2 space-y-6">
          {/* Speaker Info */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-400">A</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Speaker_A</h2>
                  <p className="text-slate-400">Male • 12 reference clips • 2.5 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald">Authorized</span>
                <span className="badge badge-cyan">Embedding Ready</span>
              </div>
            </div>

            {/* Security Settings */}
            <div className="p-4 bg-slate-800/30 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security & Permissions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-sm text-slate-300">Allow voice conversion</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-brand-500" />
                  <span className="text-sm text-slate-300">Add watermark</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-sm text-slate-300">Internal use only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-brand-500" />
                  <span className="text-sm text-slate-300">Require approval</span>
                </label>
              </div>
            </div>

            {/* Reference Clips */}
            <h3 className="text-sm font-medium text-slate-400 mb-3">Reference Clips</h3>
            <div className="space-y-2">
              {referenceClips.map((clip) => (
                <div key={clip.id} className="p-3 bg-slate-800/30 rounded-lg flex items-center gap-3">
                  <button className="btn-ghost p-2">
                    <Play className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-700/50 rounded flex items-center px-2">
                      <div className="flex items-center gap-0.5 h-4 flex-1">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div 
                            key={i}
                            className="w-0.5 bg-brand-400 rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{clip.duration}</p>
                    <span className={`badge ${getQualityBadge(clip.quality)} text-xs`}>{clip.quality}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button className="btn-secondary">
                <Plus className="w-4 h-4" />
                Add Clips
              </button>
              <button className="btn-ghost">
                <RefreshCw className="w-4 h-4" />
                Re-extract Embedding
              </button>
            </div>
          </div>

          {/* Similar Speakers */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Similar Speakers</h3>
            <div className="space-y-2">
              {similarSpeakers.map((speaker, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-200">{speaker.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-500"
                        style={{ width: `${speaker.similarity * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{(speaker.similarity * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
