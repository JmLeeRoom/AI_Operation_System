import { 
  GraduationCap,
  Play,
  Save,
  Settings,
  Database,
  Cpu,
  Zap,
  ChevronRight,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

export function ASRTraining() {
  const [selectedModel, setSelectedModel] = useState('conformer');

  const modelTemplates = [
    {
      id: 'conformer',
      name: 'Conformer',
      description: 'Convolution + Transformer 기반 고성능 ASR 모델',
      wer: '~3-5%',
      streaming: true,
      difficulty: 'Advanced',
    },
    {
      id: 'whisper',
      name: 'Whisper Fine-tune',
      description: 'OpenAI Whisper 미세조정 (다국어 지원)',
      wer: '~4-8%',
      streaming: false,
      difficulty: 'Intermediate',
    },
    {
      id: 'wav2vec2',
      name: 'Wav2Vec 2.0',
      description: 'Self-supervised pretraining + Fine-tune',
      wer: '~5-10%',
      streaming: false,
      difficulty: 'Beginner',
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
          <h1 className="text-2xl font-bold text-white">ASR Training</h1>
          <p className="text-slate-400 mt-1">음성 인식 모델 학습 설정</p>
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
          Select ASR Model
        </h2>

        <div className="grid grid-cols-3 gap-4">
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
                <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                {selectedModel === model.id && (
                  <CheckCircle className="w-5 h-5 text-brand-400" />
                )}
              </div>
              <p className="text-sm text-slate-400 mb-3">{model.description}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${getDifficultyBadge(model.difficulty)}`}>
                  {model.difficulty}
                </span>
                {model.streaming && (
                  <span className="badge badge-cyan">Streaming</span>
                )}
              </div>
              
              <p className="text-xs text-slate-500">Expected WER: {model.wer}</p>
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
                <option>Korean Call Center v2.1 (1,250h)</option>
                <option>Mixed Language v1.0 (680h)</option>
                <option>Custom Selection...</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max Segment Length</label>
                <input type="number" className="input-field" defaultValue={30} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Min Segment Length</label>
                <input type="number" className="input-field" defaultValue={1} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-slate-300">SpecAugment</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-slate-300">Speed Perturbation</span>
              </label>
            </div>
          </div>
        </div>

        {/* Training Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Training Parameters
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Learning Rate</label>
                <input type="text" className="input-field" defaultValue="1e-4" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Batch Size</label>
                <input type="number" className="input-field" defaultValue={16} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Epochs</label>
                <input type="number" className="input-field" defaultValue={50} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Warmup Steps</label>
                <input type="number" className="input-field" defaultValue={5000} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Optimizer</label>
              <select className="input-field">
                <option>AdamW</option>
                <option>Adam</option>
                <option>Noam (Transformer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hardware Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Hardware Configuration
          </h2>

          <div className="space-y-4">
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
                  <option>V100 (32GB)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-slate-300">Mixed Precision (FP16)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-brand-500" />
                <span className="text-slate-300">Gradient Checkpointing</span>
              </label>
            </div>

            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-sm text-slate-400">
                <span className="text-white">Estimated Time:</span> ~12h for 1,250h data
              </p>
            </div>
          </div>
        </div>

        {/* Streaming Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-400" />
            Streaming Configuration
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <span className="text-slate-300">Enable Streaming Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Chunk Size (ms)</label>
                <input type="number" className="input-field" defaultValue={640} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Left Context</label>
                <input type="number" className="input-field" defaultValue={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Decoding Strategy</label>
              <select className="input-field">
                <option>Greedy</option>
                <option>Beam Search (beam=4)</option>
                <option>CTC Prefix Beam</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
