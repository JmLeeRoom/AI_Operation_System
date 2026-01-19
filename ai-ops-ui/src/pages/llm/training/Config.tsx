import { 
  Settings,
  Database,
  Cpu,
  Zap,
  Save,
  Play,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Layers,
  HardDrive
} from 'lucide-react';
import { useState } from 'react';

export function LLMTrainingConfig() {
  const [activeTab, setActiveTab] = useState<'data' | 'model' | 'training' | 'parallel' | 'checkpoint' | 'safety'>('data');

  const tabs = [
    { key: 'data', label: 'Data', icon: Database },
    { key: 'model', label: 'Model', icon: Layers },
    { key: 'training', label: 'Training', icon: Zap },
    { key: 'parallel', label: 'Parallelism', icon: Cpu },
    { key: 'checkpoint', label: 'Checkpoint', icon: Save },
    { key: 'safety', label: 'Safety', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <span>Training</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-400">SFT Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Train Config Editor</h1>
          <p className="text-slate-400 mt-1">LLM 학습 파라미터 설정</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Start Training
          </button>
        </div>
      </div>

      {/* 메인 레이아웃 */}
      <div className="flex gap-6">
        {/* 왼쪽 탭 네비게이션 */}
        <div className="w-56 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-500/20 text-brand-400 border-l-2 border-brand-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Config Summary */}
          <div className="glass-card p-4 mt-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Model</span>
                <span className="text-white">Llama-3-8B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dataset</span>
                <span className="text-white">v2.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GPUs</span>
                <span className="text-white">4x A100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Time</span>
                <span className="text-white">~6h</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 설정 폼 */}
        <div className="flex-1 glass-card p-6">
          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-400" />
                Data Configuration
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Dataset Version</label>
                  <select className="input-field">
                    <option>InstructionSet v2.1 (50K samples)</option>
                    <option>InstructionSet v2.0 (45K samples)</option>
                    <option>ChatLog v1.0 (120K samples)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Split</label>
                  <select className="input-field">
                    <option>train (90%)</option>
                    <option>train_val (95%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Max Sequence Length</label>
                  <input type="number" className="input-field" defaultValue={4096} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Data Mixture Ratio</label>
                  <input type="text" className="input-field" defaultValue="code:0.3, chat:0.5, inst:0.2" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-slate-300">Enable sequence packing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-brand-500" />
                  <span className="text-slate-300">Data caching</span>
                </label>
              </div>
            </div>
          )}

          {/* Model Tab */}
          {activeTab === 'model' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                Model Configuration
              </h2>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Base Model</label>
                <select className="input-field">
                  <option>meta-llama/Llama-3-8B</option>
                  <option>meta-llama/Llama-3-70B</option>
                  <option>mistralai/Mistral-7B-v0.3</option>
                  <option>Qwen/Qwen2-7B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Tokenizer</label>
                <select className="input-field">
                  <option>Use model default</option>
                  <option>llama-3-tokenizer (custom vocab)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">LoRA Config (if applicable)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Rank (r)</label>
                    <input type="number" className="input-field" defaultValue={16} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Alpha</label>
                    <input type="number" className="input-field" defaultValue={32} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Dropout</label>
                    <input type="number" className="input-field" defaultValue={0.05} step={0.01} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Modules</label>
                <input type="text" className="input-field" defaultValue="q_proj, v_proj, k_proj, o_proj" />
              </div>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Training Parameters
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Learning Rate</label>
                  <input type="text" className="input-field" defaultValue="2e-5" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">LR Schedule</label>
                  <select className="input-field">
                    <option>cosine</option>
                    <option>linear</option>
                    <option>constant_with_warmup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Epochs</label>
                  <input type="number" className="input-field" defaultValue={3} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Batch Size (per GPU)</label>
                  <input type="number" className="input-field" defaultValue={4} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Grad Accumulation</label>
                  <input type="number" className="input-field" defaultValue={4} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Optimizer</label>
                  <select className="input-field">
                    <option>AdamW</option>
                    <option>Adam</option>
                    <option>SGD</option>
                    <option>8bit AdamW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Warmup Ratio</label>
                  <input type="number" className="input-field" defaultValue={0.03} step={0.01} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-slate-300">FP16 / BF16 mixed precision</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-slate-300">Gradient checkpointing</span>
                </label>
              </div>
            </div>
          )}

          {/* Parallelism Tab */}
          {activeTab === 'parallel' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Parallelism Configuration
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">GPU Count</label>
                  <input type="number" className="input-field" defaultValue={4} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">GPU Type</label>
                  <select className="input-field">
                    <option>A100 (80GB)</option>
                    <option>A100 (40GB)</option>
                    <option>H100 (80GB)</option>
                    <option>RTX 4090 (24GB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Strategy</label>
                <select className="input-field">
                  <option>Data Parallel (DDP)</option>
                  <option>FSDP (Fully Sharded)</option>
                  <option>DeepSpeed ZeRO-2</option>
                  <option>DeepSpeed ZeRO-3</option>
                </select>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg">
                <p className="text-sm text-slate-400">
                  <strong className="text-white">Estimated VRAM per GPU:</strong> ~45 GB
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  <strong className="text-white">Effective Batch Size:</strong> 64 (4 GPU × 4 batch × 4 accum)
                </p>
              </div>
            </div>
          )}

          {/* Checkpoint Tab */}
          {activeTab === 'checkpoint' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Save className="w-5 h-5 text-amber-400" />
                Checkpoint & Output
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Save Strategy</label>
                  <select className="input-field">
                    <option>Every N steps</option>
                    <option>Every epoch</option>
                    <option>Best eval loss</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Save Every</label>
                  <input type="number" className="input-field" defaultValue={500} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Keep Last N Checkpoints</label>
                <input type="number" className="input-field" defaultValue={3} />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Output Path</label>
                <input type="text" className="input-field font-mono" defaultValue="/outputs/llm/sft/{run_id}" />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-slate-300">Auto-register to Model Registry</span>
                </label>
              </div>
            </div>
          )}

          {/* Safety Tab */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Training Safety
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <div>
                    <p className="text-slate-200">Exclude harmful content from training</p>
                    <p className="text-xs text-slate-500">Filter samples flagged as harmful during preprocessing</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <div>
                    <p className="text-slate-200">PII-masked data only</p>
                    <p className="text-xs text-slate-500">Only use data that passed PII filtering</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded text-brand-500" />
                  <div>
                    <p className="text-slate-200">Early stopping on NaN loss</p>
                    <p className="text-xs text-slate-500">Stop training immediately if NaN is detected</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
