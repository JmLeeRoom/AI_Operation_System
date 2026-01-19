import { 
  Search,
  Send,
  Settings,
  Bookmark,
  Copy,
  ThumbsUp,
  ThumbsDown,
  FileText,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Clock,
  Zap
} from 'lucide-react';
import { useState } from 'react';

export function RAGPlayground() {
  const [query, setQuery] = useState('');
  const [showSettings, setShowSettings] = useState(true);

  const retrievedChunks = [
    {
      id: 1,
      content: "Machine learning models are trained using large datasets. The training process involves feeding data through the model and adjusting weights based on the error between predictions and actual values. This process is called backpropagation.",
      source: "API Documentation",
      page: 12,
      score: 0.94,
      highlighted: "Machine learning models are trained using large datasets."
    },
    {
      id: 2,
      content: "The model architecture consists of multiple layers: input layer, hidden layers, and output layer. Each layer processes the input and passes it to the next layer. Deep learning uses many hidden layers to learn complex patterns.",
      source: "Technical Guide",
      page: 45,
      score: 0.89,
      highlighted: "model architecture consists of multiple layers"
    },
    {
      id: 3,
      content: "Training requires careful hyperparameter tuning including learning rate, batch size, and number of epochs. The learning rate determines how quickly the model adapts to the problem.",
      source: "Best Practices",
      page: 8,
      score: 0.85,
      highlighted: "hyperparameter tuning including learning rate"
    },
  ];

  const generatedAnswer = {
    content: `Machine learning models are trained using a process that involves several key components:

1. **Data Preparation**: Large datasets are used to train the models. The quality and quantity of data significantly impact model performance.

2. **Model Architecture**: The model typically consists of multiple layers - an input layer, hidden layers, and an output layer. In deep learning, many hidden layers are used to learn complex patterns.

3. **Training Process**: During training, data is fed through the model, and weights are adjusted based on the error between predictions and actual values. This optimization process is called backpropagation.

4. **Hyperparameter Tuning**: Key parameters like learning rate, batch size, and number of epochs need careful tuning. The learning rate determines how quickly the model adapts to the problem.

The training process iterates until the model achieves satisfactory performance on validation data.`,
    citations: [1, 2, 3],
    tokens: { input: 245, output: 189 },
    latency: '1.2s'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            RAG Playground
          </h1>
          <p className="text-slate-400 mt-1">질의 → 검색 → 생성 파이프라인 테스트</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Bookmark className="w-4 h-4" />
            Save Session
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`btn-ghost ${showSettings ? 'bg-slate-700/50' : ''}`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 왼쪽: 검색 결과 (Retrieved Chunks) */}
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Retrieved Chunks ({retrievedChunks.length})
          </h2>

          <div className="space-y-3">
            {retrievedChunks.map((chunk, index) => (
              <div 
                key={chunk.id}
                className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer border-l-2 border-cyan-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-cyan text-xs">#{index + 1}</span>
                  <span className="text-xs text-emerald-400 font-mono">{(chunk.score * 100).toFixed(0)}%</span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {chunk.content}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <FileText className="w-3 h-3" />
                  <span>{chunk.source}</span>
                  <span>•</span>
                  <span>p.{chunk.page}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 중앙: 질의 입력 & 생성 결과 */}
        <div className="col-span-2 space-y-4">
          {/* 질의 입력 */}
          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your question..."
                  className="input-field min-h-[80px] resize-none"
                  defaultValue="How are machine learning models trained?"
                />
              </div>
              <button className="btn-primary px-4 py-3">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="flex items-center gap-4 text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {generatedAnswer.latency}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {generatedAnswer.tokens.input + generatedAnswer.tokens.output} tokens
                </span>
              </div>
              <button className="btn-ghost text-sm py-1">
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
          </div>

          {/* 생성 결과 */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Generated Answer</h2>
              <div className="flex items-center gap-2">
                <button className="btn-ghost text-sm py-1.5">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="btn-ghost text-sm py-1.5 text-emerald-400">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="btn-ghost text-sm py-1.5 text-rose-400">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                {generatedAnswer.content}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-2">Citations</p>
              <div className="flex flex-wrap gap-2">
                {generatedAnswer.citations.map((citationId) => {
                  const chunk = retrievedChunks.find(c => c.id === citationId);
                  return (
                    <span 
                      key={citationId}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded cursor-pointer hover:bg-cyan-500/20"
                    >
                      [{citationId}] {chunk?.source}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 설정 패널 */}
        {showSettings && (
          <div className="glass-card p-4">
            <h2 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Index</label>
                <select className="input-field text-sm py-2">
                  <option>main-knowledge-base</option>
                  <option>product-docs</option>
                  <option>code-snippets</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Top K</label>
                <input type="number" className="input-field text-sm py-2" defaultValue={5} />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Reranker</label>
                <select className="input-field text-sm py-2">
                  <option>Enabled (Cohere)</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">LLM Model</label>
                <select className="input-field text-sm py-2">
                  <option>gpt-4-turbo</option>
                  <option>gpt-3.5-turbo</option>
                  <option>llama-3-70b</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Temperature</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full accent-brand-500" />
                <div className="flex justify-between text-xs text-slate-600">
                  <span>0</span>
                  <span className="text-brand-400">0.3</span>
                  <span>1</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">System Prompt</label>
                <textarea 
                  className="input-field text-sm py-2 min-h-[80px] resize-none"
                  defaultValue="You are a helpful assistant. Answer questions based on the provided context. If you don't know the answer, say so."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
