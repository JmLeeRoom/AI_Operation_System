import { 
  GitCompare,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Plus,
  RefreshCw,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';

export function LLMRegressionTesting() {
  const [compareMode, setCompareMode] = useState(false);

  const goldenPrompts = [
    {
      id: 1,
      prompt: "Explain the concept of machine learning in simple terms.",
      category: "explanation",
      baseline: "Machine learning is a type of artificial intelligence that...",
      current: "Machine learning is a branch of AI where computers learn patterns...",
      status: "improved",
      similarity: 0.92,
    },
    {
      id: 2,
      prompt: "Write a Python function to calculate fibonacci numbers.",
      category: "code",
      baseline: "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
      current: "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
      status: "unchanged",
      similarity: 1.0,
    },
    {
      id: 3,
      prompt: "What are the main causes of climate change?",
      category: "factual",
      baseline: "The main causes include greenhouse gas emissions from...",
      current: "Climate change is primarily caused by human activities that...",
      status: "degraded",
      similarity: 0.78,
    },
    {
      id: 4,
      prompt: "Translate 'Hello, how are you?' to Korean.",
      category: "translation",
      baseline: "안녕하세요, 어떻게 지내세요?",
      current: "안녕하세요, 어떻게 지내세요?",
      status: "unchanged",
      similarity: 1.0,
    },
    {
      id: 5,
      prompt: "Summarize the following article in 3 sentences...",
      category: "summarization",
      baseline: "The article discusses the recent advances in...",
      current: "This article highlights key developments in...",
      status: "improved",
      similarity: 0.85,
    },
  ];

  const regressionSummary = {
    total: 500,
    improved: 45,
    unchanged: 432,
    degraded: 23,
    passRate: 95.4,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'improved': return <ArrowUp className="w-4 h-4 text-emerald-400" />;
      case 'unchanged': return <Minus className="w-4 h-4 text-slate-400" />;
      case 'degraded': return <ArrowDown className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'improved': return 'badge-emerald';
      case 'unchanged': return 'badge-slate';
      case 'degraded': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            Regression Testing
          </h1>
          <p className="text-slate-400 mt-1">고정 프롬프트로 모델 버전 간 품질 비교</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Run Regression
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Golden Prompts
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">{regressionSummary.total}</p>
          <p className="text-sm text-slate-400">Total Tests</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">{regressionSummary.improved}</p>
          <p className="text-sm text-slate-400">Improved</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-slate-300">{regressionSummary.unchanged}</p>
          <p className="text-sm text-slate-400">Unchanged</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-rose-400">{regressionSummary.degraded}</p>
          <p className="text-sm text-slate-400">Degraded</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-brand-400">{regressionSummary.passRate}%</p>
          <p className="text-sm text-slate-400">Pass Rate</p>
        </div>
      </div>

      {/* Version Comparison */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Version Comparison</h2>
          <div className="flex items-center gap-4">
            <select className="input-field py-2 text-sm">
              <option>Llama-3-8B-v2.2 (Baseline)</option>
              <option>Llama-3-8B-v2.1</option>
              <option>Llama-3-8B-v2.0</option>
            </select>
            <span className="text-slate-500">vs</span>
            <select className="input-field py-2 text-sm">
              <option>Llama-3-8B-v2.3 (Current)</option>
            </select>
          </div>
        </div>

        {/* Impact Chart */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${(regressionSummary.improved / regressionSummary.total) * 100}%` }} 
            />
            <div 
              className="h-full bg-slate-500" 
              style={{ width: `${(regressionSummary.unchanged / regressionSummary.total) * 100}%` }} 
            />
            <div 
              className="h-full bg-rose-500" 
              style={{ width: `${(regressionSummary.degraded / regressionSummary.total) * 100}%` }} 
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-slate-400">Improved ({regressionSummary.improved})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-500" />
            <span className="text-slate-400">Unchanged ({regressionSummary.unchanged})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-rose-500" />
            <span className="text-slate-400">Degraded ({regressionSummary.degraded})</span>
          </div>
        </div>
      </div>

      {/* Golden Prompts List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Golden Prompt Results</h2>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="rounded text-brand-500" 
              />
              <span className="text-sm text-slate-400">Show Diff</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {goldenPrompts.map((item, index) => (
            <div 
              key={item.id}
              className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="badge badge-violet text-xs mb-1">{item.category}</span>
                    <p className="text-slate-200 font-medium">{item.prompt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusBadge(item.status)} capitalize`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                  <span className="text-sm text-slate-400">
                    Similarity: {(item.similarity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {compareMode && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Baseline (v2.2)</p>
                    <div className="p-3 bg-slate-900/50 rounded text-sm text-slate-300 font-mono whitespace-pre-wrap">
                      {item.baseline}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Current (v2.3)</p>
                    <div className={`p-3 rounded text-sm font-mono whitespace-pre-wrap ${
                      item.status === 'improved' ? 'bg-emerald-500/10 text-emerald-300' :
                      item.status === 'degraded' ? 'bg-rose-500/10 text-rose-300' :
                      'bg-slate-900/50 text-slate-300'
                    }`}>
                      {item.current}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3">
                <button className="btn-ghost text-sm py-1.5">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {item.status === 'degraded' && (
                  <button className="btn-ghost text-sm py-1.5 text-rose-400">
                    Report Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate Decision */}
      <div className={`p-6 rounded-xl border ${
        regressionSummary.passRate >= 95 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {regressionSummary.passRate >= 95 ? (
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-amber-400" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {regressionSummary.passRate >= 95 ? 'Regression Test Passed' : 'Review Required'}
              </h3>
              <p className="text-slate-400">
                {regressionSummary.passRate >= 95 
                  ? 'Model can be promoted to next stage'
                  : 'Some prompts show degradation. Manual review recommended.'
                }
              </p>
            </div>
          </div>
          <button className={`${regressionSummary.passRate >= 95 ? 'btn-primary' : 'btn-secondary'}`}>
            {regressionSummary.passRate >= 95 ? 'Promote Model' : 'Request Review'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
