import { 
  Plus, 
  Image, 
  Video, 
  FileAudio, 
  FileText, 
  File,
  Cloud,
  HardDrive,
  Database,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreVertical
} from 'lucide-react';

export function Sources() {
  const sourceTypes = [
    { 
      icon: Image, 
      name: 'Images', 
      color: 'violet',
      description: '이미지 파일 (JPG, PNG, WebP)',
      connected: 3,
      samples: '1.2M'
    },
    { 
      icon: Video, 
      name: 'Videos', 
      color: 'cyan',
      description: '비디오 파일 (MP4, AVI, MOV)',
      connected: 2,
      samples: '45K'
    },
    { 
      icon: FileAudio, 
      name: 'Audio', 
      color: 'emerald',
      description: '오디오 파일 (WAV, MP3, FLAC)',
      connected: 2,
      samples: '320K'
    },
    { 
      icon: FileText, 
      name: 'Text', 
      color: 'amber',
      description: '텍스트 파일 (TXT, JSON, CSV)',
      connected: 4,
      samples: '2.5M'
    },
    { 
      icon: File, 
      name: 'Documents', 
      color: 'rose',
      description: '문서 파일 (PDF, DOCX)',
      connected: 1,
      samples: '15K'
    },
  ];

  const connectedSources = [
    { 
      id: 'src-001',
      name: 'S3 Image Bucket',
      type: 'Images',
      provider: 'AWS S3',
      status: 'active',
      lastSync: '5분 전',
      samples: '850K',
      rules: ['*.jpg', '*.png', 'resolution > 256']
    },
    { 
      id: 'src-002',
      name: 'Video Dataset Storage',
      type: 'Videos',
      provider: 'GCS',
      status: 'active',
      lastSync: '1시간 전',
      samples: '32K',
      rules: ['*.mp4', 'duration < 300s']
    },
    { 
      id: 'src-003',
      name: 'Caption Database',
      type: 'Text',
      provider: 'PostgreSQL',
      status: 'syncing',
      lastSync: '진행 중',
      samples: '1.8M',
      rules: ['captions table', 'lang = en,ko']
    },
    { 
      id: 'src-004',
      name: 'Local Audio Archive',
      type: 'Audio',
      provider: 'NFS Mount',
      status: 'warning',
      lastSync: '3일 전',
      samples: '280K',
      rules: ['*.wav', 'sr = 16000']
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Data Sources</h1>
          <p className="text-slate-400 mt-1">멀티모달 데이터 소스 연결 및 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      </div>

      {/* 소스 타입 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sourceTypes.map((type, idx) => {
          const Icon = type.icon;
          return (
            <div 
              key={idx} 
              className="glass-card p-4 cursor-pointer hover:border-violet-500/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-${type.color}-500/20 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${type.color}-400`} />
              </div>
              <h3 className="font-medium text-slate-200 mb-1">{type.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{type.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{type.connected} sources</span>
                <span className="text-slate-500">{type.samples}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 연결된 소스 목록 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Connected Sources</h2>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-sm">
              <RefreshCw className="w-4 h-4" />
              Sync All
            </button>
            <button className="btn-secondary text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Source Name</th>
                <th>Type</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Samples</th>
                <th>Ingest Rules</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {connectedSources.map((source) => (
                <tr key={source.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {source.provider === 'AWS S3' && <Cloud className="w-4 h-4 text-amber-400" />}
                      {source.provider === 'GCS' && <Cloud className="w-4 h-4 text-cyan-400" />}
                      {source.provider === 'PostgreSQL' && <Database className="w-4 h-4 text-violet-400" />}
                      {source.provider === 'NFS Mount' && <HardDrive className="w-4 h-4 text-slate-400" />}
                      <span className="font-medium text-slate-200">{source.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-slate">{source.type}</span>
                  </td>
                  <td className="text-slate-400">{source.provider}</td>
                  <td>
                    <span className={`flex items-center gap-1.5 ${
                      source.status === 'active' ? 'text-emerald-400' :
                      source.status === 'syncing' ? 'text-cyan-400' : 'text-amber-400'
                    }`}>
                      {source.status === 'active' && <CheckCircle className="w-4 h-4" />}
                      {source.status === 'syncing' && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {source.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                      {source.status}
                    </span>
                  </td>
                  <td className="text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {source.lastSync}
                    </span>
                  </td>
                  <td className="text-slate-300">{source.samples}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {source.rules.slice(0, 2).map((rule, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                          {rule}
                        </span>
                      ))}
                      {source.rules.length > 2 && (
                        <span className="text-xs text-slate-500">+{source.rules.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button className="p-1 hover:bg-slate-700 rounded">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 샘플 미리보기 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Sample Preview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="aspect-square rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center group hover:border-violet-500/50 transition-all cursor-pointer"
            >
              <Image className="w-8 h-8 text-slate-600 group-hover:text-violet-400 transition-colors" />
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-3 text-center">
          소스를 선택하면 샘플 미리보기가 표시됩니다
        </p>
      </div>
    </div>
  );
}
