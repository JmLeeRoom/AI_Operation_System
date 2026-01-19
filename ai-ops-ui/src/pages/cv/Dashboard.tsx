import { 
  TrendingUp, 
  Target, 
  Database, 
  AlertTriangle,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Image,
  Tag,
  ArrowRight,
  BarChart3,
  Zap
} from 'lucide-react';

export function CVDashboard() {
  // 샘플 데이터
  const kpiData = [
    { 
      label: 'Training Success Rate', 
      value: '94.2%', 
      change: '+2.1%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald'
    },
    { 
      label: 'Latest mAP@0.5', 
      value: '0.847', 
      change: '+0.023', 
      trend: 'up',
      icon: Target,
      color: 'cyan'
    },
    { 
      label: 'Dataset Growth', 
      value: '+12,450', 
      change: 'this week', 
      trend: 'neutral',
      icon: Database,
      color: 'violet'
    },
    { 
      label: 'Active Alerts', 
      value: '3', 
      change: '2 critical', 
      trend: 'down',
      icon: AlertTriangle,
      color: 'amber'
    },
  ];

  const recentRuns = [
    { id: 'run-001', name: 'YOLOv8-Detection-v3', type: 'Training', status: 'completed', mAP: '0.847', duration: '2h 34m', time: '10 mins ago' },
    { id: 'run-002', name: 'ResNet50-Classification', type: 'Training', status: 'running', mAP: '-', duration: '1h 12m', time: '45 mins ago' },
    { id: 'run-003', name: 'UNet-Segmentation-v2', type: 'Evaluation', status: 'completed', mAP: '0.912', duration: '15m', time: '1 hour ago' },
    { id: 'run-004', name: 'MaskRCNN-Instance', type: 'Training', status: 'failed', mAP: '-', duration: '45m', time: '2 hours ago' },
    { id: 'run-005', name: 'EfficientNet-B4', type: 'Deployment', status: 'completed', mAP: '0.891', duration: '5m', time: '3 hours ago' },
  ];

  const labelingQueue = [
    { id: 1, thumbnail: '/placeholder.jpg', uncertainty: 0.89, reason: 'High entropy', class: 'Vehicle' },
    { id: 2, thumbnail: '/placeholder.jpg', uncertainty: 0.85, reason: 'Low margin', class: 'Person' },
    { id: 3, thumbnail: '/placeholder.jpg', uncertainty: 0.82, reason: 'Near boundary', class: 'Traffic Sign' },
    { id: 4, thumbnail: '/placeholder.jpg', uncertainty: 0.79, reason: 'Occlusion', class: 'Vehicle' },
    { id: 5, thumbnail: '/placeholder.jpg', uncertainty: 0.76, reason: 'Small object', class: 'Person' },
  ];

  const qualityAlerts = [
    { id: 1, type: 'critical', message: 'Label distribution shift detected in Dataset v2.3', time: '5 mins ago' },
    { id: 2, type: 'warning', message: '23 images missing annotations in "street-scene-batch-42"', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'New class "Bicycle" added but has < 100 samples', time: '2 hours ago' },
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
      pending: 'badge-slate',
    };
    return styles[status] || 'badge-slate';
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            Computer Vision Dashboard
          </h1>
          <p className="text-slate-400 mt-1">프로젝트 현황 및 주요 지표 모니터링</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <BarChart3 className="w-4 h-4" />
            View Reports
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
              {kpi.trend === 'down' && (
                <span className="text-xs text-rose-400 font-medium">{kpi.change}</span>
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

      {/* 메인 컨텐츠 그리드 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 최근 Runs */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-brand-400" />
              Recent Runs
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
                  <th>mAP</th>
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
                      <span className={`badge ${run.type === 'Training' ? 'badge-violet' : run.type === 'Evaluation' ? 'badge-cyan' : 'badge-emerald'}`}>
                        {run.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(run.status)}`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="font-mono text-slate-300">{run.mAP}</td>
                    <td className="text-slate-400">{run.duration}</td>
                    <td className="text-slate-500 text-sm">{run.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 데이터 품질 경고 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Quality Alerts
            </h2>
            <span className="badge badge-amber">3 Active</span>
          </div>
          
          <div className="space-y-3">
            {qualityAlerts.map((alert) => (
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

      {/* Active Learning Queue */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-violet-400" />
            Active Learning Queue
            <span className="text-sm font-normal text-slate-400 ml-2">
              추천 라벨링 샘플 (불확실도 기반)
            </span>
          </h2>
          <button className="btn-primary">
            Send to Labeling
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {labelingQueue.map((item) => (
            <div 
              key={item.id}
              className="group relative rounded-lg overflow-hidden border border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer"
            >
              {/* 썸네일 플레이스홀더 */}
              <div className="aspect-square bg-slate-800 flex items-center justify-center">
                <Image className="w-12 h-12 text-slate-600" />
              </div>
              
              {/* 오버레이 정보 */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-violet-400 font-medium">Uncertainty: {item.uncertainty.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{item.reason}</p>
                </div>
              </div>

              {/* 하단 정보 */}
              <div className="p-3 bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="badge badge-violet text-xs">{item.class}</span>
                  <span className="text-xs text-slate-500">#{item.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
