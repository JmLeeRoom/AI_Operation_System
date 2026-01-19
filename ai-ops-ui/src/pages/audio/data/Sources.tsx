import { 
  HardDrive,
  Cloud,
  Database,
  Radio,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Play,
  Volume2,
  Clock,
  FileAudio
} from 'lucide-react';

export function AudioDataSources() {
  const sources = [
    {
      id: 1,
      name: 'Internal Call Center',
      type: 's3',
      status: 'connected',
      config: { bucket: 'call-recordings', format: 'wav/mp3', sampleRate: '16kHz' },
      lastSync: '30 mins ago',
      files: 245000,
      totalHours: 1250,
      size: '890 GB',
    },
    {
      id: 2,
      name: 'Podcast Archive',
      type: 'minio',
      status: 'connected',
      config: { bucket: 'podcast-data', format: 'flac', sampleRate: '44.1kHz' },
      lastSync: '2 hours ago',
      files: 12400,
      totalHours: 680,
      size: '1.2 TB',
    },
    {
      id: 3,
      name: 'TTS Recording Studio',
      type: 'local',
      status: 'connected',
      config: { path: '/data/tts-studio', format: 'wav', sampleRate: '22.05kHz' },
      lastSync: '1 hour ago',
      files: 89000,
      totalHours: 320,
      size: '156 GB',
    },
    {
      id: 4,
      name: 'Music Library',
      type: 'database',
      status: 'connected',
      config: { connection: 'PostgreSQL', table: 'music_clips', format: 'mixed' },
      lastSync: '4 hours ago',
      files: 45000,
      totalHours: 200,
      size: '450 GB',
    },
    {
      id: 5,
      name: 'Live Stream (RTSP)',
      type: 'stream',
      status: 'disconnected',
      config: { protocol: 'RTSP', channels: 4, format: 'pcm' },
      lastSync: '2 days ago',
      files: 0,
      totalHours: 0,
      size: '-',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 's3': return <Cloud className="w-5 h-5" />;
      case 'minio': return <Cloud className="w-5 h-5" />;
      case 'local': return <HardDrive className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'stream': return <Radio className="w-5 h-5" />;
      default: return <FileAudio className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 's3': return 'from-amber-500 to-orange-500';
      case 'minio': return 'from-rose-500 to-pink-500';
      case 'local': return 'from-emerald-500 to-green-500';
      case 'database': return 'from-violet-500 to-purple-500';
      case 'stream': return 'from-cyan-500 to-blue-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audio Data Sources</h1>
          <p className="text-slate-400 mt-1">오디오 데이터 수집 소스 연결 및 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-sm text-slate-400">Connected Sources</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">391K</p>
          <p className="text-sm text-slate-400">Total Files</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">2,450h</p>
          <p className="text-sm text-slate-400">Total Duration</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">2.7 TB</p>
          <p className="text-sm text-slate-400">Total Size</p>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search sources..." 
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="btn-ghost">
          <RefreshCw className="w-4 h-4" />
          Sync All
        </button>
      </div>

      {/* 소스 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {sources.map((source, index) => (
          <div 
            key={source.id}
            className="glass-card p-5 hover:border-brand-500/30 transition-all cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(source.type)} flex items-center justify-center shadow-lg`}>
                  {getTypeIcon(source.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{source.name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{source.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {source.status === 'connected' ? (
                  <span className="badge badge-emerald">
                    <CheckCircle className="w-3 h-3" />
                    Connected
                  </span>
                ) : (
                  <span className="badge badge-rose">
                    <XCircle className="w-3 h-3" />
                    Disconnected
                  </span>
                )}
                <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Config Preview */}
            <div className="p-3 bg-slate-800/30 rounded-lg mb-4 text-xs font-mono text-slate-400">
              {Object.entries(source.config).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-slate-500">{key}:</span>
                  <span className="text-slate-300">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{source.files.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Files</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{source.totalHours}h</p>
                  <p className="text-xs text-slate-500">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{source.size}</p>
                  <p className="text-xs text-slate-500">Size</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {source.lastSync}
                </span>
                <button className="btn-ghost text-sm py-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Source Card */}
        <div className="glass-card p-5 border-dashed border-2 border-slate-600 hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">Add New Source</p>
            <p className="text-xs text-slate-500 mt-1">S3, MinIO, Local, DB, Stream</p>
          </div>
        </div>
      </div>
    </div>
  );
}
