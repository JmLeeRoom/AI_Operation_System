import { 
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Languages,
  Settings
} from 'lucide-react';
import { useState } from 'react';

export function ASRTranscripts() {
  const [selectedTranscript, setSelectedTranscript] = useState<number>(1);

  const transcripts = [
    { 
      id: 1, 
      segment: 'call_001_seg_01', 
      original: '안녕하세요 고객센터입니다',
      normalized: '안녕하세요 고객 센터 입니다',
      language: 'ko',
      duration: '3.2s',
      status: 'verified',
      confidence: 0.95
    },
    { 
      id: 2, 
      segment: 'call_001_seg_02', 
      original: '주문번호 123-456 확인해주세요',
      normalized: '주문 번호 일이삼 사오육 확인 해 주세요',
      language: 'ko',
      duration: '4.1s',
      status: 'normalized',
      confidence: 0.89
    },
    { 
      id: 3, 
      segment: 'podcast_042_seg_15', 
      original: 'The temperature is around 25°C today',
      normalized: 'the temperature is around twenty five degrees celsius today',
      language: 'en',
      duration: '2.8s',
      status: 'verified',
      confidence: 0.98
    },
    { 
      id: 4, 
      segment: 'meeting_003_seg_08', 
      original: '회의 시간이 2시에서 3시로 변경됩니다',
      normalized: '회의 시간 이 두 시 에서 세 시 로 변경 됩니다',
      language: 'ko',
      duration: '5.5s',
      status: 'review_needed',
      confidence: 0.72
    },
  ];

  const normalizationRules = [
    { name: 'Numbers to words', desc: '123 → 일이삼', enabled: true },
    { name: 'Symbols to words', desc: '% → 퍼센트', enabled: true },
    { name: 'Abbreviations', desc: 'kg → 킬로그램', enabled: true },
    { name: 'Date/Time format', desc: '2024년 1월 15일', enabled: true },
    { name: 'Currency', desc: '$100 → 백 달러', enabled: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return 'badge-emerald';
      case 'normalized': return 'badge-cyan';
      case 'review_needed': return 'badge-amber';
      default: return 'badge-slate';
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'text-emerald-400';
    if (conf >= 0.7) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transcripts Management</h1>
          <p className="text-slate-400 mt-1">ASR 전사 데이터 정규화 및 검수</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Import Transcripts
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">125,400</p>
          <p className="text-sm text-slate-400">Total Segments</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">98,200</p>
          <p className="text-sm text-slate-400">Verified</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-cyan-400">24,500</p>
          <p className="text-sm text-slate-400">Normalized</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-amber-400">2,700</p>
          <p className="text-sm text-slate-400">Review Needed</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽: Transcript List */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Transcript List</h2>
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
            {transcripts.map((tr) => (
              <div 
                key={tr.id}
                onClick={() => setSelectedTranscript(tr.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTranscript === tr.id 
                    ? 'bg-brand-500/20 border border-brand-500/50' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-slate-400">{tr.segment}</span>
                      <span className={`badge ${getStatusBadge(tr.status)} capitalize`}>
                        {tr.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono ${getConfidenceColor(tr.confidence)}`}>
                      {(tr.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-slate-500">Original: </span>
                    <span className="text-sm text-slate-200">{tr.original}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Normalized: </span>
                    <span className="text-sm text-emerald-300">{tr.normalized}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="badge badge-slate text-xs">{tr.language.toUpperCase()}</span>
                    <span>{tr.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost text-sm py-1.5">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="btn-ghost text-sm py-1.5">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: Normalization Rules */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-400" />
              Normalization Rules
            </h2>

            <div className="space-y-3">
              {normalizationRules.map((rule, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                >
                  <div>
                    <p className="text-sm text-slate-200">{rule.name}</p>
                    <p className="text-xs text-slate-500">{rule.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={rule.enabled}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
              ))}
            </div>

            <button className="btn-ghost w-full mt-4">
              <Plus className="w-4 h-4" />
              Add Custom Rule
            </button>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Languages className="w-5 h-5 text-cyan-400" />
              Language Detection
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-200">Auto-detect language</span>
                <span className="badge badge-emerald">ON</span>
              </div>
              <div className="text-sm text-slate-400">
                <p className="mb-2">Detected languages:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-cyan">Korean (78%)</span>
                  <span className="badge badge-violet">English (18%)</span>
                  <span className="badge badge-slate">Japanese (4%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-center">
                <RefreshCw className="w-4 h-4" />
                Re-normalize All
              </button>
              <button className="btn-ghost w-full justify-center">
                <CheckCircle className="w-4 h-4" />
                Verify Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
