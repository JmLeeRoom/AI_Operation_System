import { 
  GraduationCap,
  Play,
  Save,
  Settings,
  Database,
  Cpu,
  Layers,
  CheckCircle,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { useState } from 'react';

export function TTSTraining() {
  const [selectedModel, setSelectedModel] = useState('vits');

  const modelTemplates = [
    {
      id: 'vits',
      name: 'VITS',
      description: 'End-to-end TTS with variational inference',
      mos: '~4.2',
      realtime: true,
      difficulty: 'Intermediate',
    },
    {
      id: 'tacotron2',
      name: 'Tacotron2 + HiFi-GAN',
      description: '2-stage: Acoustic model + Vocoder',
      mos: '~4.0',
      realtime: true,
      difficulty: 'Beginner',
    },
    {
      id: 'fastspeech2',
      name: 'FastSpeech2 + HiFi-GAN',
      description: 'Non-autoregressive for speed',
      mos: '~3.9',
      realtime: true,
      difficulty: 'Intermediate',
    },
    {
      id: 'xtts',
      name: 'XTTS (Fine-tune)',
      description: 'Zero-shot voice cloning + Fine-tune',
      mos: '~4.3',
      realtime: false,
      difficulty: 'Advanced',
    },
  ];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'badge-emerald';
      case 'Intermediate': return 'badge-cyan';
      case 'Advanced': return 'badge-violet';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">TTS Training</h1>
          <p className="text-slate-400 mt-1">음성 합성 모델 학습 설정</p>
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

      {/* Model Selection */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-400" />
          Select TTS Model
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {modelTemplates.map((model) => (
            <div 
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-5 rounded-xl cursor-pointer transition-all ${
                selectedModel === model.id 
                  ? 'bg-brand-500/20 border-2 border-brand-500' 
                  : 'bg-slate-800/30 border-2 border-transparent hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{model.name}</h3>
                {selectedModel === model.id && (
                  <CheckCircle className="w-5 h-5 text-brand-400" />
                )}
              </div>
              <p className="text-sm text-slate-400 mb-3">{model.description}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${getDifficultyBadge(model.difficulty)}`}>
                  {model.difficulty}
                </span>
                {model.realtime && (
                  <span className="badge badge-emerald">Real-time</span>
                )}
              </div>
              
              <p className="text-xs text-slate-500">Expected MOS: {model.mos}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Config Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Data Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Data Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Training Dataset</label>
              <select className="input-field">
                <option>Speaker_001 Dataset (12.5h, 4,500 samples)</option>
                <option>Multi-Speaker Dataset (43h, 15,400 samples)</option>
                <option>Custom Selection...</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Min Duration (s)</label>
                <input type="number" className="input-field" defaultValue={0.5} step={0.1} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max Duration (s)</label>
                <input type="number" className="input-field" defaultValue={15} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded text-brand-500" />
              <span className="text-slate-300">Use text normalization</span>
            </div>
          </div>
        </div>

        {/* Model Architecture */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            Model Architecture
          </h2>

          <div className="space-y-4">
            {selectedModel === 'vits' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Hidden Channels</label>
                    <input type="number" className="input-field" defaultValue={192} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Num Layers</label>
                    <input type="number" className="input-field" defaultValue={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Mel Channels</label>
                  <input type="number" className="input-field" defaultValue={80} />
                </div>
              </>
            )}
            
            {(selectedModel === 'tacotron2' || selectedModel === 'fastspeech2') && (
              <>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-sm text-slate-400 mb-2">Stage 1: Acoustic Model</p>
                  <select className="input-field py-2 text-sm">
                    <option>{selectedModel === 'tacotron2' ? 'Tacotron2' : 'FastSpeech2'}</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-slate-500" />
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-sm text-slate-400 mb-2">Stage 2: Vocoder</p>
                  <select className="input-field py-2 text-sm">
                    <option>HiFi-GAN (v1)</option>
                    <option>HiFi-GAN (v2)</option>
                    <option>BigVGAN</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Training Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Training Parameters
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Learning Rate</label>
                <input type="text" className="input-field" defaultValue="2e-4" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Batch Size</label>
                <input type="number" className="input-field" defaultValue={32} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Epochs</label>
                <input type="number" className="input-field" defaultValue={1000} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Eval Interval</label>
                <input type="number" className="input-field" defaultValue={1000} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-slate-300">Mixed Precision</span>
              </label>
            </div>
          </div>
        </div>

        {/* Hardware & Output */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Hardware & Output
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">GPU Count</label>
                <input type="number" className="input-field" defaultValue={2} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">GPU Type</label>
                <select className="input-field">
                  <option>A100 (40GB)</option>
                  <option>V100 (32GB)</option>
                  <option>RTX 4090</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Sample Prompts (for eval)</label>
              <textarea 
                className="input-field min-h-[80px] text-sm"
                defaultValue={"안녕하세요, 반갑습니다.\n오늘 날씨가 정말 좋네요.\nHello, nice to meet you."}
              />
            </div>

            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400">
                  Sample audio will be generated every 1000 steps
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
