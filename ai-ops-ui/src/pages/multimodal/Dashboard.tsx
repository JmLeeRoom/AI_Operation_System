import { 
  Layers, 
  Image, 
  Video, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  DollarSign,
  ShieldCheck,
  Eye,
  Brain,
  Link2
} from 'lucide-react';

export function Dashboard() {
  const modelVersions = [
    { name: 'VLM-Instruct-v2.1', stage: 'Production', modality: 'Image+Text', updated: '2일 전' },
    { name: 'VideoQA-v1.3', stage: 'Staging', modality: 'Video+Text', updated: '5일 전' },
    { name: 'CLIP-Custom-v3', stage: 'Production', modality: 'Contrastive', updated: '1주 전' },
  ];

  const recentRuns = [
    { id: 'vlm-train-047', type: 'VLM SFT', status: 'completed', duration: '4h 32m', accuracy: '89.2%' },
    { id: 'clip-pretrain-012', type: 'Contrastive', status: 'running', duration: '12h 15m', progress: '67%' },
    { id: 'video-ft-008', type: 'Video Finetune', status: 'queued', duration: '-', progress: '-' },
  ];

  const pairingStats = [
    { label: 'Image-Text Pairs', count: '1.2M', quality: 98.5 },
    { label: 'Video-Text Pairs', count: '45K', quality: 95.2 },
    { label: 'Audio-Text Pairs', count: '320K', quality: 97.8 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            Multimodal Dashboard
          </h1>
          <p className="text-slate-400 mt-1">VLM, Video Understanding, Multimodal Agents 현황</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-violet">
            <Eye className="w-3 h-3" />
            VLM Active
          </span>
          <span className="badge badge-cyan">
            <Video className="w-3 h-3" />
            Video Pipeline
          </span>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">총 페어 데이터</span>
            <Link2 className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">1.57M</p>
          <p className="text-sm text-emerald-400 mt-1">+12.5K 이번 주</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">페어링 품질</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">97.8%</p>
          <p className="text-sm text-slate-500 mt-1">Mismatch Rate: 2.2%</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">비용 (이번 달)</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">$4,280</p>
          <div className="flex gap-2 mt-1 text-xs">
            <span className="text-cyan-400">Frames: $2.1K</span>
            <span className="text-violet-400">Tokens: $1.8K</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">안전성 테스트</span>
            <ShieldCheck className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">98.2%</p>
          <p className="text-sm text-emerald-400 mt-1">All gates passed</p>
        </div>
      </div>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 모델 버전/스테이지 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            Model Versions
          </h2>
          <div className="space-y-3">
            {modelVersions.map((model, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{model.name}</span>
                  <span className={`badge ${model.stage === 'Production' ? 'badge-emerald' : 'badge-amber'}`}>
                    {model.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{model.modality}</span>
                  <span className="text-slate-500">{model.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 데이터 페어링 품질 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            Data Pairing Quality
          </h2>
          <div className="space-y-4">
            {pairingStats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">{stat.label}</span>
                  <span className="text-slate-400 text-sm">{stat.count}</span>
                </div>
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                    style={{ width: `${stat.quality}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">{stat.quality}% matched</p>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 학습/평가 현황 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Recent Runs
          </h2>
          <div className="space-y-3">
            {recentRuns.map((run, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-slate-300">{run.id}</span>
                  <span className={`badge ${
                    run.status === 'completed' ? 'badge-emerald' : 
                    run.status === 'running' ? 'badge-cyan' : 'badge-slate'
                  }`}>
                    {run.status === 'running' && <span className="status-dot online mr-1" />}
                    {run.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{run.type}</span>
                  <span>{run.status === 'completed' ? run.accuracy : run.progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 비용 분석 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Cost Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-800/30">
              <Image className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-slate-100">12.5M</p>
              <p className="text-xs text-slate-500">Frames processed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/30">
              <FileText className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-slate-100">8.2M</p>
              <p className="text-xs text-slate-500">Tokens generated</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/30">
              <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-slate-100">156h</p>
              <p className="text-xs text-slate-500">GPU hours</p>
            </div>
          </div>
        </div>

        {/* 안전성/정책 테스트 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            Safety & Policy Gates
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">Hallucination Detection</span>
              </div>
              <span className="text-emerald-400 font-medium">PASS</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">Grounding Consistency</span>
              </div>
              <span className="text-emerald-400 font-medium">PASS</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300">Content Safety</span>
              </div>
              <span className="text-amber-400 font-medium">1 Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
