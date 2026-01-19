import { 
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Volume2,
  Radio,
  ThumbsDown,
  RefreshCw,
  Bell,
  Eye,
  Send
} from 'lucide-react';
import { useState } from 'react';

export function AudioMonitoring() {
  const [timeRange, setTimeRange] = useState('24h');

  const realtimeMetrics = {
    rtf: { value: 0.35, trend: 'down', change: -0.02 },
    latency: { value: '180ms', trend: 'stable', change: '+5ms' },
    errorRate: { value: '0.12%', trend: 'up', change: '+0.05%' },
    throughput: { value: '45.2 qps', trend: 'up', change: '+2.1' },
  };

  const qualityDrift = [
    { metric: 'SNR (avg)', current: 18.5, baseline: 20.0, status: 'warning' },
    { metric: 'Clipping Rate', current: '2.1%', baseline: '1.0%', status: 'warning' },
    { metric: 'Silence Ratio', current: '8%', baseline: '10%', status: 'normal' },
    { metric: 'Duration (avg)', current: '8.2s', baseline: '8.5s', status: 'normal' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'ASR latency spike detected (>300ms)', time: '10 mins ago', resolved: false },
    { id: 2, type: 'info', message: 'TTS cache hit rate dropped to 75%', time: '30 mins ago', resolved: false },
    { id: 3, type: 'critical', message: 'VC endpoint high RTF (>1.0x)', time: '1 hour ago', resolved: true },
    { id: 4, type: 'warning', message: 'Input audio quality degradation (low SNR)', time: '2 hours ago', resolved: true },
  ];

  const feedbackQueue = [
    { id: 1, type: 'asr', issue: 'Incorrect transcription', sample: 'call_2024_001.wav', time: '5 mins ago' },
    { id: 2, type: 'tts', issue: 'Unnatural prosody', sample: 'tts_output_042.wav', time: '15 mins ago' },
    { id: 3, type: 'asr', issue: 'Missed words', sample: 'stream_session_088.wav', time: '1 hour ago' },
  ];

  const getAlertStyle = (type: string, resolved: boolean) => {
    if (resolved) return 'border-slate-600 bg-slate-800/30 opacity-60';
    switch (type) {
      case 'critical': return 'border-rose-500/50 bg-rose-500/10';
      case 'warning': return 'border-amber-500/50 bg-amber-500/10';
      default: return 'border-cyan-500/50 bg-cyan-500/10';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'warning': return 'badge-amber';
      case 'critical': return 'badge-rose';
      default: return 'badge-emerald';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Audio Monitoring & Feedback
          </h1>
          <p className="text-slate-400 mt-1">실시간 성능 모니터링 및 피드백 큐</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="input-field py-2 text-sm w-32"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last 1h</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
          </select>
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Realtime Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Real-Time Factor</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {realtimeMetrics.rtf.change}
            </span>
          </div>
          <p className={`text-3xl font-bold ${realtimeMetrics.rtf.value < 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {realtimeMetrics.rtf.value}x
          </p>
          <p className="text-xs text-slate-500 mt-1">Lower is better</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Latency (P95)</p>
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {realtimeMetrics.latency.change}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{realtimeMetrics.latency.value}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Error Rate</p>
            <span className="text-xs text-rose-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {realtimeMetrics.errorRate.change}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{realtimeMetrics.errorRate.value}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Throughput</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {realtimeMetrics.throughput.change}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{realtimeMetrics.throughput.value}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Quality Drift */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-violet-400" />
            Audio Quality Drift
          </h2>

          <div className="space-y-3">
            {qualityDrift.map((metric, idx) => (
              <div key={idx} className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">{metric.metric}</span>
                  <span className={`badge ${getStatusBadge(metric.status)} text-xs`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Current: <span className={metric.status === 'warning' ? 'text-amber-400' : 'text-white'}>{metric.current}</span></span>
                  <span className="text-slate-500">Baseline: <span className="text-slate-300">{metric.baseline}</span></span>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-ghost w-full mt-4">
            View Full Report
          </button>
        </div>

        {/* Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Alerts
            </h2>
            <span className="badge badge-amber">{alerts.filter(a => !a.resolved).length} active</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertStyle(alert.type, alert.resolved)}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className={`text-sm ${alert.resolved ? 'text-slate-400' : 'text-slate-200'}`}>
                    {alert.message}
                  </p>
                  {!alert.resolved && (
                    <button className="btn-ghost p-1 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{alert.time}</span>
                  {alert.resolved && <span className="text-slate-500">Resolved</span>}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-secondary w-full mt-4">
            Configure Alerts
          </button>
        </div>

        {/* Feedback Queue */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-rose-400" />
              Feedback Queue
            </h2>
            <span className="badge badge-rose">{feedbackQueue.length} items</span>
          </div>

          <div className="space-y-3">
            {feedbackQueue.map((item) => (
              <div key={item.id} className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`badge ${item.type === 'asr' ? 'badge-cyan' : 'badge-violet'} text-xs uppercase`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="text-sm text-slate-200 mb-1">{item.issue}</p>
                <p className="text-xs text-slate-500 font-mono">{item.sample}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="btn-ghost text-xs py-1">Review</button>
                  <button className="btn-ghost text-xs py-1">
                    <Send className="w-3 h-3" />
                    To Labeling
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <button className="btn-primary w-full">
              Process All → Retrain Queue
            </button>
          </div>
        </div>
      </div>

      {/* Latency Breakdown (Placeholder) */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Latency Breakdown</h2>
        <div className="h-48 bg-slate-800/30 rounded-lg flex items-center justify-center">
          <p className="text-slate-500">Latency breakdown chart placeholder</p>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {[
            { name: 'Audio Decode', value: '15ms' },
            { name: 'Preprocessing', value: '25ms' },
            { name: 'Inference', value: '120ms' },
            { name: 'Postprocessing', value: '10ms' },
            { name: 'Network', value: '10ms' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="text-lg font-bold text-white">{item.value}</p>
              <p className="text-xs text-slate-500">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
