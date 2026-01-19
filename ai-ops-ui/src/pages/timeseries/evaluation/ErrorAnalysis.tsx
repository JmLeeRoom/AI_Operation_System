import { 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Activity,
  BarChart2,
  TrendingUp,
  ChevronRight,
  Eye,
  Tag
} from 'lucide-react';
import { useState } from 'react';

export function ErrorAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorType, setErrorType] = useState('all');

  const highErrorCases = [
    { id: 1, timestamp: '2024-01-15 09:35', entity: 'SAMSUNG', actual: 72500, predicted: 68200, error: '5.93%', reason: '실적 발표 직후' },
    { id: 2, timestamp: '2024-01-12 14:20', entity: 'HYUNDAI', actual: 185000, predicted: 175800, error: '4.97%', reason: '환율 급변' },
    { id: 3, timestamp: '2024-01-10 10:15', entity: 'NAVER', actual: 215000, predicted: 228500, error: '6.28%', reason: '규제 뉴스' },
    { id: 4, timestamp: '2024-01-08 15:00', entity: 'KAKAO', actual: 52800, predicted: 48900, error: '7.39%', reason: '경쟁사 발표' },
    { id: 5, timestamp: '2024-01-05 11:30', entity: 'SK하이닉스', actual: 142000, predicted: 135600, error: '4.51%', reason: '반도체 수출 지표' },
  ];

  const anomalyFpFn = [
    { id: 1, type: 'FP', timestamp: '2024-01-14 13:45', entity: 'Sensor-A12', score: 0.85, actual: 'Normal', reason: '정기 점검 중' },
    { id: 2, type: 'FN', timestamp: '2024-01-13 08:20', entity: 'Sensor-B03', score: 0.42, actual: 'Anomaly', reason: '점진적 이상' },
    { id: 3, type: 'FP', timestamp: '2024-01-11 16:30', entity: 'Sensor-C08', score: 0.78, actual: 'Normal', reason: '환경 변화' },
    { id: 4, type: 'FN', timestamp: '2024-01-09 22:15', entity: 'Sensor-A05', score: 0.38, actual: 'Anomaly', reason: '노이즈 마스킹' },
  ];

  const errorDistribution = [
    { range: '0-2%', count: 1250, pct: '45%' },
    { range: '2-4%', count: 890, pct: '32%' },
    { range: '4-6%', count: 420, pct: '15%' },
    { range: '6-10%', count: 180, pct: '6.5%' },
    { range: '10%+', count: 45, pct: '1.5%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            Error Analysis
          </h1>
          <p className="text-slate-400 mt-1">예측 오차 분석, 이상탐지 FP/FN 케이스 검토</p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" />
          Export Cases
        </button>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by entity, timestamp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {['all', 'high_error', 'fp', 'fn'].map((type) => (
            <button
              key={type}
              onClick={() => setErrorType(type)}
              className={`px-3 py-1.5 text-sm rounded-md uppercase transition-all ${
                errorType === type
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 오류 분포 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Error Distribution</h3>
        <div className="flex items-end gap-4 h-32">
          {errorDistribution.map((d) => (
            <div key={d.range} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full rounded-t ${
                  d.range === '10%+' ? 'bg-rose-500' :
                  d.range === '6-10%' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ height: `${parseInt(d.pct) * 2}px` }}
              />
              <p className="text-xs text-slate-400 mt-2">{d.range}</p>
              <p className="text-sm font-mono text-slate-300">{d.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 고오차 케이스 (Forecasting) */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            High Error Cases (Forecasting)
          </h3>
          <div className="space-y-3">
            {highErrorCases.map((c) => (
              <div 
                key={c.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-300">{c.timestamp}</span>
                    <span className="badge badge-cyan">{c.entity}</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">{c.error}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="space-x-4">
                    <span className="text-slate-500">Actual: <span className="text-slate-300">{c.actual.toLocaleString()}</span></span>
                    <span className="text-slate-500">Predicted: <span className="text-amber-400">{c.predicted.toLocaleString()}</span></span>
                  </div>
                  <Eye className="w-4 h-4 text-slate-500" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{c.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FP/FN 케이스 (Anomaly Detection) */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            FP/FN Cases (Anomaly Detection)
          </h3>
          <div className="space-y-3">
            {anomalyFpFn.map((c) => (
              <div 
                key={c.id}
                className={`p-4 rounded-lg border cursor-pointer ${
                  c.type === 'FP' 
                    ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50' 
                    : 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${c.type === 'FP' ? 'badge-amber' : 'badge-rose'}`}>
                      {c.type}
                    </span>
                    <span className="font-mono text-slate-300">{c.timestamp}</span>
                  </div>
                  <span className="badge badge-slate">{c.entity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Score: <span className="font-mono text-violet-400">{c.score}</span>
                  </span>
                  <span className="text-slate-500">
                    Actual: <span className={c.actual === 'Normal' ? 'text-emerald-400' : 'text-rose-400'}>{c.actual}</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{c.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시계열 구간 확대 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Error Hotspot Visualization</h3>
        <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500">Time series with error highlight zones</p>
            <p className="text-xs text-slate-600 mt-1">Click on a case to zoom into the period</p>
          </div>
        </div>
      </div>
    </div>
  );
}
