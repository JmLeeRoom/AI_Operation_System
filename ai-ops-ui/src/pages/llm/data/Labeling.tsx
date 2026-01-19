import { 
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
  Filter,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  Edit,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export function LLMDataLabeling() {
  const [selectedTab, setSelectedTab] = useState<'tasks' | 'preferences' | 'prompts'>('tasks');

  const labelingTasks = [
    { id: 1, name: 'Chat Quality Rating', type: 'quality', status: 'in_progress', total: 5000, completed: 3420, labelers: 8, avgTime: '45s' },
    { id: 2, name: 'Response Preference Pairs', type: 'preference', status: 'in_progress', total: 10000, completed: 6780, labelers: 12, avgTime: '1m 30s' },
    { id: 3, name: 'Safety Classification', type: 'safety', status: 'completed', total: 2000, completed: 2000, labelers: 5, avgTime: '30s' },
    { id: 4, name: 'Instruction Following', type: 'instruction', status: 'pending', total: 8000, completed: 0, labelers: 0, avgTime: '-' },
  ];

  const preferencePairs = [
    {
      id: 1,
      prompt: "Explain how neural networks work",
      responseA: "Neural networks are computational models inspired by biological neurons. They consist of layers of interconnected nodes that process information...",
      responseB: "Neural networks work by passing data through layers. Each layer transforms the data until we get the final output...",
      chosen: 'A',
      annotator: 'user_123',
    },
    {
      id: 2,
      prompt: "Write a poem about spring",
      responseA: "Spring arrives with gentle rain,\nFlowers bloom across the plain...",
      responseB: "The sun warms the earth,\nNew life begins to emerge...",
      chosen: null,
      annotator: null,
    },
  ];

  const promptSets = [
    { id: 1, name: 'Safety Test Suite', prompts: 500, categories: ['harmful', 'jailbreak', 'pii'], lastRun: '2 hours ago' },
    { id: 2, name: 'Code Generation', prompts: 1200, categories: ['python', 'javascript', 'sql'], lastRun: '1 day ago' },
    { id: 3, name: 'Reasoning Tasks', prompts: 800, categories: ['math', 'logic', 'commonsense'], lastRun: '3 days ago' },
    { id: 4, name: 'Multilingual QA', prompts: 2000, categories: ['en', 'ko', 'ja', 'zh'], lastRun: '5 days ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-emerald';
      case 'in_progress': return 'badge-cyan';
      case 'pending': return 'badge-slate';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Human Labeling & Feedback</h1>
          <p className="text-slate-400 mt-1">라벨링 작업, 선호도 데이터, 평가용 프롬프트 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg w-fit">
        {[
          { key: 'tasks', label: 'Labeling Tasks', icon: Users },
          { key: 'preferences', label: 'Preference Pairs', icon: ThumbsUp },
          { key: 'prompts', label: 'Prompt Sets', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTab === tab.key
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Labeling Tasks Tab */}
      {selectedTab === 'tasks' && (
        <div className="space-y-6">
          {/* 통계 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="stat-card">
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-sm text-slate-400">Active Tasks</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-white">25K</p>
              <p className="text-sm text-slate-400">Total Samples</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-white">12.2K</p>
              <p className="text-sm text-slate-400">Completed Labels</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-white">25</p>
              <p className="text-sm text-slate-400">Labelers</p>
            </div>
          </div>

          {/* Task List */}
          <div className="glass-card p-6">
            <div className="overflow-hidden rounded-lg border border-slate-700/50">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Type</th>
                    <th>Progress</th>
                    <th>Labelers</th>
                    <th>Avg. Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labelingTasks.map((task) => (
                    <tr key={task.id} className="cursor-pointer">
                      <td className="font-medium text-slate-200">{task.name}</td>
                      <td>
                        <span className="badge badge-violet capitalize">{task.type}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 rounded-full"
                              style={{ width: `${(task.completed / task.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-400">
                            {task.completed.toLocaleString()} / {task.total.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="text-slate-300">{task.labelers}</td>
                      <td className="text-slate-400">{task.avgTime}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(task.status)} capitalize`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button className="btn-ghost text-sm py-1.5">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Preference Pairs Tab */}
      {selectedTab === 'preferences' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search prompts..." 
                  className="input-field pl-10"
                />
              </div>
              <button className="btn-secondary">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">6,780 / 10,000 labeled</span>
              <button className="btn-primary">
                <Sparkles className="w-4 h-4" />
                Generate DPO Dataset
              </button>
            </div>
          </div>

          {/* Preference UI */}
          <div className="space-y-4">
            {preferencePairs.map((pair) => (
              <div key={pair.id} className="glass-card p-6">
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Prompt</p>
                  <p className="text-slate-200 font-medium">{pair.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      pair.chosen === 'A' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-cyan">Response A</span>
                      {pair.chosen === 'A' && (
                        <span className="badge badge-emerald">
                          <ThumbsUp className="w-3 h-3" />
                          Chosen
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
                      {pair.responseA}
                    </p>
                  </div>

                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      pair.chosen === 'B' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-amber">Response B</span>
                      {pair.chosen === 'B' && (
                        <span className="badge badge-emerald">
                          <ThumbsUp className="w-3 h-3" />
                          Chosen
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
                      {pair.responseB}
                    </p>
                  </div>
                </div>

                {!pair.chosen && (
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                    <button className="btn-secondary">
                      <ThumbsUp className="w-4 h-4" />
                      Choose A
                    </button>
                    <button className="btn-ghost">Tie</button>
                    <button className="btn-secondary">
                      <ThumbsUp className="w-4 h-4" />
                      Choose B
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Sets Tab */}
      {selectedTab === 'prompts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-400">평가 및 회귀 테스트용 프롬프트 세트 관리</p>
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              New Prompt Set
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {promptSets.map((set) => (
              <div key={set.id} className="glass-card p-6 hover:border-brand-500/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{set.name}</h3>
                    <p className="text-sm text-slate-400">{set.prompts.toLocaleString()} prompts</p>
                  </div>
                  <button className="btn-ghost">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {set.categories.map((cat, i) => (
                    <span key={i} className="badge badge-slate">{cat}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 text-sm">
                  <span className="text-slate-500">Last run: {set.lastRun}</span>
                  <button className="btn-secondary text-sm py-1.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Run Tests
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
