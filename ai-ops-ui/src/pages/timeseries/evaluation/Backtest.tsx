import { 
  Calendar,
  Plus,
  Play,
  Save,
  Settings,
  Clock,
  ArrowRight,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

export function Backtest() {
  const [windowType, setWindowType] = useState('rolling');

  const existingPlans = [
    { id: 1, name: 'Stock 5-Fold WF', folds: 5, window: '1 year', step: '3 months', status: 'active' },
    { id: 2, name: 'Sensor Rolling', folds: 10, window: '30 days', step: '7 days', status: 'active' },
    { id: 3, name: 'Demand Monthly', folds: 12, window: '3 months', step: '1 month', status: 'draft' },
  ];

  const folds = [
    { id: 1, train: '2018-01 ~ 2020-12', val: '2021-01 ~ 2021-06', test: '2021-07 ~ 2021-12' },
    { id: 2, train: '2018-07 ~ 2021-06', val: '2021-07 ~ 2021-12', test: '2022-01 ~ 2022-06' },
    { id: 3, train: '2019-01 ~ 2021-12', val: '2022-01 ~ 2022-06', test: '2022-07 ~ 2022-12' },
    { id: 4, train: '2019-07 ~ 2022-06', val: '2022-07 ~ 2022-12', test: '2023-01 ~ 2023-06' },
    { id: 5, train: '2020-01 ~ 2022-12', val: '2023-01 ~ 2023-06', test: '2023-07 ~ 2023-12' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Backtest / Walk-forward
          </h1>
          <p className="text-slate-400 mt-1">시간축 검증 - Rolling Window, Expanding Window</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Backtest Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 백테스트 플랜 설정 */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Backtest Plan Builder</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Window Type</label>
                <div className="flex gap-2">
                  {['rolling', 'expanding'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWindowType(type)}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        windowType === type
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Train Window Length</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={36} className="input-field w-24" />
                  <select className="input-field">
                    <option>months</option>
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Validation Window</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={6} className="input-field w-24" />
                  <select className="input-field">
                    <option>months</option>
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Test Window</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={6} className="input-field w-24" />
                  <select className="input-field">
                    <option>months</option>
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Step Size</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={6} className="input-field w-24" />
                  <select className="input-field">
                    <option>months</option>
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Embargo (Gap)</label>
                <div className="flex gap-2">
                  <input type="number" defaultValue={0} className="input-field w-24" />
                  <select className="input-field">
                    <option>days</option>
                    <option>weeks</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Generate Folds
            </button>
            <button className="btn-secondary">
              <Save className="w-4 h-4" />
              Save Plan
            </button>
            <button className="btn-primary">
              <Play className="w-4 h-4" />
              Run Backtest
            </button>
          </div>

          {/* 타임라인 시각화 */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Generated Folds Timeline</h4>
            <div className="space-y-2">
              {folds.map((fold) => (
                <div key={fold.id} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-16">Fold {fold.id}</span>
                  <div className="flex-1 h-8 flex rounded overflow-hidden">
                    <div className="bg-emerald-500/30 flex-[60] flex items-center justify-center text-xs text-emerald-300 border-r border-slate-700">
                      Train: {fold.train}
                    </div>
                    <div className="bg-amber-500/30 flex-[20] flex items-center justify-center text-xs text-amber-300 border-r border-slate-700">
                      Val: {fold.val}
                    </div>
                    <div className="bg-violet-500/30 flex-[20] flex items-center justify-center text-xs text-violet-300">
                      Test: {fold.test}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>2018-01</span>
              <span>2020-01</span>
              <span>2022-01</span>
              <span>2024-01</span>
            </div>
          </div>
        </div>

        {/* 기존 플랜 목록 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Saved Plans</h3>
          <div className="space-y-3">
            {existingPlans.map((plan) => (
              <div 
                key={plan.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{plan.name}</span>
                  <span className={`badge ${plan.status === 'active' ? 'badge-emerald' : 'badge-slate'}`}>
                    {plan.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Folds</span>
                    <span className="text-slate-300">{plan.folds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Window</span>
                    <span className="text-slate-300">{plan.window}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Step</span>
                    <span className="text-slate-300">{plan.step}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400 font-medium">⚠️ Leakage Prevention</p>
            <p className="text-xs text-slate-400 mt-1">
              Walk-forward 검증은 미래 데이터 누수를 자동으로 방지합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
