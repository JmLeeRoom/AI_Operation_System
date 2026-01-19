import { 
  Bot,
  Plus,
  Play,
  Save,
  Settings,
  GitBranch,
  Search,
  Image,
  MessageSquare,
  Wrench,
  ArrowRight,
  Trash2,
  GripVertical,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function AgentBuilder() {
  const [nodes, setNodes] = useState([
    { id: 'router', type: 'router', label: 'Router', x: 100, y: 150 },
    { id: 'retrieval', type: 'retrieval', label: 'Retrieval', x: 300, y: 100 },
    { id: 'vlm', type: 'vlm', label: 'VLM', x: 300, y: 200 },
    { id: 'tools', type: 'tools', label: 'Tool Call', x: 500, y: 150 },
    { id: 'summarize', type: 'summarize', label: 'Summarize', x: 700, y: 150 },
  ]);

  const nodeTypes = [
    { type: 'router', label: 'Router', icon: GitBranch, color: 'violet' },
    { type: 'retrieval', label: 'Retrieval', icon: Search, color: 'cyan' },
    { type: 'vlm', label: 'VLM', icon: Image, color: 'emerald' },
    { type: 'tools', label: 'Tool Call', icon: Wrench, color: 'amber' },
    { type: 'summarize', label: 'Summarize', icon: MessageSquare, color: 'rose' },
  ];

  const agentTemplates = [
    { name: 'Simple QA', description: 'Router → VLM → Response', nodes: 3 },
    { name: 'RAG Agent', description: 'Router → Retrieval → VLM → Response', nodes: 4 },
    { name: 'Tool Agent', description: 'Router → VLM → Tools → Summarize', nodes: 5 },
    { name: 'Multi-step', description: 'Full pipeline with loops', nodes: 7 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Agent Builder
          </h1>
          <p className="text-slate-400 mt-1">멀티모달 에이전트 그래프 구성</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            <Settings className="w-4 h-4" />
          </button>
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Deploy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 노드 팔레트 */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Node Types</h3>
          <div className="space-y-2">
            {nodeTypes.map((node) => {
              const Icon = node.icon;
              return (
                <div 
                  key={node.type}
                  className={`p-3 rounded-lg bg-${node.color}-500/10 border border-${node.color}-500/30 cursor-grab flex items-center gap-3 hover:bg-${node.color}-500/20 transition-colors`}
                  draggable
                >
                  <GripVertical className="w-4 h-4 text-slate-500" />
                  <Icon className={`w-5 h-5 text-${node.color}-400`} />
                  <span className="text-sm text-slate-200">{node.label}</span>
                </div>
              );
            })}
          </div>

          <h3 className="text-sm font-semibold text-slate-400 mt-6 mb-3">Templates</h3>
          <div className="space-y-2">
            {agentTemplates.map((tpl, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-200">{tpl.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500">{tpl.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 캔버스 */}
        <div className="lg:col-span-2 glass-card p-4">
          <div className="h-[500px] bg-slate-900/50 rounded-xl border border-slate-700/50 relative overflow-hidden">
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Nodes */}
            {nodes.map((node) => {
              const nodeType = nodeTypes.find(n => n.type === node.type);
              const Icon = nodeType?.icon || Bot;
              return (
                <div
                  key={node.id}
                  className={`absolute p-3 rounded-lg bg-${nodeType?.color || 'slate'}-500/20 border border-${nodeType?.color || 'slate'}-500/50 cursor-move shadow-lg`}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 text-${nodeType?.color || 'slate'}-400`} />
                    <span className="text-sm font-medium text-slate-200">{node.label}</span>
                  </div>
                </div>
              );
            })}

            {/* Connections (simplified) */}
            <svg className="absolute inset-0 pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                </marker>
              </defs>
              <line x1="180" y1="165" x2="280" y2="115" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="180" y1="165" x2="280" y2="215" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="380" y1="115" x2="480" y2="165" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="380" y1="215" x2="480" y2="165" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="580" y1="165" x2="680" y2="165" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </svg>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm">
                <Plus className="w-4 h-4" />
                Add Node
              </button>
              <button className="btn-ghost text-sm">
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
            <span className="text-sm text-slate-500">{nodes.length} nodes</span>
          </div>
        </div>

        {/* 설정 패널 */}
        <div className="glass-card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400">Agent Configuration</h3>
          
          <div>
            <label className="text-xs text-slate-500">Agent Name</label>
            <input type="text" className="input-field mt-1" defaultValue="multimodal-agent-v1" />
          </div>

          <div>
            <label className="text-xs text-slate-500">Base Model</label>
            <select className="input-field mt-1">
              <option>vlm-instruct-v2.1</option>
              <option>vlm-instruct-v2.0</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500">Max Iterations</label>
            <input type="number" className="input-field mt-1" defaultValue={5} />
          </div>

          <div>
            <label className="text-xs text-slate-500">Memory Type</label>
            <select className="input-field mt-1">
              <option>Sliding Window</option>
              <option>Full Context</option>
              <option>Summary</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500">Enable Fallback</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-slate-700 peer-checked:bg-violet-500 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <h4 className="text-xs text-slate-500 mb-2">Safety Policies</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox text-violet-500 rounded" defaultChecked />
                Prompt Injection Defense
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox text-violet-500 rounded" defaultChecked />
                Content Safety Filter
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox text-violet-500 rounded" />
                PII Detection
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
