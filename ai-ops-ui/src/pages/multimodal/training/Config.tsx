import { 
  Settings,
  Save,
  Play,
  XCircle,
  Database,
  Brain,
  Cpu,
  Zap,
  FileOutput,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export function Config() {
  const [activeTab, setActiveTab] = useState<'data' | 'model' | 'training' | 'resources' | 'outputs'>('data');

  const tabs = [
    { id: 'data', label: 'Data', icon: Database },
    { id: 'model', label: 'Model', icon: Brain },
    { id: 'training', label: 'Training', icon: Zap },
    { id: 'resources', label: 'Resources', icon: Cpu },
    { id: 'outputs', label: 'Outputs', icon: FileOutput },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            Train Config Editor
          </h1>
          <p className="text-slate-400 mt-1">VLM Instruction Tuning 설정</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            <XCircle className="w-4 h-4" />
            Cancel
          </button>
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

      {/* 탭 네비게이션 */}
      <div className="glass-card p-0">
        <div className="border-b border-slate-700/50">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-cyan-500 text-cyan-400' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Data Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Dataset Version</label>
                  <select className="input-field">
                    <option>COCO-Captions-Extended v5</option>
                    <option>Multimodal-Instructions v7</option>
                    <option>Custom Dataset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Sampling Strategy</label>
                  <select className="input-field">
                    <option>Uniform</option>
                    <option>Stratified by domain</option>
                    <option>Weighted by quality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Frames</label>
                  <input type="number" className="input-field" defaultValue={32} />
                  <p className="text-xs text-slate-500 mt-1">비디오의 경우 최대 프레임 수</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Caption Max Length</label>
                  <input type="number" className="input-field" defaultValue={512} />
                  <p className="text-xs text-slate-500 mt-1">토큰 단위 최대 길이</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-400 font-medium">Cost Warning</p>
                  <p className="text-xs text-slate-400">32 frames × 1.2M samples = ~38.4M frames. 예상 비용: $1,920</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Model Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Vision Encoder</label>
                  <select className="input-field">
                    <option>CLIP-ViT-L/14</option>
                    <option>SigLIP-Large</option>
                    <option>EVA-02-Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language Decoder</label>
                  <select className="input-field">
                    <option>LLaMA-3-8B</option>
                    <option>Mistral-7B</option>
                    <option>Qwen2-7B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fusion Method</label>
                  <select className="input-field">
                    <option>Cross-attention</option>
                    <option>MLP Projector</option>
                    <option>Q-Former</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pretrained Weights</label>
                  <select className="input-field">
                    <option>LLaVA-1.5</option>
                    <option>InternVL2</option>
                    <option>From Scratch</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Training Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Learning Rate</label>
                  <input type="text" className="input-field" defaultValue="2e-5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Batch Size</label>
                  <input type="number" className="input-field" defaultValue={16} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Epochs</label>
                  <input type="number" className="input-field" defaultValue={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Warmup Ratio</label>
                  <input type="text" className="input-field" defaultValue="0.03" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Weight Decay</label>
                  <input type="text" className="input-field" defaultValue="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Gradient Accumulation</label>
                  <input type="number" className="input-field" defaultValue={4} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-cyan-500 rounded" defaultChecked />
                  <span className="text-sm text-slate-300">Enable AMP (FP16)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-cyan-500 rounded" defaultChecked />
                  <span className="text-sm text-slate-300">Gradient Checkpointing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-cyan-500 rounded" />
                  <span className="text-sm text-slate-300">LoRA</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Resource Allocation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">GPU Type</label>
                  <select className="input-field">
                    <option>NVIDIA A100 80GB</option>
                    <option>NVIDIA A100 40GB</option>
                    <option>NVIDIA H100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">GPU Count</label>
                  <input type="number" className="input-field" defaultValue={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Distributed Strategy</label>
                  <select className="input-field">
                    <option>DDP</option>
                    <option>FSDP</option>
                    <option>DeepSpeed ZeRO-3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Checkpoint Interval</label>
                  <input type="number" className="input-field" defaultValue={1000} />
                  <p className="text-xs text-slate-500 mt-1">steps</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-2">Estimated Resources</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-cyan-400">~24h</p>
                    <p className="text-xs text-slate-500">Training Time</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-violet-400">320 GB</p>
                    <p className="text-xs text-slate-500">Total VRAM</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-400">$480</p>
                    <p className="text-xs text-slate-500">Est. Cost</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outputs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Output Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Model Registry Name</label>
                  <input type="text" className="input-field" defaultValue="vlm-instruct" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Version Prefix</label>
                  <input type="text" className="input-field" defaultValue="v" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Artifact Path</label>
                  <input type="text" className="input-field" defaultValue="s3://mlops-artifacts/multimodal/vlm/" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-cyan-500 rounded" defaultChecked />
                  <span className="text-sm text-slate-300">Auto-register to Model Registry</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-cyan-500 rounded" defaultChecked />
                  <span className="text-sm text-slate-300">Run Evaluation after Training</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
