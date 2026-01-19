import { 
  ClipboardList,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Code,
  MessageSquare,
  Calculator,
  Search
} from 'lucide-react';

export function LLMEvalSuites() {
  const evalSuites = [
    {
      id: 1,
      name: 'General QA Suite',
      description: 'General knowledge question answering benchmark',
      tasks: ['trivia', 'factoid', 'open-ended'],
      cases: 2500,
      lastScore: 0.847,
      prevScore: 0.823,
      status: 'passed',
      lastRun: '2 hours ago'
    },
    {
      id: 2,
      name: 'Code Generation',
      description: 'Python, JavaScript, SQL code generation tasks',
      tasks: ['python', 'javascript', 'sql'],
      cases: 1800,
      lastScore: 0.912,
      prevScore: 0.898,
      status: 'passed',
      lastRun: '3 hours ago'
    },
    {
      id: 3,
      name: 'Reasoning Tasks',
      description: 'Math, logic, and commonsense reasoning',
      tasks: ['math', 'logic', 'commonsense'],
      cases: 3200,
      lastScore: 0.723,
      prevScore: 0.756,
      status: 'warning',
      lastRun: '5 hours ago'
    },
    {
      id: 4,
      name: 'Summarization',
      description: 'Document and article summarization',
      tasks: ['news', 'academic', 'dialog'],
      cases: 1200,
      lastScore: 0.889,
      prevScore: 0.885,
      status: 'passed',
      lastRun: '1 day ago'
    },
    {
      id: 5,
      name: 'Translation (KO↔EN)',
      description: 'Korean-English bidirectional translation',
      tasks: ['ko-en', 'en-ko'],
      cases: 2000,
      lastScore: 0.934,
      prevScore: 0.921,
      status: 'passed',
      lastRun: '1 day ago'
    },
  ];

  const evalResults = [
    { task: 'Trivia QA', score: 0.89, baseline: 0.85, change: '+4.7%' },
    { task: 'HumanEval (Code)', score: 0.68, baseline: 0.62, change: '+9.7%' },
    { task: 'GSM8K (Math)', score: 0.72, baseline: 0.78, change: '-7.7%' },
    { task: 'TruthfulQA', score: 0.54, baseline: 0.51, change: '+5.9%' },
    { task: 'MMLU', score: 0.71, baseline: 0.69, change: '+2.9%' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed': return 'badge-emerald';
      case 'failed': return 'badge-rose';
      case 'warning': return 'badge-amber';
      default: return 'badge-slate';
    }
  };

  const getTrend = (current: number, prev: number) => {
    const diff = ((current - prev) / prev) * 100;
    if (diff > 0) return { icon: TrendingUp, color: 'text-emerald-400', text: `+${diff.toFixed(1)}%` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-rose-400', text: `${diff.toFixed(1)}%` };
    return { icon: Minus, color: 'text-slate-400', text: '0%' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evaluation Suites</h1>
          <p className="text-slate-400 mt-1">LLM 평가 스위트 관리 및 실행</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Play className="w-4 h-4" />
            Run All
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            New Suite
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-sm text-slate-400">Eval Suites</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">10.7K</p>
          <p className="text-sm text-slate-400">Total Cases</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-emerald-400">4</p>
          <p className="text-sm text-slate-400">Passed</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-amber-400">1</p>
          <p className="text-sm text-slate-400">Warnings</p>
        </div>
      </div>

      {/* Eval Suites Grid */}
      <div className="grid grid-cols-2 gap-4">
        {evalSuites.map((suite, index) => {
          const trend = getTrend(suite.lastScore, suite.prevScore);
          return (
            <div 
              key={suite.id}
              className="glass-card p-5 hover:border-brand-500/30 transition-all cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(suite.status)}
                  <div>
                    <h3 className="font-semibold text-white">{suite.name}</h3>
                    <p className="text-sm text-slate-400">{suite.description}</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {suite.tasks.map((task, i) => (
                  <span key={i} className="badge badge-slate text-xs">{task}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">{(suite.lastScore * 100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                  <div className={`flex items-center gap-1 ${trend.color}`}>
                    <trend.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{trend.text}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">{suite.cases.toLocaleString()} cases</p>
                  <p className="text-xs text-slate-500">{suite.lastRun}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Results Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Latest Evaluation Results</h2>
          <button className="btn-ghost text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-700/50">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Score</th>
                <th>Baseline</th>
                <th>Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {evalResults.map((result, index) => (
                <tr key={index}>
                  <td className="font-medium text-slate-200">{result.task}</td>
                  <td className="font-mono text-white">{result.score.toFixed(2)}</td>
                  <td className="font-mono text-slate-400">{result.baseline.toFixed(2)}</td>
                  <td className={`font-mono ${result.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.change}
                  </td>
                  <td>
                    {result.change.startsWith('+') ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
