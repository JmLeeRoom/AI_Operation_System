import { 
  FileText,
  Plus,
  Search,
  Edit,
  Eye,
  GitBranch,
  CheckCircle,
  Clock,
  Copy,
  Save,
  Play,
  ArrowRight,
  History,
  Tag,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export function LLMPrompts() {
  const [selectedPrompt, setSelectedPrompt] = useState<number>(1);
  const [showDiff, setShowDiff] = useState(false);

  const prompts = [
    {
      id: 1,
      name: 'chat-assistant-system',
      description: 'Main system prompt for chat assistant',
      currentVersion: 'v2.3',
      status: 'production',
      lastUpdated: '2 days ago',
      boundTo: ['prod-chat-v2', 'staging-chat'],
      tags: ['chat', 'general']
    },
    {
      id: 2,
      name: 'code-assistant-system',
      description: 'System prompt for code generation',
      currentVersion: 'v1.5',
      status: 'staging',
      lastUpdated: '5 days ago',
      boundTo: ['dev-code-assist'],
      tags: ['code', 'developer']
    },
    {
      id: 3,
      name: 'rag-synthesis',
      description: 'Prompt template for RAG answer synthesis',
      currentVersion: 'v3.1',
      status: 'production',
      lastUpdated: '1 week ago',
      boundTo: ['prod-rag-service'],
      tags: ['rag', 'qa']
    },
  ];

  const promptVersions = [
    { version: 'v2.3', status: 'production', date: '2 days ago', author: 'jaeMyeong' },
    { version: 'v2.2', status: 'previous', date: '1 week ago', author: 'jaeMyeong' },
    { version: 'v2.1', status: 'archived', date: '2 weeks ago', author: 'admin' },
    { version: 'v2.0', status: 'archived', date: '1 month ago', author: 'admin' },
  ];

  const currentPromptContent = `You are a helpful AI assistant. Follow these guidelines:

1. **Be helpful and informative**: Provide accurate, relevant information.
2. **Be respectful**: Always maintain a professional and courteous tone.
3. **Be honest**: If you don't know something, say so.
4. **Safety first**: Never provide harmful, illegal, or unethical advice.

When responding:
- Use clear, concise language
- Structure long responses with headers and bullet points
- Cite sources when applicable
- Ask clarifying questions if the query is ambiguous

{{#if context}}
Use the following context to answer the user's question:
{{context}}
{{/if}}`;

  const previousPromptContent = `You are a helpful AI assistant.

Guidelines:
- Be helpful and provide accurate information
- Maintain a professional tone
- Be honest about limitations

{{#if context}}
Context: {{context}}
{{/if}}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'production': return 'badge-emerald';
      case 'staging': return 'badge-amber';
      case 'development': return 'badge-cyan';
      case 'previous': return 'badge-slate';
      case 'archived': return 'badge-slate';
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
              <FileText className="w-5 h-5 text-white" />
            </div>
            Prompt Management
          </h1>
          <p className="text-slate-400 mt-1">시스템 프롬프트 템플릿 버전 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Prompt
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Prompt List */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400">Prompts</h2>
            <button className="btn-ghost text-sm py-1">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {prompts.map((prompt) => (
              <div 
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedPrompt === prompt.id 
                    ? 'bg-brand-500/20 border border-brand-500/50' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-slate-200">{prompt.name}</span>
                  <span className={`badge ${getStatusBadge(prompt.status)} text-xs`}>
                    {prompt.currentVersion}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{prompt.description}</p>
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-800 rounded text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Editor */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">chat-assistant-system</h2>
              <p className="text-sm text-slate-400">Main system prompt for chat assistant</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                <input 
                  type="checkbox" 
                  checked={showDiff}
                  onChange={(e) => setShowDiff(e.target.checked)}
                  className="rounded text-brand-500" 
                />
                Show Diff
              </label>
              <button className="btn-secondary text-sm">
                <Play className="w-4 h-4" />
                Test
              </button>
              <button className="btn-primary text-sm">
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>

          {showDiff ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">Previous (v2.2)</p>
                <pre className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-sm text-slate-300 font-mono overflow-auto h-[400px] whitespace-pre-wrap">
                  {previousPromptContent}
                </pre>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Current (v2.3)</p>
                <pre className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-slate-300 font-mono overflow-auto h-[400px] whitespace-pre-wrap">
                  {currentPromptContent}
                </pre>
              </div>
            </div>
          ) : (
            <div>
              <textarea 
                className="input-field min-h-[400px] font-mono text-sm"
                defaultValue={currentPromptContent}
              />
            </div>
          )}

          {/* Variables */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Template Variables</h3>
            <div className="flex flex-wrap gap-2">
              {['{{context}}', '{{user_name}}', '{{date}}', '{{language}}'].map((variable, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded font-mono">
                  {variable}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Version History & Bindings */}
        <div className="space-y-6">
          <div className="glass-card p-4">
            <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Version History
            </h2>

            <div className="space-y-2">
              {promptVersions.map((version, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded-lg flex items-center justify-between ${
                    version.status === 'production' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800/30'
                  }`}
                >
                  <div>
                    <span className="font-mono text-sm text-slate-200">{version.version}</span>
                    <p className="text-xs text-slate-500">{version.date}</p>
                  </div>
                  <span className={`badge ${getStatusBadge(version.status)} text-xs`}>
                    {version.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Bound Endpoints
            </h2>

            <div className="space-y-2">
              {['prod-chat-v2', 'staging-chat'].map((endpoint, i) => (
                <div key={i} className="p-2 bg-slate-800/30 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-slate-200">{endpoint}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>

            <button className="btn-ghost w-full mt-3 text-sm">
              <Plus className="w-4 h-4" />
              Bind to Endpoint
            </button>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-200 font-medium">Regression Test Required</p>
                <p className="text-xs text-amber-300/70 mt-1">
                  Run regression tests before deploying prompt changes to production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
