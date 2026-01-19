import { 
  Globe,
  Plus,
  Search,
  Play,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Image,
  Video,
  MessageSquare,
  Zap,
  Shield,
  MoreVertical,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

export function Endpoints() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>('ep-001');

  const endpoints = [
    {
      id: 'ep-001',
      name: 'vlm-image-qa',
      url: 'https://api.ai-ops.dev/v1/vlm/image-qa',
      model: 'vlm-instruct-v2.1',
      type: 'Image Q&A',
      status: 'active',
      instances: 4,
      qps: 120,
      latencyP50: '450ms',
      latencyP99: '1.2s',
      inputLimits: {
        maxResolution: '1920x1080',
        maxFrames: 32,
        maxDuration: '5min',
      },
      routing: {
        canary: 10,
        fallback: 'vlm-instruct-v2.0',
      },
    },
    {
      id: 'ep-002',
      name: 'video-summarize',
      url: 'https://api.ai-ops.dev/v1/video/summarize',
      model: 'video-qa-v1.3',
      type: 'Video Summary',
      status: 'active',
      instances: 2,
      qps: 45,
      latencyP50: '2.1s',
      latencyP99: '4.5s',
      inputLimits: {
        maxResolution: '1080p',
        maxFrames: 64,
        maxDuration: '10min',
      },
      routing: {
        canary: 0,
        fallback: null,
      },
    },
    {
      id: 'ep-003',
      name: 'multimodal-chat',
      url: 'https://api.ai-ops.dev/v1/chat/multimodal',
      model: 'vlm-instruct-v2.1',
      type: 'Multimodal Chat',
      status: 'degraded',
      instances: 6,
      qps: 200,
      latencyP50: '800ms',
      latencyP99: '2.8s',
      inputLimits: {
        maxResolution: '1920x1080',
        maxFrames: 16,
        maxDuration: '3min',
      },
      routing: {
        canary: 5,
        fallback: 'vlm-instruct-v2.0',
      },
    },
  ];

  const selectedData = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            Endpoints
          </h1>
          <p className="text-slate-400 mt-1">Image Q&A, Video Summary, Multimodal Chat 배포</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Endpoint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 엔드포인트 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {endpoints.map((ep) => (
            <div 
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep.id)}
              className={`glass-card p-4 cursor-pointer transition-all ${
                selectedEndpoint === ep.id ? 'border-emerald-500/50' : 'hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  {ep.type === 'Image Q&A' && <Image className="w-6 h-6 text-violet-400" />}
                  {ep.type === 'Video Summary' && <Video className="w-6 h-6 text-cyan-400" />}
                  {ep.type === 'Multimodal Chat' && <MessageSquare className="w-6 h-6 text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-200">{ep.name}</span>
                    <span className={`flex items-center gap-1 text-sm ${
                      ep.status === 'active' ? 'text-emerald-400' :
                      ep.status === 'degraded' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {ep.status === 'active' && <CheckCircle className="w-4 h-4" />}
                      {ep.status === 'degraded' && <AlertTriangle className="w-4 h-4" />}
                      {ep.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mb-2">{ep.url}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{ep.model}</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {ep.qps} QPS
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      P50: {ep.latencyP50}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-700 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 상세 패널 */}
        <div className="glass-card p-6 h-fit sticky top-6">
          {selectedData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">{selectedData.name}</h3>
                <button className="btn-ghost text-sm">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* URL */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Endpoint URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-slate-300 bg-slate-800 p-2 rounded truncate">
                      {selectedData.url}
                    </code>
                    <button className="p-2 hover:bg-slate-700 rounded">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Input Limits */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Input Limits</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Resolution</span>
                      <span className="text-slate-200">{selectedData.inputLimits.maxResolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Frames</span>
                      <span className="text-slate-200">{selectedData.inputLimits.maxFrames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Duration</span>
                      <span className="text-slate-200">{selectedData.inputLimits.maxDuration}</span>
                    </div>
                  </div>
                </div>

                {/* Routing */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Routing</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Canary %</span>
                      <span className="text-slate-200">{selectedData.routing.canary}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fallback</span>
                      <span className="text-slate-200">{selectedData.routing.fallback || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Metrics</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-lg font-bold text-emerald-400">{selectedData.qps}</p>
                      <p className="text-xs text-slate-500">QPS</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-lg font-bold text-cyan-400">{selectedData.instances}</p>
                      <p className="text-xs text-slate-500">Instances</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-lg font-bold text-violet-400">{selectedData.latencyP50}</p>
                      <p className="text-xs text-slate-500">P50 Latency</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                      <p className="text-lg font-bold text-amber-400">{selectedData.latencyP99}</p>
                      <p className="text-xs text-slate-500">P99 Latency</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                  <button className="btn-secondary flex-1">
                    <Play className="w-4 h-4" />
                    Test
                  </button>
                  <button className="btn-ghost flex-1">
                    <ExternalLink className="w-4 h-4" />
                    Docs
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an endpoint to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
