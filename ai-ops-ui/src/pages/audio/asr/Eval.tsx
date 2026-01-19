import { 
  BarChart3,
  Play,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Search,
  Filter,
  ArrowRight,
  Mic
} from 'lucide-react';

export function ASREval() {
  const evalMetrics = {
    overall: { wer: 4.2, cer: 2.1, ser: 8.5, rtf: 0.35 },
    previous: { wer: 4.5, cer: 2.3, ser: 9.2, rtf: 0.38 },
  };

  const conditionBreakdown = [
    { condition: 'Clean speech', samples: 5000, wer: 2.8, cer: 1.4, status: 'pass' },
    { condition: 'Noisy (SNR 10-20dB)', samples: 3000, wer: 5.2, cer: 2.6, status: 'pass' },
    { condition: 'Noisy (SNR < 10dB)', samples: 1500, wer: 12.4, cer: 6.2, status: 'warning' },
    { condition: 'Fast speech (>160 WPM)', samples: 1200, wer: 6.8, cer: 3.4, status: 'pass' },
    { condition: 'Overlapping speech', samples: 800, wer: 18.5, cer: 9.3, status: 'fail' },
    { condition: 'Accented', samples: 2000, wer: 5.5, cer: 2.8, status: 'pass' },
  ];

  const errorAnalysis = [
    { type: 'Substitution', count: 1245, example: '주문 → 주민' },
    { type: 'Deletion', count: 523, example: '감사합니다 → 감사니다' },
    { type: 'Insertion', count: 312, example: '네 → 네네' },
    { type: 'Proper Nouns', count: 845, example: '테슬라 → 텍슬라' },
    { type: 'Numbers', count: 421, example: '123 → 일이삼' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass': return 'badge-emerald';
      case 'warning': return 'badge-amber';
      case 'fail': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ASR Evaluation</h1>
          <p className="text-slate-400 mt-1">WER/CER 분석 및 조건별 성능 평가</p>
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

      {/* Overall Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">WER</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -{(evalMetrics.previous.wer - evalMetrics.overall.wer).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{evalMetrics.overall.wer}%</p>
          <p className="text-xs text-slate-500">Word Error Rate</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">CER</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -{(evalMetrics.previous.cer - evalMetrics.overall.cer).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{evalMetrics.overall.cer}%</p>
          <p className="text-xs text-slate-500">Character Error Rate</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">SER</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -{(evalMetrics.previous.ser - evalMetrics.overall.ser).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{evalMetrics.overall.ser}%</p>
          <p className="text-xs text-slate-500">Sentence Error Rate</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">RTF</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -{(evalMetrics.previous.rtf - evalMetrics.overall.rtf).toFixed(2)}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{evalMetrics.overall.rtf}x</p>
          <p className="text-xs text-slate-500">Real-Time Factor</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Condition Breakdown */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-400" />
              Condition-wise Performance
            </h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-700/50">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Samples</th>
                  <th>WER</th>
                  <th>CER</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {conditionBreakdown.map((row, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="font-medium text-slate-200">{row.condition}</td>
                    <td className="text-slate-400">{row.samples.toLocaleString()}</td>
                    <td className={`font-mono ${row.wer > 10 ? 'text-rose-400' : row.wer > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {row.wer}%
                    </td>
                    <td className={`font-mono ${row.cer > 5 ? 'text-rose-400' : row.cer > 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {row.cer}%
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(row.status)} capitalize`}>
                        {getStatusIcon(row.status)}
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Analysis */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Error Analysis
          </h2>

          <div className="space-y-3">
            {errorAnalysis.map((error, index) => (
              <div 
                key={index}
                className="p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-200">{error.type}</span>
                  <span className="text-sm text-slate-400">{error.count}</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  e.g. "{error.example}"
                </p>
              </div>
            ))}
          </div>

          <button className="btn-ghost w-full mt-4">
            View All Errors <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sample Errors */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Sample Error Cases</h2>
          <div className="flex items-center gap-2">
            <button className="btn-ghost">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { ref: '주문 번호 일이삼 사오육 확인해 주세요', hyp: '주문 번호 일이삼 사오 육 확인해 주세요', wer: 14.3 },
            { ref: '테슬라 주식이 오늘 상승했습니다', hyp: '텍슬라 주식이 오늘 상승했습니다', wer: 20.0 },
          ].map((sample, index) => (
            <div key={index} className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-rose">WER: {sample.wer}%</span>
                <button className="btn-ghost text-sm py-1.5">
                  <Mic className="w-4 h-4" />
                  Play
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-500">Reference:</span>
                  <p className="text-sm text-emerald-300">{sample.ref}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Hypothesis:</span>
                  <p className="text-sm text-rose-300">{sample.hyp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
