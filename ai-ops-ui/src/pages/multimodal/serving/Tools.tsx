import { 
  Wrench,
  Plus,
  Search,
  Image,
  Video,
  Globe,
  Database,
  Code,
  Shield,
  Clock,
  Play,
  Settings,
  MoreVertical,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export function Tools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'tool-001',
      name: 'image_search',
      description: '이미지 기반 검색 및 유사 이미지 찾기',
      icon: Image,
      color: 'violet',
      category: 'Multimodal',
      schema: {
        input: { type: 'object', properties: { query: 'string', k: 'number' } },
        output: { type: 'array', items: { image_url: 'string', score: 'number' } },
      },
      permissions: ['project-read'],
      rateLimit: '100/min',
      status: 'active',
      calls: 12500,
    },
    {
      id: 'tool-002',
      name: 'video_summarize',
      description: '비디오 내용 요약 및 하이라이트 추출',
      icon: Video,
      color: 'cyan',
      category: 'Multimodal',
      schema: {
        input: { type: 'object', properties: { video_url: 'string', max_length: 'number' } },
        output: { type: 'object', properties: { summary: 'string', highlights: 'array' } },
      },
      permissions: ['project-read', 'gpu-access'],
      rateLimit: '10/min',
      status: 'active',
      calls: 3200,
    },
    {
      id: 'tool-003',
      name: 'web_browse',
      description: '웹 페이지 접근 및 정보 추출',
      icon: Globe,
      color: 'emerald',
      category: 'External',
      schema: {
        input: { type: 'object', properties: { url: 'string', extract: 'string' } },
        output: { type: 'object', properties: { content: 'string', metadata: 'object' } },
      },
      permissions: ['external-access'],
      rateLimit: '50/min',
      status: 'active',
      calls: 8900,
    },
    {
      id: 'tool-004',
      name: 'db_query',
      description: '데이터베이스 쿼리 실행',
      icon: Database,
      color: 'amber',
      category: 'Internal',
      schema: {
        input: { type: 'object', properties: { query: 'string', db: 'string' } },
        output: { type: 'object', properties: { results: 'array', count: 'number' } },
      },
      permissions: ['db-read'],
      rateLimit: '200/min',
      status: 'disabled',
      calls: 45000,
    },
    {
      id: 'tool-005',
      name: 'code_execute',
      description: 'Python 코드 샌드박스 실행',
      icon: Code,
      color: 'rose',
      category: 'Compute',
      schema: {
        input: { type: 'object', properties: { code: 'string', timeout: 'number' } },
        output: { type: 'object', properties: { stdout: 'string', result: 'any' } },
      },
      permissions: ['sandbox-execute'],
      rateLimit: '20/min',
      status: 'active',
      calls: 5600,
    },
  ];

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            Tool Registry
          </h1>
          <p className="text-slate-400 mt-1">멀티모달 도구 및 외부 API 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Register Tool
        </button>
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search tools..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Multimodal', 'External', 'Internal', 'Compute'].map((cat) => (
            <button 
              key={cat}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 도구 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedTool === tool.id ? 'border-amber-500/50' : 'hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${tool.color}-500/20 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 text-${tool.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-slate-200">{tool.name}</span>
                        <span className="badge badge-slate text-xs">{tool.category}</span>
                      </div>
                      <span className={`flex items-center gap-1 text-sm ${
                        tool.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
                      }`}>
                        {tool.status === 'active' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        {tool.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{tool.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {tool.permissions.length} permissions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tool.rateLimit}
                      </span>
                      <span>{tool.calls.toLocaleString()} calls</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 상세 패널 */}
        <div className="glass-card p-6 h-fit sticky top-6">
          {selectedToolData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">{selectedToolData.name}</h3>
                <button className="p-2 hover:bg-slate-700 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Schema */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">Input Schema</p>
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto">
                    <pre>{JSON.stringify(selectedToolData.schema.input, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Output Schema</p>
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto">
                    <pre>{JSON.stringify(selectedToolData.schema.output, null, 2)}</pre>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedToolData.permissions.map((perm, i) => (
                      <span key={i} className="badge badge-slate text-xs">{perm}</span>
                    ))}
                  </div>
                </div>

                {/* Rate Limit */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Rate Limit</span>
                  <span className="text-slate-200">{selectedToolData.rateLimit}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                  <button className="btn-secondary flex-1">
                    <Play className="w-4 h-4" />
                    Test
                  </button>
                  <button className="btn-ghost flex-1">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a tool to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
