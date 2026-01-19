import { 
  Users,
  Image,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Send,
  CheckCircle,
  AlertTriangle,
  Flag
} from 'lucide-react';
import { useState } from 'react';

export function HumanReview() {
  const [currentSample, setCurrentSample] = useState(0);

  const stats = {
    pending: 156,
    reviewed: 4844,
    total: 5000,
    avgTimePerSample: '45s',
  };

  const samples = [
    {
      id: 'rev-001',
      image: null,
      prompt: 'What is happening in this image?',
      response: 'A group of friends are having a picnic in the park on a sunny afternoon. They are sitting on a checkered blanket with various food items.',
      assignee: 'John D.',
      status: 'pending',
    },
    {
      id: 'rev-002',
      image: null,
      prompt: 'Describe the main activity in this video.',
      response: 'The video shows a chef preparing a traditional Italian pasta dish. He starts by boiling water, then adds the pasta.',
      assignee: 'Jane S.',
      status: 'pending',
    },
  ];

  const currentData = samples[currentSample];

  const labelOptions = [
    { id: 'correct', label: '정답', color: 'emerald' },
    { id: 'incorrect', label: '오답', color: 'rose' },
    { id: 'partial', label: '부분 정답', color: 'amber' },
  ];

  const groundingOptions = [
    { id: 'grounded', label: '근거 충분', color: 'emerald' },
    { id: 'ungrounded', label: '근거 부족', color: 'rose' },
    { id: 'hallucination', label: '환각', color: 'violet' },
  ];

  const safetyOptions = [
    { id: 'safe', label: '안전', color: 'emerald' },
    { id: 'unsafe', label: '유해', color: 'rose' },
    { id: 'borderline', label: '경계', color: 'amber' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            Human Review Queue
          </h1>
          <p className="text-slate-400 mt-1">샘플 리뷰 및 선호도 데이터 생성</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Reviewed</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.reviewed.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Progress</p>
          <p className="text-2xl font-bold text-slate-100">{((stats.reviewed / stats.total) * 100).toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Avg. Time/Sample</p>
          <p className="text-2xl font-bold text-slate-100">{stats.avgTimePerSample}</p>
        </div>
      </div>

      {/* 리뷰 인터페이스 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 샘플 뷰어 */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentSample(Math.max(0, currentSample - 1))}
                className="p-2 hover:bg-slate-700 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <span className="text-slate-400">
                {currentSample + 1} / {samples.length}
              </span>
              <button 
                onClick={() => setCurrentSample(Math.min(samples.length - 1, currentSample + 1))}
                className="p-2 hover:bg-slate-700 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>00:32</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 미디어 */}
            <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-center">
              <Image className="w-12 h-12 text-slate-600" />
            </div>

            {/* 프롬프트 & 응답 */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-cyan-400 mb-1">Prompt</p>
                <p className="text-slate-200 p-3 bg-slate-800/50 rounded-lg">{currentData.prompt}</p>
              </div>
              <div>
                <p className="text-xs text-violet-400 mb-1">Response</p>
                <p className="text-slate-200 p-3 bg-slate-800/50 rounded-lg">{currentData.response}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 라벨링 패널 */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-100">Labels</h3>

          {/* 정답 여부 */}
          <div>
            <p className="text-sm text-slate-400 mb-2">Correctness</p>
            <div className="flex flex-wrap gap-2">
              {labelOptions.map((opt) => (
                <button 
                  key={opt.id}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all bg-${opt.color}-500/10 border-${opt.color}-500/30 text-${opt.color}-400 hover:bg-${opt.color}-500/20`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 근거 충분성 */}
          <div>
            <p className="text-sm text-slate-400 mb-2">Grounding</p>
            <div className="flex flex-wrap gap-2">
              {groundingOptions.map((opt) => (
                <button 
                  key={opt.id}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all bg-${opt.color}-500/10 border-${opt.color}-500/30 text-${opt.color}-400 hover:bg-${opt.color}-500/20`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 유해성 */}
          <div>
            <p className="text-sm text-slate-400 mb-2">Safety</p>
            <div className="flex flex-wrap gap-2">
              {safetyOptions.map((opt) => (
                <button 
                  key={opt.id}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all bg-${opt.color}-500/10 border-${opt.color}-500/30 text-${opt.color}-400 hover:bg-${opt.color}-500/20`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 코멘트 */}
          <div>
            <p className="text-sm text-slate-400 mb-2">Comment</p>
            <textarea 
              className="input-field h-24 resize-none"
              placeholder="Add notes or feedback..."
            />
          </div>

          {/* 태그 */}
          <div>
            <p className="text-sm text-slate-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              <span className="badge badge-slate text-xs cursor-pointer">+ Add tag</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4 border-t border-slate-700/50">
            <button className="btn-secondary flex-1">
              <Flag className="w-4 h-4" />
              Flag
            </button>
            <button className="btn-primary flex-1">
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* A/B 비교 (DPO용) */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Preference Comparison (for DPO)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-slate">Response A</span>
              <ThumbsUp className="w-5 h-5 text-slate-500 hover:text-emerald-400" />
            </div>
            <p className="text-slate-300">A golden retriever is playing fetch with a red ball in a sunny park.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-slate">Response B</span>
              <ThumbsDown className="w-5 h-5 text-slate-500 hover:text-rose-400" />
            </div>
            <p className="text-slate-300">There is a dog in the image.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4 text-center">
          선호하는 응답을 선택하면 DPO 학습 데이터로 활용됩니다.
        </p>
      </div>
    </div>
  );
}
