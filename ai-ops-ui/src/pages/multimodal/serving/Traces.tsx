import { 
  Activity,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Image,
  MessageSquare,
  Wrench,
  Eye,
  RotateCcw,
  Download
} from 'lucide-react';
import { useState } from 'react';

export function Traces() {
  const [expandedTrace, setExpandedTrace] = useState<string | null>('trace-001');

  const traces = [
    {
      id: 'trace-001',
      timestamp: '2024-01-18 15:32:45',
      duration: '2.3s',
      status: 'success',
      input: 'What is shown in this image and what actions can I take?',
      output: 'The image shows a restaurant menu. You can order food by...',
      spans: [
        { id: 'span-1', name: 'Preprocess', type: 'preprocess', duration: '120ms', status: 'success' },
        { id: 'span-2', name: 'Encode Image', type: 'encode', duration: '450ms', status: 'success' },
        { id: 'span-3', name: 'Retrieval', type: 'retrieval', duration: '180ms', status: 'success' },
        { id: 'span-4', name: 'VLM Generate', type: 'llm', duration: '1200ms', status: 'success' },
        { id: 'span-5', name: 'Tool: menu_parser', type: 'tool', duration: '280ms', status: 'success' },
        { id: 'span-6', name: 'Summarize', type: 'llm', duration: '150ms', status: 'success' },
      ],
    },
    {
      id: 'trace-002',
      timestamp: '2024-01-18 15:30:12',
      duration: '4.1s',
      status: 'failed',
      input: 'Analyze this video and find the specific moment when...',
      output: 'Error: Tool execution timeout',
      spans: [
        { id: 'span-1', name: 'Preprocess', type: 'preprocess', duration: '350ms', status: 'success' },
        { id: 'span-2', name: 'Frame Sampling', type: 'encode', duration: '800ms', status: 'success' },
        { id: 'span-3', name: 'VLM Generate', type: 'llm', duration: '1500ms', status: 'success' },
        { id: 'span-4', name: 'Tool: video_search', type: 'tool', duration: '1500ms', status: 'failed' },
      ],
    },
    {
      id: 'trace-003',
      timestamp: '2024-01-18 15:28:55',
      duration: '1.8s',
      status: 'success',
      input: 'Describe what you see in this photo.',
      output: 'I can see a beautiful landscape with mountains...',
      spans: [
        { id: 'span-1', name: 'Preprocess', type: 'preprocess', duration: '100ms', status: 'success' },
        { id: 'span-2', name: 'Encode Image', type: 'encode', duration: '400ms', status: 'success' },
        { id: 'span-3', name: 'VLM Generate', type: 'llm', duration: '1300ms', status: 'success' },
      ],
    },
  ];

  const spanTypeColors: Record<string, string> = {
    preprocess: 'cyan',
    encode: 'violet',
    retrieval: 'emerald',
    llm: 'amber',
    tool: 'rose',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            Trace Viewer
          </h1>
          <p className="text-slate-400 mt-1">멀티스텝 추론 및 도구 호출 추적</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search traces..."
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Status:</span>
          <button className="px-2 py-1 rounded bg-slate-800 text-slate-400">All</button>
          <button className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">Success</button>
          <button className="px-2 py-1 rounded bg-rose-500/20 text-rose-400">Failed</button>
        </div>
      </div>

      {/* 트레이스 목록 */}
      <div className="space-y-4">
        {traces.map((trace) => (
          <div key={trace.id} className="glass-card p-0 overflow-hidden">
            {/* 헤더 */}
            <div 
              className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
              onClick={() => setExpandedTrace(expandedTrace === trace.id ? null : trace.id)}
            >
              <div className="flex items-center gap-4">
                {expandedTrace === trace.id ? (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-slate-400">{trace.id}</span>
                    <span className={`badge ${trace.status === 'success' ? 'badge-emerald' : 'badge-rose'}`}>
                      {trace.status === 'success' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {trace.status}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trace.duration}
                    </span>
                  </div>
                  <p className="text-slate-300 truncate">{trace.input}</p>
                </div>
                <span className="text-sm text-slate-500">{trace.timestamp}</span>
              </div>
            </div>

            {/* 상세 */}
            {expandedTrace === trace.id && (
              <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Input */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Input</p>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-slate-200 text-sm">{trace.input}</p>
                    </div>
                  </div>
                  {/* Output */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Output</p>
                    <div className={`p-3 rounded-lg ${trace.status === 'success' ? 'bg-slate-800/50' : 'bg-rose-900/20 border border-rose-500/30'}`}>
                      <p className={`text-sm ${trace.status === 'success' ? 'text-slate-200' : 'text-rose-300'}`}>
                        {trace.output}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Span Timeline */}
                <div>
                  <p className="text-xs text-slate-500 mb-3">Span Timeline</p>
                  <div className="space-y-2">
                    {trace.spans.map((span, idx) => {
                      const color = spanTypeColors[span.type] || 'slate';
                      return (
                        <div 
                          key={span.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            span.status === 'success' 
                              ? `bg-${color}-500/10 border-${color}-500/30`
                              : 'bg-rose-900/20 border-rose-500/30'
                          }`}
                        >
                          <span className="text-xs text-slate-500 w-6">{idx + 1}</span>
                          <div className={`w-8 h-8 rounded flex items-center justify-center bg-${color}-500/20`}>
                            {span.type === 'preprocess' && <Image className={`w-4 h-4 text-${color}-400`} />}
                            {span.type === 'encode' && <Image className={`w-4 h-4 text-${color}-400`} />}
                            {span.type === 'retrieval' && <Search className={`w-4 h-4 text-${color}-400`} />}
                            {span.type === 'llm' && <MessageSquare className={`w-4 h-4 text-${color}-400`} />}
                            {span.type === 'tool' && <Wrench className={`w-4 h-4 text-${color}-400`} />}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-slate-200">{span.name}</span>
                            <span className={`ml-2 badge badge-${color} text-xs`}>{span.type}</span>
                          </div>
                          <span className="text-sm text-slate-400">{span.duration}</span>
                          {span.status === 'failed' && (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                  <button className="btn-ghost text-sm">
                    <Eye className="w-4 h-4" />
                    Full Details
                  </button>
                  <button className="btn-ghost text-sm">
                    <RotateCcw className="w-4 h-4" />
                    Replay
                  </button>
                  {trace.status === 'failed' && (
                    <button className="btn-secondary text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Investigate
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
