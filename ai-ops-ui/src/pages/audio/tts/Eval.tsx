import { 
  BarChart3,
  Play,
  Download,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  Star
} from 'lucide-react';
import { useState } from 'react';

export function TTSEval() {
  const [selectedComparison, setSelectedComparison] = useState<'A' | 'B' | null>(null);

  const evalMetrics = {
    mos: 4.21,
    mosPrev: 4.13,
    naturalness: 4.15,
    pronunciation: 4.32,
    prosody: 4.18,
    intelligibility: 4.45,
  };

  const pronunciationErrors = [
    { text: '테슬라', expected: '테슬라', actual: '텍슬라', count: 12 },
    { text: 'NVIDIA', expected: '엔비디아', actual: '엔비디아아', count: 8 },
    { text: '2024년', expected: '이천이십사년', actual: '이공이사년', count: 5 },
    { text: 'AI', expected: '에이아이', actual: '아이', count: 15 },
  ];

  const abSamples = [
    {
      id: 1,
      text: '안녕하세요, 오늘 하루도 즐거운 하루 되세요.',
      modelA: 'VITS v2.1 (current)',
      modelB: 'VITS v2.0 (previous)',
    },
    {
      id: 2,
      text: '주문하신 상품이 내일 오후에 도착할 예정입니다.',
      modelA: 'VITS v2.1 (current)',
      modelB: 'VITS v2.0 (previous)',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">TTS Evaluation</h1>
          <p className="text-slate-400 mt-1">MOS 평가, 발음 오류 분석, A/B 비교</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Run Evaluation
          </button>
        </div>
      </div>

      {/* MOS Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="stat-card col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <div>
              <p className="text-3xl font-bold text-white">{evalMetrics.mos}</p>
              <p className="text-xs text-emerald-400">+{(evalMetrics.mos - evalMetrics.mosPrev).toFixed(2)} vs prev</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">Overall MOS (estimated)</p>
        </div>
        {[
          { label: 'Naturalness', value: evalMetrics.naturalness },
          { label: 'Pronunciation', value: evalMetrics.pronunciation },
          { label: 'Prosody', value: evalMetrics.prosody },
          { label: 'Intelligibility', value: evalMetrics.intelligibility },
        ].map((metric, idx) => (
          <div key={idx} className="stat-card">
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-xs text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pronunciation Errors */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Pronunciation Errors
            </h2>
            <span className="badge badge-amber">{pronunciationErrors.length} issues</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-700/50">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Expected</th>
                  <th>Actual</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {pronunciationErrors.map((error, idx) => (
                  <tr key={idx} className="cursor-pointer">
                    <td className="font-medium text-slate-200">{error.text}</td>
                    <td className="text-emerald-400">{error.expected}</td>
                    <td className="text-rose-400">{error.actual}</td>
                    <td className="text-slate-400">{error.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <button className="btn-ghost text-sm">
              Add to Lexicon <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* A/B Comparison */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              A/B Listening Test
            </h2>
            <span className="text-sm text-slate-400">5/50 completed</span>
          </div>

          <div className="space-y-4">
            {abSamples.slice(0, 1).map((sample) => (
              <div key={sample.id} className="p-4 bg-slate-800/30 rounded-lg">
                <p className="text-slate-200 mb-4">"{sample.text}"</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSelectedComparison('A')}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedComparison === 'A' 
                        ? 'bg-emerald-500/20 border-2 border-emerald-500' 
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-cyan">Model A</span>
                      <button className="btn-ghost p-1.5">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-10 bg-slate-700/50 rounded flex items-center px-2">
                      <div className="flex items-center gap-0.5 h-6 flex-1">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div 
                            key={i}
                            className="w-0.5 bg-cyan-500 rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{sample.modelA}</p>
                  </div>

                  <div 
                    onClick={() => setSelectedComparison('B')}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedComparison === 'B' 
                        ? 'bg-emerald-500/20 border-2 border-emerald-500' 
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-violet">Model B</span>
                      <button className="btn-ghost p-1.5">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-10 bg-slate-700/50 rounded flex items-center px-2">
                      <div className="flex items-center gap-0.5 h-6 flex-1">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div 
                            key={i}
                            className="w-0.5 bg-violet-500 rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{sample.modelB}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                  <button className={`btn-secondary ${selectedComparison === 'A' ? 'bg-emerald-500/20 border-emerald-500' : ''}`}>
                    <ThumbsUp className="w-4 h-4" />
                    Prefer A
                  </button>
                  <button className="btn-ghost">
                    Tie
                  </button>
                  <button className={`btn-secondary ${selectedComparison === 'B' ? 'bg-emerald-500/20 border-emerald-500' : ''}`}>
                    <ThumbsUp className="w-4 h-4" />
                    Prefer B
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full mt-4">
            Submit & Next
          </button>
        </div>
      </div>

      {/* Sample Gallery */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            Generated Samples
          </h2>
          <button className="btn-ghost text-sm">
            <RefreshCw className="w-4 h-4" />
            Generate New
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            '안녕하세요, 반갑습니다.',
            '오늘 날씨가 정말 좋네요.',
            '주문하신 상품이 발송되었습니다.',
          ].map((text, idx) => (
            <div key={idx} className="p-4 bg-slate-800/30 rounded-lg">
              <p className="text-sm text-slate-200 mb-3">{text}</p>
              <div className="flex items-center gap-2">
                <button className="btn-ghost p-2">
                  <Play className="w-4 h-4" />
                </button>
                <div className="flex-1 h-8 bg-slate-700/50 rounded flex items-center px-2">
                  <div className="flex items-center gap-0.5 h-5 flex-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div 
                        key={i}
                        className="w-0.5 bg-emerald-500 rounded-full"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">2.3s</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-rose-400 hover:bg-rose-500/20 rounded">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
