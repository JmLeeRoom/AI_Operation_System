import { 
  Settings,
  Save,
  Play,
  Database,
  GitBranch,
  Cpu,
  Clock,
  Layers,
  TrendingUp,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

export function Config() {
  const [activeTab, setActiveTab] = useState('data');

  const tabs = [
    { id: 'data', label: 'Data', icon: Database },
    { id: 'features', label: 'Features', icon: GitBranch },
    { id: 'model', label: 'Model', icon: Layers },
    { id: 'training', label: 'Training', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: Cpu },
    { id: 'outputs', label: 'Outputs', icon: Save },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Train Config Editor
          </h1>
          <p className="text-slate-400 mt-1">학습 설정 - 데이터, 피처, 모델, 하이퍼파라미터</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save Config
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Start Training
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data 탭 */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Dataset Selection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Dataset</label>
                <select className="input-field">
                  <option>Stock Prices (KOSPI) v2.3</option>
                  <option>Industrial Sensors v1.8</option>
                  <option>Retail Demand v1.5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Entity Column</label>
                <select className="input-field">
                  <option>stock_code</option>
                  <option>sensor_id</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Time Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" defaultValue="2018-01-01" className="input-field" />
                  <input type="date" defaultValue="2024-01-19" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Sampling</label>
                <select className="input-field">
                  <option>Full (100%)</option>
                  <option>Random 50%</option>
                  <option>Stratified by entity</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Split Strategy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Split Method</label>
                <select className="input-field">
                  <option>Time-based (Walk-forward)</option>
                  <option>Rolling Window</option>
                  <option>Expanding Window</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Train %</label>
                  <input type="number" defaultValue={60} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Val %</label>
                  <input type="number" defaultValue={20} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Test %</label>
                  <input type="number" defaultValue={20} className="input-field" />
                </div>
              </div>
              <div className="h-12 flex rounded-lg overflow-hidden">
                <div className="bg-emerald-500/30 flex-[60] flex items-center justify-center text-emerald-300 text-xs">Train</div>
                <div className="bg-amber-500/30 flex-[20] flex items-center justify-center text-amber-300 text-xs">Val</div>
                <div className="bg-violet-500/30 flex-[20] flex items-center justify-center text-violet-300 text-xs">Test</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features 탭 */}
      {activeTab === 'features' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Feature Set Configuration</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Feature Set</label>
                <select className="input-field">
                  <option>Stock Features v2.3 (32 features)</option>
                  <option>Sensor Features v1.8 (64 features)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Scaling</label>
                <select className="input-field">
                  <option>StandardScaler</option>
                  <option>MinMaxScaler</option>
                  <option>RobustScaler</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Encoding</label>
                <select className="input-field">
                  <option>Label Encoding</option>
                  <option>One-Hot Encoding</option>
                  <option>Target Encoding</option>
                </select>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Selected Features (32)</h4>
              <div className="flex flex-wrap gap-2">
                {['close', 'volume', 'close_lag_1', 'close_lag_5', 'close_ma_5', 'close_ma_20', 'volatility', 'dayofweek'].map((f) => (
                  <span key={f} className="badge badge-violet text-xs">{f}</span>
                ))}
                <span className="text-slate-500 text-xs">+24 more...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model 탭 */}
      {activeTab === 'model' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Model Configuration</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Algorithm</label>
                <select className="input-field">
                  <option>XGBoost</option>
                  <option>LightGBM</option>
                  <option>CatBoost</option>
                  <option>LSTM</option>
                  <option>Transformer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">max_depth</label>
                <input type="number" defaultValue={6} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">n_estimators</label>
                <input type="number" defaultValue={100} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">learning_rate</label>
                <input type="number" defaultValue={0.1} step={0.01} className="input-field" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">subsample</label>
                <input type="number" defaultValue={0.8} step={0.1} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">colsample_bytree</label>
                <input type="number" defaultValue={0.8} step={0.1} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">reg_alpha (L1)</label>
                <input type="number" defaultValue={0} step={0.1} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">reg_lambda (L2)</label>
                <input type="number" defaultValue={1} step={0.1} className="input-field" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training 탭 */}
      {activeTab === 'training' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Training Parameters</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Epochs (for DL)</label>
                <input type="number" defaultValue={100} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Early Stopping Patience</label>
                <input type="number" defaultValue={10} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Random Seed</label>
                <input type="number" defaultValue={42} className="input-field" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">HP Search</label>
                <select className="input-field">
                  <option>None</option>
                  <option>Grid Search</option>
                  <option>Random Search</option>
                  <option>Bayesian (Optuna)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">HP Search Trials</label>
                <input type="number" defaultValue={50} className="input-field" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="checkpoint" defaultChecked className="accent-amber-500" />
                <label htmlFor="checkpoint" className="text-slate-300">Enable Checkpointing</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources 탭 */}
      {activeTab === 'resources' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Compute Resources</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Compute Type</label>
                <select className="input-field">
                  <option>CPU (8 cores)</option>
                  <option>GPU (1x V100)</option>
                  <option>GPU (1x A100)</option>
                  <option>Multi-GPU (4x A100)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Memory (GB)</label>
                <input type="number" defaultValue={32} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Timeout (hours)</label>
                <input type="number" defaultValue={24} className="input-field" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Estimated Cost</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Compute</span>
                  <span className="text-slate-200">$2.50/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Duration</span>
                  <span className="text-slate-200">~4 hours</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                  <span className="text-slate-300 font-medium">Total</span>
                  <span className="text-amber-400 font-bold">~$10.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outputs 탭 */}
      {activeTab === 'outputs' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Output Configuration</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Model Registry Name</label>
                <input type="text" defaultValue="stock-forecaster" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Version Tag</label>
                <input type="text" placeholder="Auto (v2.4)" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Tags</label>
                <input type="text" placeholder="production, forecasting" className="input-field" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="autoRegister" defaultChecked className="accent-amber-500" />
                <label htmlFor="autoRegister" className="text-slate-300">Auto-register to Model Registry</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="saveArtifacts" defaultChecked className="accent-amber-500" />
                <label htmlFor="saveArtifacts" className="text-slate-300">Save All Artifacts</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="genReport" defaultChecked className="accent-amber-500" />
                <label htmlFor="genReport" className="text-slate-300">Generate Backtest Report</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
