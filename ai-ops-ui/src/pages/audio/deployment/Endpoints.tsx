import { 
  Radio,
  Plus,
  Settings,
  Play,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mic,
  Speaker,
  Headphones,
  Clock,
  Zap,
  Shield,
  Copy
} from 'lucide-react';
import { useState } from 'react';

export function AudioEndpoints() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(1);

  const endpoints = [
    {
      id: 1,
      name: 'ASR Streaming API',
      type: 'asr',
      model: 'Conformer-ASR-v3',
      status: 'healthy',
      streaming: true,
      config: {
        chunkSize: '640ms',
        language: 'Korean',
        partialResults: true,
      },
      metrics: {
        latency: '180ms',
        rtf: 0.35,
        qps: 45.2,
        uptime: '99.9%',
      },
    },
    {
      id: 2,
      name: 'TTS Synthesis API',
      type: 'tts',
      model: 'VITS-v2.1',
      status: 'healthy',
      streaming: false,
      config: {
        voices: ['Speaker_A', 'Speaker_B'],
        caching: true,
        maxLength: '500 chars',
      },
      metrics: {
        latency: '95ms',
        rtf: 0.12,
        qps: 128.5,
        uptime: '99.8%',
      },
    },
    {
      id: 3,
      name: 'Voice Clone API',
      type: 'vc',
      model: 'So-VITS-SVC-v1',
      status: 'degraded',
      streaming: false,
      config: {
        targetSpeakers: 4,
        watermark: true,
        authRequired: true,
      },
      metrics: {
        latency: '450ms',
        rtf: 0.85,
        qps: 8.2,
        uptime: '98.5%',
      },
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'asr': return <Mic className="w-5 h-5" />;
      case 'tts': return <Speaker className="w-5 h-5" />;
      case 'vc': return <Headphones className="w-5 h-5" />;
      default: return <Radio className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'asr': return 'from-cyan-500 to-blue-600';
      case 'tts': return 'from-violet-500 to-purple-600';
      case 'vc': return 'from-amber-500 to-orange-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'badge-emerald';
      case 'degraded': return 'badge-amber';
      case 'unhealthy': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'unhealthy': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const selected = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            Audio Serving Endpoints
          </h1>
          <p className="text-slate-400 mt-1">ASR, TTS, VC 서빙 엔드포인트 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Deploy New
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Endpoint List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Endpoints</h2>
          
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <div 
                key={endpoint.id}
                onClick={() => setSelectedEndpoint(endpoint.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedEndpoint === endpoint.id 
                    ? 'bg-brand-500/20 border border-brand-500/50' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTypeColor(endpoint.type)} flex items-center justify-center`}>
                      {getTypeIcon(endpoint.type)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{endpoint.name}</p>
                      <p className="text-xs text-slate-500">{endpoint.model}</p>
                    </div>
                  </div>
                  {getStatusIcon(endpoint.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Latency: {endpoint.metrics.latency}</span>
                  <span>QPS: {endpoint.metrics.qps}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoint Detail */}
        <div className="col-span-2 space-y-6">
          {selected && (
            <>
              {/* Status & Metrics */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(selected.type)} flex items-center justify-center`}>
                      {getTypeIcon(selected.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selected.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-400">{selected.model}</span>
                        {selected.streaming && <span className="badge badge-cyan text-xs">Streaming</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadge(selected.status)} capitalize`}>
                    {getStatusIcon(selected.status)}
                    {selected.status}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                    <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">{selected.metrics.latency}</p>
                    <p className="text-xs text-slate-500">Latency</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                    <Zap className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                    <p className={`text-xl font-bold ${selected.metrics.rtf < 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selected.metrics.rtf}x
                    </p>
                    <p className="text-xs text-slate-500">RTF</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                    <Radio className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">{selected.metrics.qps}</p>
                    <p className="text-xs text-slate-500">QPS</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">{selected.metrics.uptime}</p>
                    <p className="text-xs text-slate-500">Uptime</p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-400" />
                    Configuration
                  </h2>
                  <button className="btn-ghost text-sm">Edit</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selected.config).map(([key, value]) => (
                    <div key={key} className="p-3 bg-slate-800/30 rounded-lg">
                      <p className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-slate-200 font-medium">
                        {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : 
                         Array.isArray(value) ? value.join(', ') : value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* API Endpoint */}
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">API Endpoint</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-slate-800 rounded text-sm text-cyan-400 font-mono">
                      https://api.ai-ops.example.com/v1/{selected.type}
                    </code>
                    <button className="btn-ghost p-2">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                  Restart
                </button>
                <button className="btn-secondary">
                  <Settings className="w-4 h-4" />
                  Scale
                </button>
                <button className="btn-ghost text-rose-400">
                  Stop Endpoint
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
