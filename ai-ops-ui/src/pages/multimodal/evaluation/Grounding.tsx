import { 
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Clock,
  Search,
  Filter,
  Send
} from 'lucide-react';
import { useState } from 'react';

export function Grounding() {
  const [currentSample, setCurrentSample] = useState(0);

  const stats = {
    total: 5000,
    grounded: 4650,
    ungrounded: 350,
    groundingRate: 93,
  };

  const samples = [
    {
      id: 1,
      image: null,
      question: 'What color is the car in the image?',
      answer: 'The car in the image is red. It appears to be a sports car parked on the street.',
      sentences: [
        { text: 'The car in the image is red.', grounded: true, evidence: 'bbox: [120, 80, 340, 280]' },
        { text: 'It appears to be a sports car parked on the street.', grounded: true, evidence: 'bbox: [100, 200, 400, 350]' },
      ],
      groundingScore: 1.0,
      status: 'pass',
    },
    {
      id: 2,
      image: null,
      question: 'How many people are in this photo?',
      answer: 'There are three people in the photo. Two of them are standing near the fountain, and one is sitting on a bench reading a book.',
      sentences: [
        { text: 'There are three people in the photo.', grounded: true, evidence: 'detected: 3 persons' },
        { text: 'Two of them are standing near the fountain', grounded: true, evidence: 'bbox: [50, 100, 200, 300]' },
        { text: 'and one is sitting on a bench reading a book.', grounded: false, evidence: 'No book detected' },
      ],
      groundingScore: 0.67,
      status: 'warn',
    },
    {
      id: 3,
      image: null,
      question: 'What is the weather like?',
      answer: 'It is a sunny day with clear blue skies. The temperature appears to be warm, around 25 degrees Celsius.',
      sentences: [
        { text: 'It is a sunny day with clear blue skies.', grounded: true, evidence: 'sky region analysis' },
        { text: 'The temperature appears to be warm, around 25 degrees Celsius.', grounded: false, evidence: 'Cannot determine temperature from image' },
      ],
      groundingScore: 0.5,
      status: 'fail',
    },
  ];

  const currentData = samples[currentSample];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            Grounding & Hallucination Studio
          </h1>
          <p className="text-slate-400 mt-1">근거 없는 답변 탐지 및 정합성 평가</p>
        </div>
        <button className="btn-primary">
          <Send className="w-4 h-4" />
          Send to Review
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Samples</p>
          <p className="text-2xl font-bold text-slate-100">{stats.total.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Grounded</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.grounded.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Ungrounded</p>
          <p className="text-2xl font-bold text-rose-400">{stats.ungrounded}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Grounding Rate</p>
          <p className="text-2xl font-bold text-slate-100">{stats.groundingRate}%</p>
        </div>
      </div>

      {/* 3축 뷰어 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentSample(Math.max(0, currentSample - 1))}
              className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-50"
              disabled={currentSample === 0}
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <span className="text-sm text-slate-400">
              Sample {currentSample + 1} / {samples.length}
            </span>
            <button 
              onClick={() => setCurrentSample(Math.min(samples.length - 1, currentSample + 1))}
              className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-50"
              disabled={currentSample === samples.length - 1}
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search samples..." className="input-field pl-9 py-1.5 text-sm w-48" />
            </div>
            <button className="btn-ghost text-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 미디어 뷰어 */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Media Viewer
            </h3>
            <div className="aspect-square bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-center relative group">
              <Image className="w-16 h-16 text-slate-600" />
              <button className="absolute top-2 right-2 p-2 bg-slate-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </button>
              {/* Heatmap overlay placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-xl pointer-events-none" />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Click to view attention/heatmap overlay
            </p>
          </div>

          {/* 프롬프트/응답 뷰어 */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Response Viewer
            </h3>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 h-full">
              <div className="mb-4">
                <p className="text-xs text-cyan-400 mb-1">Question</p>
                <p className="text-slate-200">{currentData.question}</p>
              </div>
              <div>
                <p className="text-xs text-violet-400 mb-1">Answer</p>
                <div className="space-y-2">
                  {currentData.sentences.map((sent, idx) => (
                    <p 
                      key={idx}
                      className={`text-sm p-2 rounded ${
                        sent.grounded 
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {sent.text}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`badge ${
                  currentData.status === 'pass' ? 'badge-emerald' :
                  currentData.status === 'warn' ? 'badge-amber' : 'badge-rose'
                }`}>
                  {currentData.status === 'pass' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {currentData.status === 'warn' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {currentData.status === 'fail' && <XCircle className="w-3 h-3 mr-1" />}
                  Score: {(currentData.groundingScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* 근거/정합성 패널 */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Evidence Panel
            </h3>
            <div className="space-y-3">
              {currentData.sentences.map((sent, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    sent.grounded 
                      ? 'bg-slate-800/50 border-emerald-500/30' 
                      : 'bg-rose-900/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-slate-300 line-clamp-2">{sent.text}</p>
                    {sent.grounded ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{sent.evidence}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Grounding Methods</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">Attention Map</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">Object Detection</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">Rule-based</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 근거 부족 케이스 큐 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Ungrounded Cases Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {samples.filter(s => s.status !== 'pass').map((sample) => (
            <div 
              key={sample.id}
              className={`p-4 rounded-lg border cursor-pointer hover:border-amber-500/50 transition-all ${
                sample.status === 'warn' ? 'bg-amber-900/10 border-amber-500/30' : 'bg-rose-900/10 border-rose-500/30'
              }`}
              onClick={() => setCurrentSample(samples.indexOf(sample))}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">Sample #{sample.id}</span>
                <span className={`badge ${sample.status === 'warn' ? 'badge-amber' : 'badge-rose'}`}>
                  {(sample.groundingScore * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{sample.question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
