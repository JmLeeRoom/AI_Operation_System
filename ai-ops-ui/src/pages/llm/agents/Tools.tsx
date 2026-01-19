import { 
  Wrench,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Play,
  Lock,
  Shield,
  Code,
  Globe,
  Database,
  Calculator,
  Clock,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';

export function AgentTools() {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);

  const tools = [
    {
      id: 1,
      name: 'web_search',
      description: 'Search the web for real-time information',
      icon: Globe,
      category: 'search',
      status: 'active',
      callCount: 12450,
      avgLatency: '1.2s',
      rateLimit: '100/min',
      permissions: ['read'],
      lastUsed: '2 mins ago'
    },
    {
      id: 2,
      name: 'sql_query',
      description: 'Execute SQL queries on connected databases',
      icon: Database,
      category: 'database',
      status: 'active',
      callCount: 8920,
      avgLatency: '0.5s',
      rateLimit: '50/min',
      permissions: ['read'],
      lastUsed: '5 mins ago'
    },
    {
      id: 3,
      name: 'code_interpreter',
      description: 'Execute Python code in a sandboxed environment',
      icon: Code,
      category: 'compute',
      status: 'active',
      callCount: 4560,
      avgLatency: '2.3s',
      rateLimit: '20/min',
      permissions: ['read', 'execute'],
      lastUsed: '1 hour ago'
    },
    {
      id: 4,
      name: 'calculator',
      description: 'Perform mathematical calculations',
      icon: Calculator,
      category: 'utility',
      status: 'active',
      callCount: 23400,
      avgLatency: '0.1s',
      rateLimit: '1000/min',
      permissions: ['read'],
      lastUsed: '30 secs ago'
    },
    {
      id: 5,
      name: 'send_email',
      description: 'Send emails to specified recipients',
      icon: Globe,
      category: 'action',
      status: 'restricted',
      callCount: 156,
      avgLatency: '1.5s',
      rateLimit: '10/hour',
      permissions: ['read', 'write'],
      lastUsed: '3 days ago'
    },
  ];

  const selectedToolData = tools.find(t => t.id === selectedTool);

  const exampleSchema = {
    name: "web_search",
    description: "Search the web for real-time information",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query"
        },
        num_results: {
          type: "integer",
          description: "Number of results to return",
          default: 5
        }
      },
      required: ["query"]
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      search: 'badge-cyan',
      database: 'badge-violet',
      compute: 'badge-amber',
      utility: 'badge-emerald',
      action: 'badge-rose',
    };
    return colors[category] || 'badge-slate';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            Tool Registry
          </h1>
          <p className="text-slate-400 mt-1">에이전트가 사용할 수 있는 도구 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Tool
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-sm text-slate-400">Registered Tools</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">49.4K</p>
          <p className="text-sm text-slate-400">Total Calls (24h)</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">4</p>
          <p className="text-sm text-slate-400">Active</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-amber-400">1</p>
          <p className="text-sm text-slate-400">Restricted</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tool List */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Tools</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="input-field pl-10 py-2 text-sm w-48"
              />
            </div>
          </div>

          <div className="space-y-3">
            {tools.map((tool, index) => (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTool === tool.id 
                    ? 'border-brand-500 bg-brand-500/10' 
                    : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tool.status === 'active' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                    }`}>
                      <tool.icon className={`w-5 h-5 ${
                        tool.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono font-semibold text-slate-200">{tool.name}</h3>
                        <span className={`badge ${getCategoryBadge(tool.category)} text-xs`}>
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tool.status === 'restricted' && (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    <span className={`badge ${tool.status === 'active' ? 'badge-emerald' : 'badge-amber'}`}>
                      {tool.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-6 text-xs text-slate-500">
                  <span>{tool.callCount.toLocaleString()} calls</span>
                  <span>Avg: {tool.avgLatency}</span>
                  <span>Limit: {tool.rateLimit}</span>
                  <span>Last: {tool.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Detail / Schema */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {selectedToolData ? 'Tool Details' : 'Select a Tool'}
          </h2>

          {selectedToolData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <selectedToolData.icon className="w-8 h-8 text-brand-400" />
                <div>
                  <p className="font-mono font-semibold text-white">{selectedToolData.name}</p>
                  <p className="text-sm text-slate-400">{selectedToolData.description}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedToolData.permissions.map((perm, i) => (
                    <span key={i} className="badge badge-violet text-xs capitalize">{perm}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">JSON Schema</p>
                <pre className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 overflow-auto max-h-64 font-mono">
                  {JSON.stringify(exampleSchema, null, 2)}
                </pre>
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary flex-1">
                  <Play className="w-4 h-4" />
                  Test
                </button>
                <button className="btn-ghost flex-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a tool to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
