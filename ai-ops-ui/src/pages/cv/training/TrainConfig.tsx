import { 
  ArrowLeft,
  Play,
  Save,
  Database,
  Box,
  Settings,
  Server,
  Bell,
  FolderOutput,
  ChevronDown,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TrainConfig() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'data' | 'model' | 'train' | 'resources' | 'callbacks' | 'outputs'>('data');

  const tabs = [
    { id: 'data', label: 'Data', icon: Database },
    { id: 'model', label: 'Model', icon: Box },
    { id: 'train', label: 'Training', icon: Settings },
    { id: 'resources', label: 'Resources', icon: Server },
    { id: 'callbacks', label: 'Callbacks', icon: Bell },
    { id: 'outputs', label: 'Outputs', icon: FolderOutput },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/cv/training/templates')}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Train Configuration</h1>
            <span className="badge badge-violet">Object Detection</span>
          </div>
          <p className="text-slate-400 mt-1">YOLOv8 기반 학습 파이프라인 설정</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save as Template
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Start Training
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-1 border-b border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-brand-500 text-brand-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {activeTab === 'data' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Data Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Dataset</label>
                  <select className="input-field">
                    <option>Street Scene Detection v2.3</option>
                    <option>Factory Defect Detection v1.2</option>
                    <option>Traffic Sign Dataset v3.0</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Dataset Version</label>
                  <select className="input-field">
                    <option>v2.3 (Latest)</option>
                    <option>v2.2</option>
                    <option>v2.1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Train Split</label>
                  <input type="text" value="train" className="input-field" readOnly />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Validation Split</label>
                  <input type="text" value="val" className="input-field" readOnly />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Test Split</label>
                  <input type="text" value="test" className="input-field" readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Image Size</label>
                  <select className="input-field">
                    <option>640 x 640</option>
                    <option>1280 x 1280</option>
                    <option>512 x 512</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Data Loader Workers</label>
                  <input type="number" defaultValue={8} className="input-field" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="cache" defaultChecked className="w-4 h-4 accent-brand-500" />
                  <label htmlFor="cache" className="text-sm text-slate-300">Enable Data Caching</label>
                </div>
                <span className="text-xs text-slate-500">Faster training at cost of memory</span>
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Model Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Model Architecture</label>
                  <select className="input-field">
                    <option>YOLOv8n (nano)</option>
                    <option>YOLOv8s (small)</option>
                    <option>YOLOv8m (medium)</option>
                    <option>YOLOv8l (large)</option>
                    <option>YOLOv8x (xlarge)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Pretrained Weights</label>
                  <select className="input-field">
                    <option>COCO Pretrained</option>
                    <option>ImageNet Pretrained</option>
                    <option>None (Random Init)</option>
                    <option>Custom Checkpoint...</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Backbone</label>
                <select className="input-field">
                  <option>CSPDarknet (Default)</option>
                  <option>EfficientNet-B0</option>
                  <option>ResNet50</option>
                  <option>ConvNeXt-Tiny</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Freeze Layers</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    defaultValue="0" 
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <span className="text-sm text-slate-300 w-16">0 layers</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Freeze backbone layers for transfer learning</p>
              </div>

              <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-200">Number of classes: <strong>12</strong></p>
                    <p className="text-xs text-slate-400 mt-1">Automatically detected from dataset schema</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'train' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Training Parameters</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Epochs</label>
                  <input type="number" defaultValue={100} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Batch Size</label>
                  <input type="number" defaultValue={16} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Accumulate Gradients</label>
                  <input type="number" defaultValue={1} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Optimizer</label>
                  <select className="input-field">
                    <option>AdamW</option>
                    <option>SGD</option>
                    <option>Adam</option>
                    <option>Lion</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Initial Learning Rate</label>
                  <input type="text" defaultValue="0.01" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">LR Scheduler</label>
                  <select className="input-field">
                    <option>Cosine Annealing</option>
                    <option>Step Decay</option>
                    <option>Linear Warmup</option>
                    <option>OneCycleLR</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Warmup Epochs</label>
                  <input type="number" defaultValue={3} className="input-field" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="amp" defaultChecked className="w-4 h-4 accent-brand-500" />
                  <label htmlFor="amp" className="text-sm text-slate-300">Mixed Precision (AMP)</label>
                </div>
                <span className="text-xs text-slate-500">Faster training, lower memory</span>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Compute Resources</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Compute Target</label>
                  <select className="input-field">
                    <option>GPU Cluster A (A100 x 4)</option>
                    <option>GPU Cluster B (V100 x 8)</option>
                    <option>Local Machine</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Number of GPUs</label>
                  <select className="input-field">
                    <option>1</option>
                    <option>2</option>
                    <option>4</option>
                    <option>8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Resource Profile</label>
                <select className="input-field">
                  <option>Standard (32GB VRAM)</option>
                  <option>High Memory (80GB VRAM)</option>
                  <option>Low Memory (16GB VRAM)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="ddp" className="w-4 h-4 accent-brand-500" />
                  <label htmlFor="ddp" className="text-sm text-slate-300">Enable Distributed Training (DDP)</label>
                </div>
                <span className="text-xs text-slate-500">For multi-GPU training</span>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">Estimated Resources</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-white">~12 GB</p>
                    <p className="text-xs text-slate-500">VRAM Usage</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">~4 hours</p>
                    <p className="text-xs text-slate-500">Est. Duration</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">$24.00</p>
                    <p className="text-xs text-slate-500">Est. Cost</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'callbacks' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Callbacks & Checkpoints</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-200">Early Stopping</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-700 peer-checked:bg-brand-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Patience</label>
                      <input type="number" defaultValue={10} className="input-field text-sm py-2" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Monitor Metric</label>
                      <select className="input-field text-sm py-2">
                        <option>val/mAP50</option>
                        <option>val/loss</option>
                        <option>val/precision</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-200">Model Checkpoint</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-700 peer-checked:bg-brand-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Save Every N Epochs</label>
                      <input type="number" defaultValue={5} className="input-field text-sm py-2" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Keep Top K</label>
                      <input type="number" defaultValue={3} className="input-field text-sm py-2" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-200">Evaluation Frequency</span>
                  </div>
                  <select className="input-field">
                    <option>Every Epoch</option>
                    <option>Every 5 Epochs</option>
                    <option>Every 10 Epochs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outputs' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Output Configuration</h3>
              
              <div>
                <label className="text-sm text-slate-400 block mb-2">Artifact Storage Path</label>
                <input type="text" defaultValue="s3://mlops-artifacts/cv/runs/" className="input-field" />
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Model Naming Pattern</label>
                <input type="text" defaultValue="{model}_{dataset}_{timestamp}" className="input-field" />
                <p className="text-xs text-slate-500 mt-1">Available: {'{model}'}, {'{dataset}'}, {'{timestamp}'}, {'{version}'}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-400">Save Artifacts</p>
                <div className="space-y-2">
                  {['Best Weights', 'Last Weights', 'Training Curves', 'Sample Predictions', 'Config YAML'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 사이드 패널 - Config Summary */}
        <div className="space-y-4">
          <div className="glass-card p-5 sticky top-6">
            <h3 className="text-sm font-semibold text-white mb-4">Configuration Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Task</span>
                <span className="text-slate-200">Object Detection</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Model</span>
                <span className="text-slate-200">YOLOv8m</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Dataset</span>
                <span className="text-slate-200">Street Scene v2.3</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Epochs</span>
                <span className="text-slate-200">100</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Batch Size</span>
                <span className="text-slate-200">16</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Learning Rate</span>
                <span className="text-slate-200">0.01</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">GPUs</span>
                <span className="text-slate-200">1 x A100</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Estimated Cost</span>
                <span className="text-lg font-bold text-white">$24.00</span>
              </div>
              <button className="w-full btn-primary justify-center">
                <Play className="w-4 h-4" />
                Start Training
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
