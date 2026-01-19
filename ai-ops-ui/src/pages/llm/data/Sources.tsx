import { 
  Globe,
  Database as DatabaseIcon,
  FileText,
  MessageSquare,
  HardDrive,
  Plus,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Eye
} from 'lucide-react';

export function LLMDataSources() {
  const sources = [
    {
      id: 1,
      name: 'Web Crawler - Tech Blogs',
      type: 'web',
      status: 'connected',
      config: { domains: ['*.medium.com', '*.dev.to'], schedule: 'daily' },
      lastSync: '4 hours ago',
      documents: 125400,
      size: '2.3 GB',
    },
    {
      id: 2,
      name: 'Internal Wiki (Confluence)',
      type: 'docs',
      status: 'connected',
      config: { workspace: 'engineering', spaces: ['ML', 'Data'] },
      lastSync: '1 hour ago',
      documents: 8920,
      size: '450 MB',
    },
    {
      id: 3,
      name: 'PostgreSQL - Chat Logs',
      type: 'database',
      status: 'connected',
      config: { table: 'chat_messages', dateRange: 'last 90 days' },
      lastSync: '30 mins ago',
      documents: 1250000,
      size: '8.7 GB',
    },
    {
      id: 4,
      name: 'Customer Support Tickets',
      type: 'logs',
      status: 'connected',
      config: { source: 'zendesk', filter: 'resolved' },
      lastSync: '2 hours ago',
      documents: 45600,
      size: '890 MB',
    },
    {
      id: 5,
      name: 'Google Drive - Research Papers',
      type: 'files',
      status: 'disconnected',
      config: { folder: '/ML Research', formats: ['pdf', 'docx'] },
      lastSync: '3 days ago',
      documents: 2340,
      size: '12 GB',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return <Globe className="w-5 h-5" />;
      case 'docs': return <FileText className="w-5 h-5" />;
      case 'database': return <DatabaseIcon className="w-5 h-5" />;
      case 'logs': return <MessageSquare className="w-5 h-5" />;
      case 'files': return <HardDrive className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'web': return 'from-blue-500 to-cyan-500';
      case 'docs': return 'from-violet-500 to-purple-500';
      case 'database': return 'from-emerald-500 to-green-500';
      case 'logs': return 'from-amber-500 to-orange-500';
      case 'files': return 'from-rose-500 to-pink-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Text Data Sources</h1>
          <p className="text-slate-400 mt-1">텍스트 데이터 수집 소스 연결 및 관리</p>
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
          <p className="text-2xl font-bold text-white">1.43M</p>
          <p className="text-sm text-slate-400">Total Documents</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">24.3 GB</p>
          <p className="text-sm text-slate-400">Raw Data Size</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-sm text-slate-400">Active Syncs</p>
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
                  <span className="text-slate-300">{Array.isArray(value) ? value.join(', ') : value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{source.documents.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Documents</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{source.size}</p>
                  <p className="text-xs text-slate-500">Size</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Last sync: {source.lastSync}</span>
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
            <p className="text-xs text-slate-500 mt-1">Web, DB, Files, Logs, API</p>
          </div>
        </div>
      </div>
    </div>
  );
}
