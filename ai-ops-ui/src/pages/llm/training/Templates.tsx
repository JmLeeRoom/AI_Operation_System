import { 
  GraduationCap,
  Zap,
  Layers,
  Heart,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Database,
  Cpu,
  Clock,
  FileText
} from 'lucide-react';

export function LLMTrainingTemplates() {
  const templates = [
    {
      id: 'pretrain',
      name: 'Pretraining',
      description: '대규모 코퍼스로 처음부터 LLM 학습. 막대한 GPU 자원 필요.',
      icon: GraduationCap,
      color: 'violet',
      requirements: ['Large text corpus (100B+ tokens)', 'Multi-GPU cluster', '토크나이저 준비'],
      estimated: '수주 ~ 수개월',
      difficulty: 'Expert',
    },
    {
      id: 'sft',
      name: 'SFT (Supervised Fine-tuning)',
      description: '사전학습된 모델을 instruction-response 쌍으로 미세조정.',
      icon: Zap,
      color: 'cyan',
      requirements: ['Base model checkpoint', 'Instruction dataset', '1+ GPU'],
      estimated: '수시간 ~ 수일',
      difficulty: 'Intermediate',
    },
    {
      id: 'lora',
      name: 'LoRA / QLoRA',
      description: '적은 파라미터만 학습하여 메모리 효율적인 미세조정.',
      icon: Layers,
      color: 'emerald',
      requirements: ['Base model', 'Task dataset', '1 GPU (8GB+)'],
      estimated: '수시간',
      difficulty: 'Beginner',
    },
    {
      id: 'dpo',
      name: 'DPO (Direct Preference Optimization)',
      description: 'Reward model 없이 선호도 데이터로 직접 최적화.',
      icon: Heart,
      color: 'rose',
      requirements: ['SFT checkpoint', 'Preference pairs dataset', '2+ GPU'],
      estimated: '수시간 ~ 1일',
      difficulty: 'Advanced',
    },
    {
      id: 'rlhf',
      name: 'RLHF',
      description: 'Reward model + PPO로 인간 피드백 반영 학습.',
      icon: Heart,
      color: 'amber',
      requirements: ['SFT checkpoint', 'Reward model', 'Preference data', '4+ GPU'],
      estimated: '수일',
      difficulty: 'Expert',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'badge-emerald';
      case 'Intermediate': return 'badge-cyan';
      case 'Advanced': return 'badge-amber';
      case 'Expert': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">Training Templates</h1>
        <p className="text-slate-400 mt-1">LLM 학습 방식을 선택하세요. 템플릿이 자동으로 DAG 파이프라인을 생성합니다.</p>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-2 gap-6">
        {templates.map((template, index) => (
          <div 
            key={template.id}
            className="glass-card p-6 hover:border-brand-500/30 transition-all cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${template.color}-500 to-${template.color}-600 flex items-center justify-center shadow-lg`}>
                <template.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                  <span className={`badge ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">{template.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-4 p-4 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Requirements</p>
              <div className="space-y-2">
                {template.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>예상 시간: {template.estimated}</span>
              </div>
              <button className="btn-primary group-hover:bg-brand-400 transition-colors">
                Select Template
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 안내 배너 */}
      <div className="glass-card p-6 border-brand-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">처음이신가요?</h3>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-emerald-400">LoRA/QLoRA</strong>부터 시작하는 것을 권장합니다. 
              적은 자원으로 빠르게 결과를 확인할 수 있습니다. 
              SFT 데이터셋이 준비되어 있다면 <strong className="text-cyan-400">SFT</strong>를 선택하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
