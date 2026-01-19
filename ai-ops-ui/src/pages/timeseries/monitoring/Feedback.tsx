import { 
  MessageSquare,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Tag,
  RefreshCw,
  Database,
  Play,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function Feedback() {
  const [filterType, setFilterType] = useState('all');

  const feedbackItems = [
    { 
      id: 1, 
      timestamp: '2024-01-19 14:32', 
      entity: 'SAMSUNG', 
      type: 'high_error',
      predicted: 72500,
      actual: 68200,
      error: '5.93%',
      status: 'pending',
      addedToRetrain: false,
    },
    { 
      id: 2, 
      timestamp: '2024-01-19 13:45', 
      entity: 'Sensor-A12', 
      type: 'false_positive',
      predicted: 'Anomaly',
      actual: 'Normal',
      error: 'FP',
      status: 'labeled',
      addedToRetrain: true,
    },
    { 
      id: 3, 
      timestamp: '2024-01-19 12:20', 
      entity: 'NAVER', 
      type: 'high_error',
      predicted: 228500,
      actual: 215000,
      error: '6.28%',
      status: 'labeled',
      addedToRetrain: true,
    },
    { 
      id: 4, 
      timestamp: '2024-01-19 11:15', 
      entity: 'Sensor-B03', 
      type: 'false_negative',
      predicted: 'Normal',
      actual: 'Anomaly',
      error: 'FN',
      status: 'pending',
      addedToRetrain: false,
    },
    { 
      id: 5, 
      timestamp: '2024-01-18 16:30', 
      entity: 'HYUNDAI', 
      type: 'high_error',
      predicted: 175800,
      actual: 185000,
      error: '4.97%',
      status: 'reviewed',
      addedToRetrain: false,
    },
  ];

  const retrainStats = {
    pendingItems: feedbackItems.filter(f => f.status === 'pending').length,
    labeledItems: feedbackItems.filter(f => f.addedToRetrain).length,
    lastRetrainDataset: 'v2.3.1',
    nextRetrainScheduled: '2024-01-20 06:00',
  };

  const filteredItems = feedbackItems.filter(f => 
    filterType === 'all' || f.type === filterType
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Feedback & Retrain
          </h1>
          <p className="text-slate-400 mt-1">피드백 수집 → 라벨링 → 재학습 데이터셋 생성</p>
        </div>
        <button className="btn-primary">
          <RefreshCw className="w-4 h-4" />
          Create Retrain Run
        </button>
      </div>

      {/* 재학습 상태 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card border-amber-500/30">
          <p className="text-slate-400 text-xs mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-amber-400">{retrainStats.pendingItems}</p>
        </div>
        <div className="stat-card border-emerald-500/30">
          <p className="text-slate-400 text-xs mb-1">Added to Retrain</p>
          <p className="text-2xl font-bold text-emerald-400">{retrainStats.labeledItems}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Latest Dataset</p>
          <p className="text-xl font-bold text-cyan-400">{retrainStats.lastRetrainDataset}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Next Retrain</p>
          <p className="text-sm font-bold text-slate-200">{retrainStats.nextRetrainScheduled}</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          {['all', 'high_error', 'false_positive', 'false_negative'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'All' : 
               type === 'high_error' ? 'High Error' :
               type === 'false_positive' ? 'FP' : 'FN'}
            </button>
          ))}
        </div>
      </div>

      {/* 피드백 항목 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Feedback Queue</h3>
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-lg border ${
                item.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30' :
                item.addedToRetrain ? 'bg-emerald-500/10 border-emerald-500/30' :
                'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {item.type === 'high_error' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {item.type === 'false_positive' && <XCircle className="w-4 h-4 text-rose-400" />}
                    {item.type === 'false_negative' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    <span className="badge badge-slate">{item.entity}</span>
                    <span className="text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-400">
                      Predicted: <span className="text-violet-400">{item.predicted}</span>
                    </span>
                    <span className="text-slate-400">
                      Actual: <span className="text-emerald-400">{item.actual}</span>
                    </span>
                    <span className={`font-mono font-bold ${
                      item.type === 'high_error' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {item.error}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.addedToRetrain ? (
                    <span className="badge badge-emerald">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      In Retrain Set
                    </span>
                  ) : (
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      <Plus className="w-3 h-3" />
                      Add to Retrain
                    </button>
                  )}
                  <button className="btn-ghost p-2">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 재학습 파이프라인 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Retrain Pipeline</h3>
        <div className="flex items-center justify-center gap-4">
          {['Feedback', 'Label', 'New Dataset', 'Retrain', 'Validate', 'Deploy'].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`px-4 py-2 rounded-lg ${
                idx < 3 ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' :
                'bg-slate-800/50 border border-slate-700/50 text-slate-400'
              }`}>
                {step}
              </div>
              {idx < 5 && <ChevronRight className="w-5 h-5 text-slate-600 mx-2" />}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          현재 단계: 라벨링 완료 → 새 데이터셋 생성 대기 중
        </p>
      </div>

      {/* 재학습 트리거 조건 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Retrain Trigger Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-slate-300 font-medium">Scheduled</p>
            <p className="text-lg font-bold text-cyan-400 mt-1">Weekly (Mon 06:00)</p>
            <p className="text-xs text-slate-500 mt-1">정기 재학습</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-slate-300 font-medium">Feedback Count</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">{retrainStats.labeledItems} / 50</p>
            <p className="text-xs text-slate-500 mt-1">50개 이상 시 트리거</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-slate-300 font-medium">Performance Drop</p>
            <p className="text-lg font-bold text-amber-400 mt-1">MAPE +7%</p>
            <p className="text-xs text-slate-500 mt-1">10% 이상 시 자동 트리거</p>
          </div>
        </div>
      </div>
    </div>
  );
}
