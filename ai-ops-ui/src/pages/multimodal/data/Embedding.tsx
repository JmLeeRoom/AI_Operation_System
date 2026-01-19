import { 
  Sparkles,
  Play,
  RefreshCw,
  Search,
  Database,
  Image,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

export function Embedding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text2image' | 'image2text'>('text2image');

  const embeddingModels = [
    { name: 'CLIP-ViT-L/14', type: 'Contrastive', dims: 768, status: 'active' },
    { name: 'SigLIP-Large', type: 'Contrastive', dims: 1024, status: 'active' },
    { name: 'VLM-Encoder-v2', type: 'VLM', dims: 2048, status: 'building' },
  ];

  const indices = [
    { name: 'Image-Caption Index', vectors: 1200000, model: 'CLIP-ViT-L/14', status: 'ready', updated: '1시간 전' },
    { name: 'Video-Text Index', vectors: 45000, model: 'CLIP-ViT-L/14', status: 'ready', updated: '3시간 전' },
    { name: 'RAG Multimodal Index', vectors: 500000, model: 'SigLIP-Large', status: 'updating', updated: '진행 중' },
  ];

  const searchResults = [
    { id: 1, score: 0.95, caption: 'A golden retriever playing fetch in the park' },
    { id: 2, score: 0.89, caption: 'Dogs running on green grass field' },
    { id: 3, score: 0.85, caption: 'A happy puppy with a ball in its mouth' },
    { id: 4, score: 0.78, caption: 'Pet playing outdoors on sunny day' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            Embedding & Index
          </h1>
          <p className="text-slate-400 mt-1">CLIP/VLM 임베딩 및 멀티모달 RAG 인덱스</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Build New Index
        </button>
      </div>

      {/* 모델 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {embeddingModels.map((model, idx) => (
          <div key={idx} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-slate-200">{model.name}</span>
              <span className={`badge ${model.status === 'active' ? 'badge-emerald' : 'badge-cyan'}`}>
                {model.status === 'building' && <Clock className="w-3 h-3 mr-1" />}
                {model.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{model.type}</span>
              <span>{model.dims}d</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 인덱스 관리 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-violet-400" />
              Vector Indices
            </h2>
            <button className="btn-ghost text-sm">
              <RefreshCw className="w-4 h-4" />
              Sync
            </button>
          </div>
          <div className="space-y-3">
            {indices.map((index, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{index.name}</span>
                  <span className={`flex items-center gap-1 text-sm ${
                    index.status === 'ready' ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    {index.status === 'ready' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {index.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{index.vectors.toLocaleString()} vectors</span>
                  <span>{index.model}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Updated: {index.updated}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 검색 테스트 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Retrieval Test
          </h2>

          {/* 검색 모드 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSearchMode('text2image')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                searchMode === 'text2image'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <ArrowRight className="w-3 h-3" />
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSearchMode('image2text')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                searchMode === 'image2text'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
              }`}
            >
              <Image className="w-4 h-4" />
              <ArrowRight className="w-3 h-3" />
              <FileText className="w-4 h-4" />
            </button>
          </div>

          {/* 검색 입력 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder={searchMode === 'text2image' ? 'Enter text query...' : 'Upload image...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1"
            />
            <button className="btn-primary">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* 검색 결과 */}
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Top Results</p>
            {searchResults.map((result) => (
              <div 
                key={result.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-700 rounded shrink-0 flex items-center justify-center">
                  <Image className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{result.caption}</p>
                </div>
                <span className="text-sm font-mono text-emerald-400">{result.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메트릭스 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Retrieval Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <p className="text-2xl font-bold text-violet-400">0.89</p>
            <p className="text-sm text-slate-500">R@1</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <p className="text-2xl font-bold text-cyan-400">0.95</p>
            <p className="text-sm text-slate-500">R@5</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <p className="text-2xl font-bold text-emerald-400">0.98</p>
            <p className="text-sm text-slate-500">R@10</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <p className="text-2xl font-bold text-amber-400">15ms</p>
            <p className="text-sm text-slate-500">Avg Latency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
