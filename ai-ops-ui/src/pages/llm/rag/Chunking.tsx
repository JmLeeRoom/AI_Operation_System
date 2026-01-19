import { 
  Layers,
  Settings,
  Save,
  Play,
  Eye,
  AlertTriangle,
  FileText,
  Hash,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

export function RAGChunking() {
  const [chunkSize, setChunkSize] = useState(512);
  const [overlap, setOverlap] = useState(50);

  const sampleChunks = [
    {
      id: 1,
      content: "Machine learning is a subset of artificial intelligence (AI) that enables systems to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.",
      tokens: 48,
      metadata: { source: 'api_docs', section: 'Introduction', page: 1 }
    },
    {
      id: 2,
      content: "The primary goal of machine learning is to allow computers to learn automatically without human intervention. This is achieved through algorithms that iteratively learn from data, allowing computers to find hidden insights without being explicitly programmed where to look.",
      tokens: 47,
      metadata: { source: 'api_docs', section: 'Introduction', page: 1 }
    },
    {
      id: 3,
      content: "Types of Machine Learning:\n1. Supervised Learning - Learning with labeled data\n2. Unsupervised Learning - Finding patterns in unlabeled data\n3. Reinforcement Learning - Learning through trial and error",
      tokens: 42,
      metadata: { source: 'api_docs', section: 'Types', page: 2 }
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Chunking Configuration</h1>
          <p className="text-slate-400 mt-1">문서 청킹 규칙 및 메타데이터 설정</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save & Apply
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 설정 */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-400" />
              Chunking Strategy
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Strategy</label>
                <select className="input-field">
                  <option>Fixed Size (Token-based)</option>
                  <option>Semantic (Sentence-based)</option>
                  <option>Recursive (Hierarchical)</option>
                  <option>Document Structure (Headers)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-400">Chunk Size (tokens)</label>
                  <span className="text-sm font-mono text-brand-400">{chunkSize}</span>
                </div>
                <input 
                  type="range" 
                  min="128" 
                  max="2048" 
                  step="64"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full accent-brand-500" 
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>128</span>
                  <span>1024</span>
                  <span>2048</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-400">Overlap (tokens)</label>
                  <span className="text-sm font-mono text-brand-400">{overlap}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="256" 
                  step="16"
                  value={overlap}
                  onChange={(e) => setOverlap(Number(e.target.value))}
                  className="w-full accent-brand-500" 
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0</span>
                  <span>128</span>
                  <span>256</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" />
              Metadata Fields
            </h2>

            <div className="space-y-3">
              {['source', 'section', 'page', 'created_at', 'author'].map((field, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-200 font-mono text-sm">{field}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={i < 3}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>
              ))}
            </div>

            <button className="btn-ghost w-full mt-4">
              + Add Custom Field
            </button>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-200 font-medium">Chunking Tip</p>
                <p className="text-sm text-amber-300/70 mt-1">
                  너무 작은 청크는 컨텍스트를 잃고, 너무 큰 청크는 검색 정확도를 낮춥니다.
                  일반적으로 512~1024 토큰이 적절합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 샘플 미리보기 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Sample Chunks
            </h2>
            <span className="text-sm text-slate-400">{sampleChunks.length} chunks</span>
          </div>

          <div className="space-y-4">
            {sampleChunks.map((chunk, index) => (
              <div 
                key={chunk.id}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-violet">Chunk {index + 1}</span>
                  <span className="text-xs text-slate-500">{chunk.tokens} tokens</span>
                </div>
                
                <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-4">
                  {chunk.content}
                </p>

                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Metadata</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(chunk.metadata).map(([key, value]) => (
                      <span key={key} className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                        <span className="text-slate-500">{key}:</span> {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <button className="btn-ghost">
              Load More Samples
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
