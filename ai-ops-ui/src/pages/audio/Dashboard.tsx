import { 
  AudioWaveform,
  Mic,
  Speaker,
  Music,
  TrendingUp,
  AlertTriangle,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Zap,
  Activity,
  Volume2,
  Radio,
  Headphones
} from 'lucide-react';

export function AudioDashboard() {
  const kpiData = [
    { 
      label: 'ASR WER', 
      value: '4.2%', 
      change: '-0.3%', 
      trend: 'up',
      icon: Mic,
      color: 'emerald'
    },
    { 
      label: 'TTS MOS', 
      value: '4.21', 
      change: '+0.08', 
      trend: 'up',
      icon: Speaker,
      color: 'cyan'
    },
    { 
      label: 'Streaming RTF', 
      value: '0.35x', 
      change: 'Healthy', 
      trend: 'neutral',
      icon: Radio,
      color: 'violet'
    },
    { 
      label: 'Audio Hours', 
      value: '2,450', 
      change: '+120h', 
      trend: 'up',
      icon: Volume2,
      color: 'amber'
    },
  ];

  const recentRuns = [
    { id: 'run-001', name: 'Conformer-ASR-v3', type: 'ASR', status: 'completed', wer: '4.2%', duration: '8h 45m', time: '1 hour ago' },
    { id: 'run-002', name: 'VITS-TTS-Korean', type: 'TTS', status: 'running', wer: '-', duration: '4h 30m', time: '2 hours ago' },
    { id: 'run-003', name: 'VC-Speaker-Clone', type: 'VC', status: 'completed', wer: '-', duration: '2h 15m', time: '5 hours ago' },
    { id: 'run-004', name: 'MusicGen-Eval', type: 'Music', status: 'completed', wer: '-', duration: '1h 20m', time: '8 hours ago' },
    { id: 'run-005', name: 'ASR-Streaming-Test', type: 'ASR', status: 'failed', wer: '-', duration: '30m', time: '12 hours ago' },
  ];

  const qualityAlerts = [
    { id: 1, type: 'warning', message: 'Clipping detected in 15 audio files from latest batch', time: '30 mins ago' },
    { id: 2, type: 'info', message: 'New speaker profile "Speaker_042" added to VC dataset', time: '2 hours ago' },
    { id: 3, type: 'warning', message: 'Low SNR (<10dB) in 8% of new uploads', time: '4 hours ago' },
  ];

  const endpointStatus = [
    { name: 'ASR Streaming API', status: 'healthy', latency: '180ms', qps: 45.2, rtf: 0.35 },
    { name: 'TTS Synthesis API', status: 'healthy', latency: '95ms', qps: 128.5, rtf: 0.12 },
    { name: 'Voice Clone API', status: 'degraded', latency: '450ms', qps: 8.2, rtf: 0.85 },
  ];

  const dataBreakdown = [
    { type: 'ASR (Korean)', hours: 1250, percentage: 51 },
    { type: 'ASR (English)', hours: 680, percentage: 28 },
    { type: 'TTS Pairs', hours: 320, percentage: 13 },
    { type: 'Music Clips', hours: 200, percentage: 8 },
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
      healthy: 'badge-emerald',
      degraded: 'badge-amber',
    };
    return styles[status] || 'badge-slate';
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      ASR: 'badge-cyan',
      TTS: 'badge-violet',
      VC: 'badge-amber',
      Music: 'badge-rose',
    };
    return styles[type] || 'badge-slate';
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <AudioWaveform className="w-5 h-5 text-white" />
            </div>
            Speech / Audio Dashboard
          </h1>
          <p className="text-slate-400 mt-1">ASR, TTS, 음성 변환, 음악 생성 현황</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Mic className="w-4 h-4" />
            ASR Playground
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
              Recent Audio Jobs
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
                  <th>Metric</th>
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
                      <span className={`badge ${getTypeBadge(run.type)}`}>
                        {run.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(run.status)}`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="font-mono text-slate-300">{run.wer}</td>
                    <td className="text-slate-400">{run.duration}</td>
                    <td className="text-slate-500 text-sm">{run.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Quality Alerts
            </h2>
            <span className="badge badge-amber">3 New</span>
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

      {/* 하단 그리드 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Endpoint Status */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              Serving Endpoints
            </h2>
            <button className="btn-ghost text-sm">Manage</button>
          </div>

          <div className="space-y-3">
            {endpointStatus.map((endpoint, index) => (
              <div 
                key={index}
                className="p-4 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-200">{endpoint.name}</p>
                  <span className={`badge ${getStatusBadge(endpoint.status)} capitalize`}>
                    {endpoint.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500">Latency:</span>
                    <span className="text-slate-200 ml-1">{endpoint.latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">QPS:</span>
                    <span className="text-slate-200 ml-1">{endpoint.qps}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">RTF:</span>
                    <span className={`ml-1 ${endpoint.rtf < 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {endpoint.rtf}x
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Breakdown */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-violet-400" />
              Audio Data Breakdown
            </h2>
            <span className="text-lg font-bold text-white">2,450 hrs</span>
          </div>

          <div className="space-y-4">
            {dataBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{item.type}</span>
                  <span className="text-sm text-slate-400">{item.hours}h</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-cyan-500' : 
                      index === 1 ? 'bg-emerald-500' : 
                      index === 2 ? 'bg-violet-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Total Segments:</span>
              <span className="text-slate-200 ml-2">1.2M</span>
            </div>
            <div>
              <span className="text-slate-500">Avg. Duration:</span>
              <span className="text-slate-200 ml-2">8.5s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
