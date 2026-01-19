import { 
  MessageSquare,
  TrendingUp,
  Shield,
  Database,
  DollarSign,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Zap,
  BookOpen,
  AlertTriangle,
  Bot,
  FileText
} from 'lucide-react';

export function LLMDashboard() {
  const kpiData = [
    { 
      label: 'Model Accuracy', 
      value: '91.3%', 
      change: '+1.8%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald'
    },
    { 
      label: 'Safety Pass Rate', 
      value: '98.7%', 
      change: '+0.5%', 
      trend: 'up',
      icon: Shield,
      color: 'cyan'
    },
    { 
      label: 'RAG Index Status', 
      value: 'Updated', 
      change: '2h ago', 
      trend: 'neutral',
      icon: Database,
      color: 'violet'
    },
    { 
      label: 'Token Cost (24h)', 
      value: '$127.45', 
      change: '-12%', 
      trend: 'up',
      icon: DollarSign,
      color: 'amber'
    },
  ];

  const recentRuns = [
    { id: 'run-001', name: 'Llama-3-8B-SFT-v2', type: 'SFT', status: 'completed', loss: '1.234', duration: '4h 12m', time: '30 mins ago' },
    { id: 'run-002', name: 'Qwen-7B-LoRA-Chat', type: 'LoRA', status: 'running', loss: '1.456', duration: '2h 45m', time: '1 hour ago' },
    { id: 'run-003', name: 'Mistral-7B-DPO', type: 'DPO', status: 'completed', loss: '0.892', duration: '6h 30m', time: '3 hours ago' },
    { id: 'run-004', name: 'GPT-Eval-Suite', type: 'Eval', status: 'completed', loss: '-', duration: '45m', time: '5 hours ago' },
    { id: 'run-005', name: 'RAG-Index-Update', type: 'Index', status: 'failed', loss: '-', duration: '15m', time: '6 hours ago' },
  ];

  const safetyAlerts = [
    { id: 1, type: 'warning', message: 'Jailbreak attempt detected: 3 blocked in last hour', time: '15 mins ago' },
    { id: 2, type: 'info', message: 'Policy test passed for model v2.3 deployment', time: '2 hours ago' },
    { id: 3, type: 'warning', message: 'PII detection triggered: review required', time: '4 hours ago' },
  ];

  const modelStages = [
    { name: 'Llama-3-8B-Chat-v2', stage: 'production', version: 'v2.3', requests: '12.4k/day' },
    { name: 'Qwen-7B-Code', stage: 'staging', version: 'v1.5', requests: '2.1k/day' },
    { name: 'Mistral-7B-RAG', stage: 'development', version: 'v0.8', requests: '340/day' },
  ];

  const costBreakdown = [
    { category: 'Training (GPU)', amount: 89.20, percentage: 70 },
    { category: 'Inference (Tokens)', amount: 28.45, percentage: 22 },
    { category: 'RAG (Embeddings)', amount: 9.80, percentage: 8 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'running': return <Play className="w-4 h-4 text-cyan-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'badge-emerald',
      running: 'badge-cyan',
      failed: 'badge-rose',
    };
    return styles[status] || 'badge-slate';
  };

  const getStageBadge = (stage: string) => {
    const styles: Record<string, string> = {
      production: 'badge-emerald',
      staging: 'badge-amber',
      development: 'badge-cyan',
    };
    return styles[stage] || 'badge-slate';
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'border-rose-500/50 bg-rose-500/10';
      case 'warning': return 'border-amber-500/50 bg-amber-500/10';
      default: return 'border-cyan-500/50 bg-cyan-500/10';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            LLM Dashboard
          </h1>
          <p className="text-slate-400 mt-1">언어 모델 학습, 평가, RAG, 에이전트 현황</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <BookOpen className="w-4 h-4" />
            RAG Playground
          </button>
          <button className="btn-primary">
            <Zap className="w-4 h-4" />
            New Training
          </button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div 
            key={index}
            className="stat-card hover:border-brand-500/30 transition-all"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${kpi.color}-500/20 flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
              </div>
              {kpi.trend === 'up' && (
                <span className="text-xs text-emerald-400 font-medium">{kpi.change}</span>
              )}
              {kpi.trend === 'neutral' && (
                <span className="text-xs text-slate-400">{kpi.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-slate-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 최근 Runs */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-brand-400" />
              Recent Training & Jobs
            </h2>
            <button className="btn-ghost text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-slate-700/50">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Run Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Loss</th>
                  <th>Duration</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id} className="cursor-pointer">
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        <span className="font-medium text-slate-200">{run.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        run.type === 'SFT' ? 'badge-violet' : 
                        run.type === 'LoRA' ? 'badge-cyan' : 
                        run.type === 'DPO' ? 'badge-amber' :
                        run.type === 'Eval' ? 'badge-emerald' : 'badge-slate'
                      }`}>
                        {run.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(run.status)}`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="font-mono text-slate-300">{run.loss}</td>
                    <td className="text-slate-400">{run.duration}</td>
                    <td className="text-slate-500 text-sm">{run.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Safety & Policy
            </h2>
            <span className="badge badge-emerald">98.7% Pass</span>
          </div>
          
          <div className="space-y-3">
            {safetyAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertStyle(alert.type)} cursor-pointer hover:scale-[1.02] transition-transform`}
              >
                <p className="text-sm text-slate-200 leading-relaxed">{alert.message}</p>
                <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 그리드 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Model Stages */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              Model Stages
            </h2>
            <button className="btn-ghost text-sm">Manage</button>
          </div>

          <div className="space-y-3">
            {modelStages.map((model, index) => (
              <div 
                key={index}
                className="p-4 bg-slate-800/30 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-200">{model.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{model.version} • {model.requests}</p>
                </div>
                <span className={`badge ${getStageBadge(model.stage)} capitalize`}>
                  {model.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              Cost Breakdown (24h)
            </h2>
            <span className="text-lg font-bold text-white">$127.45</span>
          </div>

          <div className="space-y-4">
            {costBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{item.category}</span>
                  <span className="text-sm text-slate-400">${item.amount.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-violet-500' : 
                      index === 1 ? 'bg-cyan-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm">
            <span className="text-slate-400">Token Usage</span>
            <span className="text-slate-200">2.4M tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
}
