import { 
  Layers,
  Plus,
  Play,
  Eye,
  Image,
  Video,
  Bot,
  Sparkles,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';

export function Templates() {
  const templates = [
    {
      id: 'tpl-001',
      name: 'Contrastive Pretrain (CLIP)',
      description: 'Image-Text 대조 학습으로 공유 임베딩 공간 생성',
      icon: Sparkles,
      color: 'violet',
      inputReqs: ['Image-Text Pairs', 'High-quality captions'],
      outputs: ['Image Encoder', 'Text Encoder'],
      estimatedTime: '24-48h (1M samples)',
      popularity: 95,
    },
    {
      id: 'tpl-002',
      name: 'VLM Instruction Tuning',
      description: 'Vision-Language Model을 instruction 데이터로 파인튜닝',
      icon: Image,
      color: 'cyan',
      inputReqs: ['Image-Text Pairs', 'Instruction format', 'QA labels'],
      outputs: ['VLM Model', 'Adapter weights'],
      estimatedTime: '12-24h (100K samples)',
      popularity: 88,
    },
    {
      id: 'tpl-003',
      name: 'Video Understanding Finetune',
      description: '비디오 이해 및 VideoQA를 위한 파인튜닝',
      icon: Video,
      color: 'emerald',
      inputReqs: ['Video-Text Pairs', 'Frame sampling', 'Timestamp alignment'],
      outputs: ['Video Model', 'Temporal features'],
      estimatedTime: '24-72h (50K videos)',
      popularity: 72,
    },
    {
      id: 'tpl-004',
      name: 'Multimodal Agent Tuning',
      description: '도구 사용 및 멀티스텝 추론을 위한 에이전트 튜닝',
      icon: Bot,
      color: 'amber',
      inputReqs: ['Tool schemas', 'Agent traces', 'Reasoning chains'],
      outputs: ['Agent Model', 'Tool calling'],
      estimatedTime: '8-16h (50K traces)',
      popularity: 65,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-400" />
            </div>
            Training Templates
          </h1>
          <p className="text-slate-400 mt-1">멀티모달 학습 파이프라인 템플릿</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Custom Template
        </button>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div 
              key={template.id}
              className="glass-card p-6 hover:border-brand-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-${template.color}-500/20 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-7 h-7 text-${template.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-100">{template.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <span className="text-amber-400">★</span>
                      {template.popularity}%
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{template.description}</p>

                  {/* Input Requirements */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1.5">Input Requirements</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.inputReqs.map((req, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1.5">Outputs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.outputs.map((out, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.estimatedTime}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-ghost text-xs py-1.5">
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button className="btn-primary text-xs py-1.5">
                        <Play className="w-3 h-3" />
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DAG 미리보기 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Pipeline Preview: VLM Instruction Tuning</h2>
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {['Data Ingest', 'Pairing', 'Preprocess', 'Tokenize', 'Train', 'Eval', 'Registry'].map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <div className={`px-4 py-2 rounded-lg ${
                idx < 5 ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' :
                idx === 5 ? 'bg-violet-500/20 border border-violet-500/30 text-violet-400' :
                'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              }`}>
                {step}
              </div>
              {idx < 6 && <ChevronRight className="w-4 h-4 text-slate-600" />}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          선택한 템플릿에 따라 DAG가 자동 생성됩니다. 필수 라벨/정렬이 없으면 경고가 표시됩니다.
        </p>
      </div>
    </div>
  );
}
