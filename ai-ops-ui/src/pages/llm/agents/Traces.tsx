import { 
  Activity,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Brain,
  Wrench,
  Database,
  MessageSquare,
  DollarSign,
  RefreshCw,
  Play
} from 'lucide-react';
import { useState } from 'react';

export function AgentTraces() {
  const [selectedTrace, setSelectedTrace] = useState<number>(1);
  const [expandedSpans, setExpandedSpans] = useState<number[]>([1, 2]);

  const traces = [
    {
      id: 1,
      sessionId: 'sess_abc123',
      query: 'What are the latest updates on our API documentation?',
      status: 'success',
      duration: '3.2s',
      tokens: 1245,
      cost: 0.0045,
      timestamp: '2 mins ago',
      steps: 4
    },
    {
      id: 2,
      sessionId: 'sess_def456',
      query: 'Calculate the quarterly revenue growth rate',
      status: 'success',
      duration: '1.8s',
      tokens: 890,
      cost: 0.0032,
      timestamp: '15 mins ago',
      steps: 3
    },
    {
      id: 3,
      sessionId: 'sess_ghi789',
      query: 'Send email to team about the meeting',
      status: 'failed',
      duration: '0.8s',
      tokens: 234,
      cost: 0.0008,
      timestamp: '1 hour ago',
      steps: 2
    },
  ];

  const traceSpans = [
    {
      id: 1,
      type: 'llm',
      name: 'LLM Router',
      status: 'success',
      duration: '0.8s',
      tokens: { input: 156, output: 45 },
      model: 'gpt-4-turbo',
      input: 'What are the latest updates on our API documentation?',
      output: 'Decision: Query RAG knowledge base for API documentation updates.',
    },
    {
      id: 2,
      type: 'retrieval',
      name: 'RAG Query',
      status: 'success',
      duration: '0.4s',
      tokens: null,
      chunks: 5,
      input: 'API documentation updates',
      output: '[5 relevant chunks retrieved]',
    },
    {
      id: 3,
      type: 'tool',
      name: 'web_search',
      status: 'success',
      duration: '1.2s',
      tokens: null,
      input: '{"query": "API documentation latest changes 2024"}',
      output: '{"results": [{"title": "API v2.0 Release Notes", ...}]}',
    },
    {
      id: 4,
      type: 'llm',
      name: 'Synthesize',
      status: 'success',
      duration: '0.8s',
      tokens: { input: 780, output: 264 },
      model: 'gpt-4-turbo',
      input: 'Context: [RAG chunks + web results]\nQuestion: What are the latest updates?',
      output: 'Based on the documentation, the latest updates include...',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'llm': return <Brain className="w-4 h-4 text-violet-400" />;
      case 'tool': return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'retrieval': return <Database className="w-4 h-4 text-cyan-400" />;
      default: return <MessageSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  const toggleSpan = (spanId: number) => {
    setExpandedSpans(prev => 
      prev.includes(spanId) 
        ? prev.filter(id => id !== spanId)
        : [...prev, spanId]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Agent Traces
          </h1>
          <p className="text-slate-400 mt-1">에이전트 실행 이력 및 디버깅</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">156</p>
          <p className="text-sm text-slate-400">Total Traces (24h)</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">94%</p>
          <p className="text-sm text-slate-400">Success Rate</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">2.1s</p>
          <p className="text-sm text-slate-400">Avg Duration</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">$4.56</p>
          <p className="text-sm text-slate-400">Total Cost</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trace List */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400">Traces</h2>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm py-1">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {traces.map((trace) => (
              <div 
                key={trace.id}
                onClick={() => setSelectedTrace(trace.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedTrace === trace.id 
                    ? 'bg-brand-500/20 border border-brand-500/50' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(trace.status)}
                    <span className="text-xs font-mono text-slate-500">{trace.sessionId}</span>
                  </div>
                  <span className="text-xs text-slate-500">{trace.timestamp}</span>
                </div>
                <p className="text-sm text-slate-200 line-clamp-2 mb-2">{trace.query}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {trace.duration}
                  </span>
                  <span>{trace.steps} steps</span>
                  <span>${trace.cost.toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trace Detail / Timeline */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Trace Timeline</h2>
            <button className="btn-secondary text-sm">
              <Play className="w-4 h-4" />
              Replay
            </button>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {traceSpans.map((span, index) => (
              <div key={span.id} className="relative">
                {/* 연결선 */}
                {index < traceSpans.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-8 bg-slate-700" />
                )}

                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    expandedSpans.includes(span.id)
                      ? 'bg-slate-800/50 border-slate-600'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                  }`}
                  onClick={() => toggleSpan(span.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                        {getTypeIcon(span.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-200">{span.name}</span>
                          <span className="badge badge-slate text-xs">{span.type}</span>
                        </div>
                        {span.model && (
                          <span className="text-xs text-slate-500">{span.model}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">{span.duration}</span>
                      {getStatusIcon(span.status)}
                      {expandedSpans.includes(span.id) ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {expandedSpans.includes(span.id) && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                      {span.tokens && (
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Input: {span.tokens.input} tokens</span>
                          <span>Output: {span.tokens.output} tokens</span>
                        </div>
                      )}
                      {span.chunks && (
                        <div className="text-xs text-slate-500">
                          Retrieved: {span.chunks} chunks
                        </div>
                      )}
                      
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Input</p>
                        <div className="p-2 bg-slate-900/50 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                          {span.input}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Output</p>
                        <div className={`p-2 rounded text-xs font-mono overflow-x-auto ${
                          span.status === 'success' 
                            ? 'bg-emerald-500/10 text-emerald-300' 
                            : 'bg-rose-500/10 text-rose-300'
                        }`}>
                          {span.output}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Trace Summary</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Total Duration:</span>
                <span className="text-white ml-2">3.2s</span>
              </div>
              <div>
                <span className="text-slate-500">Total Tokens:</span>
                <span className="text-white ml-2">1,245</span>
              </div>
              <div>
                <span className="text-slate-500">LLM Calls:</span>
                <span className="text-white ml-2">2</span>
              </div>
              <div>
                <span className="text-slate-500">Cost:</span>
                <span className="text-emerald-400 ml-2">$0.0045</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
