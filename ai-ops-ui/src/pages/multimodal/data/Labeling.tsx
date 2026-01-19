import { 
  Tag,
  Plus,
  Search,
  Filter,
  Image,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function Labeling() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'schema' | 'qa'>('tasks');

  const labelTasks = [
    { id: 'task-001', name: 'VQA Annotation Batch 1', type: 'VQA', samples: 5000, completed: 3200, status: 'in_progress', assignees: 3 },
    { id: 'task-002', name: 'Image Captioning v2', type: 'Caption', samples: 10000, completed: 10000, status: 'completed', assignees: 5 },
    { id: 'task-003', name: 'Video QA Timestamps', type: 'VideoQA', samples: 2000, completed: 450, status: 'in_progress', assignees: 2 },
    { id: 'task-004', name: 'Dialogue Generation', type: 'Dialogue', samples: 8000, completed: 0, status: 'pending', assignees: 0 },
  ];

  const labelSchemas = [
    { name: 'VQA Schema', fields: ['question', 'answer', 'answer_type'], samples: 50000 },
    { name: 'Caption Schema', fields: ['caption', 'detail_level'], samples: 120000 },
    { name: 'VideoQA Schema', fields: ['question', 'answer', 'timestamp_start', 'timestamp_end'], samples: 15000 },
    { name: 'Grounding Schema', fields: ['phrase', 'bbox', 'confidence'], samples: 30000 },
  ];

  const qaIssues = [
    { id: 1, type: 'Inconsistent Answer', count: 45, severity: 'high' },
    { id: 2, type: 'Missing Timestamp', count: 23, severity: 'medium' },
    { id: 3, type: 'Low Quality Caption', count: 120, severity: 'low' },
    { id: 4, type: 'Unrelated Question', count: 8, severity: 'high' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-rose-400" />
            </div>
            Labeling & QA
          </h1>
          <p className="text-slate-400 mt-1">캡션, 질문-답변, 대화 라벨 관리 및 품질 검증</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Labels</p>
          <p className="text-2xl font-bold text-slate-100">215K</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Active Tasks</p>
          <p className="text-2xl font-bold text-slate-100">2</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-emerald-400">78%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">QA Issues</p>
          <p className="text-2xl font-bold text-amber-400">196</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="glass-card p-0">
        <div className="border-b border-slate-700/50">
          <nav className="flex">
            {(['tasks', 'schema', 'qa'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-rose-500 text-rose-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'tasks' && 'Labeling Tasks'}
                {tab === 'schema' && 'Label Schemas'}
                {tab === 'qa' && 'Quality QA'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search tasks..." className="input-field pl-9" />
                </div>
                <button className="btn-secondary">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="space-y-3">
                {labelTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-200">{task.name}</span>
                        <span className="badge badge-slate">{task.type}</span>
                      </div>
                      <span className={`badge ${
                        task.status === 'completed' ? 'badge-emerald' :
                        task.status === 'in_progress' ? 'badge-cyan' : 'badge-slate'
                      }`}>
                        {task.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                        {task.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <span>{task.completed.toLocaleString()} / {task.samples.toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignees} assignees
                        </span>
                      </div>
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rose-500"
                          style={{ width: `${(task.completed / task.samples) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labelSchemas.map((schema, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-200">{schema.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {schema.fields.map((field, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-400">
                        {field}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">{schema.samples.toLocaleString()} labeled samples</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {qaIssues.map((issue) => (
                  <div 
                    key={issue.id}
                    className={`p-4 rounded-lg border ${
                      issue.severity === 'high' ? 'bg-rose-900/10 border-rose-500/30' :
                      issue.severity === 'medium' ? 'bg-amber-900/10 border-amber-500/30' :
                      'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <p className="text-sm text-slate-400 mb-1">{issue.type}</p>
                    <p className="text-2xl font-bold text-slate-100">{issue.count}</p>
                    <span className={`badge mt-2 ${
                      issue.severity === 'high' ? 'badge-rose' :
                      issue.severity === 'medium' ? 'badge-amber' : 'badge-slate'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full">
                <AlertTriangle className="w-4 h-4" />
                Review All Issues
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
