import { 
  Bot,
  Plus,
  Play,
  Save,
  Settings,
  MessageSquare,
  Wrench,
  Database,
  GitBranch,
  ArrowRight,
  Trash2,
  Copy,
  Zap,
  Brain,
  Search,
  Globe
} from 'lucide-react';
import { useState } from 'react';

export function AgentBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>('llm_call');

  const agentNodes = [
    { id: 'start', type: 'start', label: 'Start', x: 50, y: 150 },
    { id: 'llm_call', type: 'llm', label: 'LLM Router', x: 200, y: 150 },
    { id: 'web_search', type: 'tool', label: 'Web Search', x: 400, y: 80 },
    { id: 'rag_query', type: 'tool', label: 'RAG Query', x: 400, y: 220 },
    { id: 'synthesize', type: 'llm', label: 'Synthesize', x: 600, y: 150 },
    { id: 'end', type: 'end', label: 'End', x: 750, y: 150 },
  ];

  const nodeTypes = [
    { type: 'llm', label: 'LLM Call', icon: Brain, color: 'violet' },
    { type: 'tool', label: 'Tool Call', icon: Wrench, color: 'amber' },
    { type: 'retrieval', label: 'RAG Query', icon: Search, color: 'cyan' },
    { type: 'router', label: 'Router', icon: GitBranch, color: 'emerald' },
    { type: 'memory', label: 'Memory', icon: Database, color: 'rose' },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return 'from-emerald-500 to-emerald-600';
      case 'end': return 'from-rose-500 to-rose-600';
      case 'llm': return 'from-violet-500 to-purple-600';
      case 'tool': return 'from-amber-500 to-orange-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Agent Builder
          </h1>
          <p className="text-slate-400 mt-1">에이전트 그래프 및 워크플로우 설계</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Play className="w-4 h-4" />
            Test Run
          </button>
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 왼쪽: 노드 팔레트 */}
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Node Types</h2>
          
          <div className="space-y-2">
            {nodeTypes.map((node) => (
              <div 
                key={node.type}
                draggable
                className="p-3 bg-slate-800/50 rounded-lg cursor-grab hover:bg-slate-700/50 transition-all flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg bg-${node.color}-500/20 flex items-center justify-center`}>
                  <node.icon className={`w-4 h-4 text-${node.color}-400`} />
                </div>
                <span className="text-sm text-slate-300">{node.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h3 className="text-xs text-slate-500 mb-2">Agent Info</h3>
            <div className="space-y-2 text-sm">
              <input 
                type="text" 
                placeholder="Agent Name..." 
                className="input-field py-2 text-sm"
                defaultValue="Research Assistant"
              />
              <textarea 
                placeholder="Description..." 
                className="input-field py-2 text-sm min-h-[60px]"
                defaultValue="An agent that can search the web and RAG knowledge base to answer questions."
              />
            </div>
          </div>
        </div>

        {/* 중앙: 캔버스 */}
        <div className="col-span-2 glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400">Agent Graph</h2>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm py-1.5">
                <Copy className="w-4 h-4" />
              </button>
              <button className="btn-ghost text-sm py-1.5">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 캔버스 영역 - 시각적 표현 */}
          <div className="relative h-[400px] bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
            {/* 그리드 배경 */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* 연결선 (SVG) */}
            <svg className="absolute inset-0 pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                </marker>
              </defs>
              {/* Start -> LLM Router */}
              <path d="M 100 175 C 150 175, 150 175, 200 175" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              {/* LLM Router -> Web Search */}
              <path d="M 300 155 C 350 155, 350 105, 400 105" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              {/* LLM Router -> RAG Query */}
              <path d="M 300 195 C 350 195, 350 245, 400 245" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              {/* Web Search -> Synthesize */}
              <path d="M 500 105 C 550 105, 550 175, 600 175" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              {/* RAG Query -> Synthesize */}
              <path d="M 500 245 C 550 245, 550 175, 600 175" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              {/* Synthesize -> End */}
              <path d="M 700 175 C 725 175, 725 175, 750 175" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            </svg>

            {/* 노드들 */}
            {agentNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`absolute w-[100px] cursor-pointer transition-all ${
                  selectedNode === node.id ? 'scale-110' : ''
                }`}
                style={{ left: node.x, top: node.y }}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getNodeColor(node.type)} shadow-lg ${
                  selectedNode === node.id ? 'ring-2 ring-white' : ''
                }`}>
                  <div className="text-center">
                    {node.type === 'start' && <Zap className="w-5 h-5 text-white mx-auto" />}
                    {node.type === 'end' && <Zap className="w-5 h-5 text-white mx-auto" />}
                    {node.type === 'llm' && <Brain className="w-5 h-5 text-white mx-auto" />}
                    {node.type === 'tool' && <Wrench className="w-5 h-5 text-white mx-auto" />}
                    <p className="text-xs text-white mt-1 font-medium">{node.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 노드 설정 */}
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-4">
            {selectedNode ? 'Node Configuration' : 'Select a Node'}
          </h2>

          {selectedNode === 'llm_call' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Node Name</label>
                <input type="text" className="input-field py-2 text-sm" defaultValue="LLM Router" />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Model</label>
                <select className="input-field py-2 text-sm">
                  <option>gpt-4-turbo</option>
                  <option>gpt-3.5-turbo</option>
                  <option>llama-3-70b</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">System Prompt</label>
                <textarea 
                  className="input-field py-2 text-sm min-h-[80px]"
                  defaultValue="You are a router that decides whether to search the web or query the RAG knowledge base based on the user's question."
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Available Tools</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 bg-slate-800/50 rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span className="text-sm text-slate-300">web_search</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-800/50 rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span className="text-sm text-slate-300">rag_query</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Output</label>
                <select className="input-field py-2 text-sm">
                  <option>Route to next node</option>
                  <option>Return response</option>
                </select>
              </div>
            </div>
          )}

          {selectedNode && selectedNode !== 'llm_call' && (
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Settings className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Configuration for this node type</p>
              </div>
            </div>
          )}

          {!selectedNode && (
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click a node to configure</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
