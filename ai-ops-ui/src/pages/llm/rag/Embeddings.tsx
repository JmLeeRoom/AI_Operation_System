import { 
  Database,
  Cpu,
  Play,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Zap,
  HardDrive
} from 'lucide-react';

export function RAGEmbeddings() {
  const embeddingModels = [
    { name: 'text-embedding-3-small', provider: 'OpenAI', dims: 1536, selected: true },
    { name: 'text-embedding-3-large', provider: 'OpenAI', dims: 3072, selected: false },
    { name: 'bge-large-en-v1.5', provider: 'BAAI', dims: 1024, selected: false },
    { name: 'multilingual-e5-large', provider: 'Intfloat', dims: 1024, selected: false },
  ];

  const indexes = [
    { 
      id: 1, 
      name: 'main-knowledge-base', 
      status: 'ready', 
      vectors: 125400,
      lastBuild: '2 hours ago',
      buildTime: '12m 34s',
      indexType: 'HNSW',
      size: '1.2 GB'
    },
    { 
      id: 2, 
      name: 'product-docs', 
      status: 'building', 
      vectors: 45600,
      lastBuild: 'In progress',
      buildTime: '-',
      indexType: 'HNSW',
      size: '420 MB'
    },
    { 
      id: 3, 
      name: 'code-snippets', 
      status: 'ready', 
      vectors: 89200,
      lastBuild: '1 day ago',
      buildTime: '8m 12s',
      indexType: 'IVF',
      size: '890 MB'
    },
  ];

  const retrievalMetrics = [
    { metric: 'Recall@5', value: 0.92, benchmark: 0.89 },
    { metric: 'Recall@10', value: 0.96, benchmark: 0.93 },
    { metric: 'MRR', value: 0.87, benchmark: 0.84 },
    { metric: 'NDCG@10', value: 0.89, benchmark: 0.86 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'building': return <Clock className="w-4 h-4 text-cyan-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return 'badge-emerald';
      case 'building': return 'badge-cyan';
      case 'failed': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Embeddings & Indexes</h1>
          <p className="text-slate-400 mt-1">벡터 임베딩 모델 및 인덱스 관리</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Rebuild All
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Create Index
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-sm text-slate-400">Active Indexes</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">260.2K</p>
          <p className="text-sm text-slate-400">Total Vectors</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">2.5 GB</p>
          <p className="text-sm text-slate-400">Index Size</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">92%</p>
          <p className="text-sm text-slate-400">Recall@5</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 임베딩 모델 선택 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            Embedding Model
          </h2>

          <div className="space-y-3">
            {embeddingModels.map((model, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  model.selected 
                    ? 'border-brand-500 bg-brand-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{model.name}</span>
                  {model.selected && (
                    <CheckCircle className="w-4 h-4 text-brand-400" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{model.provider}</span>
                  <span>•</span>
                  <span>{model.dims} dims</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인덱스 목록 */}
        <div className="col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Vector Indexes
          </h2>

          <div className="overflow-hidden rounded-lg border border-slate-700/50">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Index Name</th>
                  <th>Type</th>
                  <th>Vectors</th>
                  <th>Size</th>
                  <th>Last Build</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {indexes.map((index) => (
                  <tr key={index.id} className="cursor-pointer">
                    <td className="font-medium text-slate-200">{index.name}</td>
                    <td>
                      <span className="badge badge-slate">{index.indexType}</span>
                    </td>
                    <td className="font-mono text-slate-300">{index.vectors.toLocaleString()}</td>
                    <td className="text-slate-400">{index.size}</td>
                    <td className="text-slate-500 text-sm">
                      {index.lastBuild}
                      {index.buildTime !== '-' && (
                        <span className="text-slate-600 ml-1">({index.buildTime})</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(index.status)} capitalize`}>
                        {getStatusIcon(index.status)}
                        {index.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Retrieval Quality */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Retrieval Quality Metrics
          </h2>
          <button className="btn-ghost text-sm">
            Run Evaluation <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {retrievalMetrics.map((item, index) => (
            <div 
              key={index}
              className="p-4 bg-slate-800/30 rounded-lg text-center"
            >
              <p className="text-sm text-slate-400 mb-2">{item.metric}</p>
              <p className="text-3xl font-bold text-white">{(item.value * 100).toFixed(1)}%</p>
              <p className={`text-xs mt-1 ${item.value > item.benchmark ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.value > item.benchmark ? '↑' : '↓'} vs benchmark ({(item.benchmark * 100).toFixed(0)}%)
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Index Settings</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Distance Metric:</span>
              <span className="text-slate-200 ml-2">Cosine</span>
            </div>
            <div>
              <span className="text-slate-500">HNSW M:</span>
              <span className="text-slate-200 ml-2">16</span>
            </div>
            <div>
              <span className="text-slate-500">EF Construction:</span>
              <span className="text-slate-200 ml-2">100</span>
            </div>
            <div>
              <span className="text-slate-500">EF Search:</span>
              <span className="text-slate-200 ml-2">50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
