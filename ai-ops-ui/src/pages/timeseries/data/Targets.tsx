import { 
  Target,
  Plus,
  Settings,
  Clock,
  TrendingUp,
  AlertTriangle,
  Table,
  Calendar,
  Save
} from 'lucide-react';
import { useState } from 'react';

export function Targets() {
  const [targetType, setTargetType] = useState('forecasting');

  const existingTargets = [
    { id: 1, name: 'stock_return_7d', type: 'forecasting', horizon: '7 days', aggregation: 'mean', dataset: 'Stock Prices' },
    { id: 2, name: 'sensor_anomaly', type: 'anomaly', window: '5 min', scoring: 'reconstruction_error', dataset: 'Industrial Sensors' },
    { id: 3, name: 'demand_next_week', type: 'forecasting', horizon: '7 days', aggregation: 'sum', dataset: 'Retail Demand' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            Labels & Targets
          </h1>
          <p className="text-slate-400 mt-1">타겟 정의 - 예측 Horizon, Anomaly Label 방식</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Target
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 타겟 설정 폼 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Target Specification</h3>
          
          {/* 타입 선택 */}
          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-2">Target Type</label>
            <div className="flex gap-2">
              {['forecasting', 'anomaly', 'tabular'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTargetType(type)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    targetType === type
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Forecasting 설정 */}
          {targetType === 'forecasting' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Column</label>
                <select className="input-field">
                  <option>close (Price)</option>
                  <option>volume</option>
                  <option>demand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Prediction Horizon</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={7} className="input-field w-24" />
                  <select className="input-field">
                    <option>days</option>
                    <option>hours</option>
                    <option>minutes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Aggregation</label>
                <select className="input-field">
                  <option>mean</option>
                  <option>sum</option>
                  <option>last</option>
                  <option>max</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Granularity</label>
                <select className="input-field">
                  <option>daily</option>
                  <option>hourly</option>
                  <option>15min</option>
                  <option>1min</option>
                </select>
              </div>
            </div>
          )}

          {/* Anomaly 설정 */}
          {targetType === 'anomaly' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Detection Window</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={5} className="input-field w-24" />
                  <select className="input-field">
                    <option>minutes</option>
                    <option>hours</option>
                    <option>days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Scoring Method</label>
                <select className="input-field">
                  <option>reconstruction_error</option>
                  <option>isolation_score</option>
                  <option>z_score</option>
                  <option>custom_threshold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Label Type</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="label_type" defaultChecked className="accent-rose-500" />
                    <span className="text-slate-300">Unsupervised</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="label_type" className="accent-rose-500" />
                    <span className="text-slate-300">Supervised (with labels)</span>
                  </label>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400">
                  이벤트 라벨 결합: 고장/장애 로그 데이터와 연결하여 라벨 생성 가능
                </p>
              </div>
            </div>
          )}

          {/* Tabular 설정 */}
          {targetType === 'tabular' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Column</label>
                <select className="input-field">
                  <option>churn (Classification)</option>
                  <option>ltv (Regression)</option>
                  <option>fraud (Classification)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Class Mapping (Classification)</label>
                <input type="text" placeholder="0: normal, 1: churn" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Imbalance Handling</label>
                <select className="input-field">
                  <option>none</option>
                  <option>class_weight</option>
                  <option>oversample (SMOTE)</option>
                  <option>undersample</option>
                </select>
              </div>
            </div>
          )}

          <button className="btn-primary w-full mt-6">
            <Save className="w-4 h-4" />
            Save Target
          </button>
        </div>

        {/* 기존 타겟 목록 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Existing Targets</h3>
          <div className="space-y-3">
            {existingTargets.map((t) => (
              <div key={t.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-rose-400">{t.name}</span>
                  <span className={`badge ${
                    t.type === 'forecasting' ? 'badge-emerald' : 'badge-amber'
                  }`}>
                    {t.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {t.type === 'forecasting' ? (
                    <span>Horizon: {t.horizon} • Agg: {t.aggregation}</span>
                  ) : (
                    <span>Window: {t.window} • Scoring: {t.scoring}</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">Dataset: {t.dataset}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
