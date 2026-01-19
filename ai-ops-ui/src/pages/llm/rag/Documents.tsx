import { 
  FileText,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Folder,
  File,
  Eye,
  Trash2,
  MoreVertical,
  Upload,
  Link
} from 'lucide-react';

export function RAGDocuments() {
  const documents = [
    { id: 1, name: 'API Documentation v2', type: 'markdown', chunks: 234, status: 'indexed', source: 'confluence', updatedAt: '2 hours ago', size: '1.2 MB' },
    { id: 2, name: 'Company Policies 2024', type: 'pdf', chunks: 89, status: 'indexed', source: 'google_drive', updatedAt: '1 day ago', size: '4.5 MB' },
    { id: 3, name: 'Product FAQ', type: 'notion', chunks: 156, status: 'processing', source: 'notion', updatedAt: '30 mins ago', size: '890 KB' },
    { id: 4, name: 'Technical Blog Posts', type: 'web', chunks: 478, status: 'indexed', source: 'web_crawl', updatedAt: '6 hours ago', size: '12 MB' },
    { id: 5, name: 'Legal Documents', type: 'pdf', chunks: 0, status: 'failed', source: 'upload', updatedAt: '2 days ago', size: '8.2 MB' },
    { id: 6, name: 'Internal Wiki', type: 'html', chunks: 567, status: 'indexed', source: 'confluence', updatedAt: '1 hour ago', size: '23 MB' },
  ];

  const parserConfigs = [
    { name: 'PDF Parser', description: 'PyMuPDF + OCR fallback', status: 'active' },
    { name: 'HTML Parser', description: 'BeautifulSoup + boilerplate removal', status: 'active' },
    { name: 'Markdown Parser', description: 'Preserve code blocks', status: 'active' },
    { name: 'Code Parser', description: 'Tree-sitter syntax aware', status: 'active' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'processing': return <Clock className="w-4 h-4 text-cyan-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'indexed': return 'badge-emerald';
      case 'processing': return 'badge-cyan';
      case 'failed': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'markdown': return '📝';
      case 'html': return '🌐';
      case 'web': return '🔗';
      case 'notion': return '📋';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">RAG Documents</h1>
          <p className="text-slate-400 mt-1">문서 수집, 파싱 및 버전 관리</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Link className="w-4 h-4" />
            Connect Source
          </button>
          <button className="btn-primary">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">6</p>
          <p className="text-sm text-slate-400">Document Sets</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">1,524</p>
          <p className="text-sm text-slate-400">Total Chunks</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">49.8 MB</p>
          <p className="text-sm text-slate-400">Total Size</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">5</p>
          <p className="text-sm text-slate-400">Indexed</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 문서 목록 */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Documents</h2>
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

          <div className="overflow-hidden rounded-lg border border-slate-700/50">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Source</th>
                  <th>Chunks</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="cursor-pointer">
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(doc.type)}</span>
                        <span className="font-medium text-slate-200">{doc.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-400 capitalize">{doc.source.replace('_', ' ')}</td>
                    <td className="font-mono text-slate-300">{doc.chunks}</td>
                    <td className="text-slate-400">{doc.size}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(doc.status)} capitalize`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </span>
                    </td>
                    <td className="text-slate-500 text-sm">{doc.updatedAt}</td>
                    <td>
                      <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parser Config */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Parser Configs</h2>
            <button className="btn-ghost text-sm">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {parserConfigs.map((parser, index) => (
              <div 
                key={index}
                className="p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-200">{parser.name}</span>
                  <span className="badge badge-emerald text-xs">{parser.status}</span>
                </div>
                <p className="text-xs text-slate-500">{parser.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-center">
                <RefreshCw className="w-4 h-4" />
                Re-process All
              </button>
              <button className="btn-ghost w-full justify-center">
                <Eye className="w-4 h-4" />
                View Chunk Samples
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
