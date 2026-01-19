import { 
  HardDrive, 
  Cloud, 
  Database as DatabaseIcon,
  Video,
  FolderOpen,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';

export function CVDataSources() {
  const sources = [
    {
      id: 1,
      name: 'Production S3 Bucket',
      type: 's3',
      status: 'connected',
      path: 's3://cv-data-prod/images/',
      lastSync: '5 mins ago',
      fileCount: 124500,
      size: '256 GB',
      config: { region: 'ap-northeast-2', pattern: '*.jpg,*.png' }
    },
    {
      id: 2,
      name: 'MinIO Development',
      type: 'minio',
      status: 'connected',
      path: 'minio://dev-bucket/train/',
      lastSync: '1 hour ago',
      fileCount: 45200,
      size: '89 GB',
      config: { endpoint: 'minio.internal:9000', pattern: '**/*.jpg' }
    },
    {
      id: 3,
      name: 'Factory Camera Stream',
      type: 'rtsp',
      status: 'connected',
      path: 'rtsp://192.168.1.100:554/stream1',
      lastSync: 'Live',
      fileCount: null,
      size: 'Streaming',
      config: { fps: 30, resolution: '1920x1080' }
    },
    {
      id: 4,
      name: 'Local NAS Storage',
      type: 'local',
      status: 'disconnected',
      path: '/mnt/nas/cv-data/',
      lastSync: '3 days ago',
      fileCount: 78900,
      size: '145 GB',
      config: { mount: '/mnt/nas', exclude: '*.tmp' }
    },
    {
      id: 5,
      name: 'PostgreSQL Metadata',
      type: 'database',
      status: 'connected',
      path: 'postgresql://db.internal/cv_meta',
      lastSync: '10 mins ago',
      fileCount: 250000,
      size: '12 GB',
      config: { table: 'image_metadata', idColumn: 'image_id' }
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 's3':
      case 'minio':
        return <Cloud className="w-5 h-5" />;
      case 'rtsp':
        return <Video className="w-5 h-5" />;
      case 'local':
        return <FolderOpen className="w-5 h-5" />;
      case 'database':
        return <DatabaseIcon className="w-5 h-5" />;
      default:
        return <HardDrive className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 's3': return 'from-orange-500 to-amber-500';
      case 'minio': return 'from-rose-500 to-pink-500';
      case 'rtsp': return 'from-cyan-500 to-blue-500';
      case 'local': return 'from-emerald-500 to-green-500';
      case 'database': return 'from-violet-500 to-purple-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Sources</h1>
          <p className="text-slate-400 mt-1">이미지/비디오 데이터 소스 연결 및 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search data sources..." 
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
                  <p className="text-sm text-slate-400 font-mono">{source.type.toUpperCase()}</p>
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

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Path:</span>
                <code className="text-slate-300 bg-slate-800/50 px-2 py-0.5 rounded text-xs truncate max-w-[300px]">
                  {source.path}
                </code>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">Last Sync:</span>
                <span className="text-slate-300">{source.lastSync}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-4">
                {source.fileCount && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{source.fileCount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Files</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{source.size}</p>
                  <p className="text-xs text-slate-500">Size</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost text-sm py-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync
                </button>
                <button className="btn-ghost text-sm py-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  Config
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
            <p className="text-slate-400 font-medium">Add New Data Source</p>
            <p className="text-xs text-slate-500 mt-1">S3, MinIO, Local, RTSP, Database</p>
          </div>
        </div>
      </div>
    </div>
  );
}
