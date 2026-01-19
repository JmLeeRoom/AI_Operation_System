import { 
  Settings,
  Play,
  Save,
  Image,
  Video,
  FileAudio,
  FileText,
  ArrowRight,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export function Preprocess() {
  const [activeModality, setActiveModality] = useState<'image' | 'video' | 'audio' | 'text'>('image');

  const imageSteps = [
    { id: 1, name: 'Resize', params: { width: 640, height: 480, mode: 'fit' }, enabled: true },
    { id: 2, name: 'Center Crop', params: { size: 448 }, enabled: true },
    { id: 3, name: 'Normalize', params: { mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225] }, enabled: true },
  ];

  const videoSteps = [
    { id: 1, name: 'Frame Sampling', params: { fps: 1, maxFrames: 32 }, enabled: true },
    { id: 2, name: 'Scene Split', params: { threshold: 0.3 }, enabled: false },
    { id: 3, name: 'Keyframe Extract', params: { method: 'uniform' }, enabled: true },
    { id: 4, name: 'Resize Frames', params: { width: 224, height: 224 }, enabled: true },
  ];

  const audioSteps = [
    { id: 1, name: 'Resample', params: { targetSR: 16000 }, enabled: true },
    { id: 2, name: 'VAD', params: { aggressiveness: 2 }, enabled: true },
    { id: 3, name: 'Segment', params: { maxLength: 30 }, enabled: true },
    { id: 4, name: 'Normalize', params: { dbLevel: -20 }, enabled: true },
  ];

  const textSteps = [
    { id: 1, name: 'Clean', params: { lowercase: false, removeSpecial: false }, enabled: true },
    { id: 2, name: 'Tokenize', params: { tokenizer: 'llama', maxLength: 512 }, enabled: true },
  ];

  const getSteps = () => {
    switch (activeModality) {
      case 'image': return imageSteps;
      case 'video': return videoSteps;
      case 'audio': return audioSteps;
      case 'text': return textSteps;
    }
  };

  const modalityConfig = {
    image: { icon: Image, color: 'violet', label: 'Image' },
    video: { icon: Video, color: 'cyan', label: 'Video' },
    audio: { icon: FileAudio, color: 'emerald', label: 'Audio' },
    text: { icon: FileText, color: 'amber', label: 'Text' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
            Preprocess Recipe Builder
          </h1>
          <p className="text-slate-400 mt-1">모달리티별 전처리 파이프라인 구성</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Recipe
          </button>
        </div>
      </div>

      {/* 모달리티 탭 */}
      <div className="flex gap-2">
        {(Object.keys(modalityConfig) as Array<keyof typeof modalityConfig>).map((mod) => {
          const config = modalityConfig[mod];
          const Icon = config.icon;
          return (
            <button
              key={mod}
              onClick={() => setActiveModality(mod)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeModality === mod
                  ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 파이프라인 빌더 */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">
              {modalityConfig[activeModality].label} Processing Pipeline
            </h2>
            <button className="btn-ghost text-sm">
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          <div className="space-y-3">
            {getSteps().map((step, idx) => (
              <div 
                key={step.id}
                className={`p-4 rounded-lg border transition-all ${
                  step.enabled 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-slate-900/50 border-slate-800/50 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button className="cursor-move">
                    <GripVertical className="w-4 h-4 text-slate-500" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-200">{step.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={step.enabled} className="sr-only peer" readOnly />
                          <div className="w-9 h-5 bg-slate-700 peer-checked:bg-emerald-500 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                        <button className="p-1 hover:bg-slate-700 rounded">
                          <Trash2 className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(step.params).map(([key, value]) => (
                        <span key={key} className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-400">
                          {key}: {Array.isArray(value) ? `[${value.join(', ')}]` : value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>

          {/* 플로우 시각화 */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-500 mb-3">Pipeline Flow</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <div className="px-3 py-1.5 bg-slate-800 rounded text-sm text-slate-300 shrink-0">Input</div>
              {getSteps().filter(s => s.enabled).map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2 shrink-0">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <div className={`px-3 py-1.5 bg-${modalityConfig[activeModality].color}-500/20 border border-${modalityConfig[activeModality].color}-500/30 rounded text-sm text-slate-300`}>
                    {step.name}
                  </div>
                </div>
              ))}
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-sm text-emerald-400 shrink-0">
                Output
              </div>
            </div>
          </div>
        </div>

        {/* 프리뷰 패널 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Preview</h2>
          
          <div className="space-y-4">
            {/* Before */}
            <div>
              <p className="text-sm text-slate-400 mb-2">Before</p>
              <div className="aspect-square bg-slate-800 rounded-lg border border-slate-700/50 flex items-center justify-center">
                {activeModality === 'image' && <Image className="w-12 h-12 text-slate-600" />}
                {activeModality === 'video' && <Video className="w-12 h-12 text-slate-600" />}
                {activeModality === 'audio' && <FileAudio className="w-12 h-12 text-slate-600" />}
                {activeModality === 'text' && <FileText className="w-12 h-12 text-slate-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                {activeModality === 'image' && '1920x1080 RGB'}
                {activeModality === 'video' && '30fps, 5min, 1080p'}
                {activeModality === 'audio' && '44.1kHz, stereo, 3min'}
                {activeModality === 'text' && 'Raw text, 1500 chars'}
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
            </div>

            {/* After */}
            <div>
              <p className="text-sm text-slate-400 mb-2">After</p>
              <div className="aspect-square bg-slate-800 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                {activeModality === 'image' && <Image className="w-12 h-12 text-emerald-500" />}
                {activeModality === 'video' && <Video className="w-12 h-12 text-emerald-500" />}
                {activeModality === 'audio' && <FileAudio className="w-12 h-12 text-emerald-500" />}
                {activeModality === 'text' && <FileText className="w-12 h-12 text-emerald-500" />}
              </div>
              <p className="text-xs text-emerald-400 mt-2 text-center">
                {activeModality === 'image' && '448x448 Normalized'}
                {activeModality === 'video' && '32 frames, 224x224'}
                {activeModality === 'audio' && '16kHz, mono, segments'}
                {activeModality === 'text' && '512 tokens, encoded'}
              </p>
            </div>
          </div>

          <button className="btn-secondary w-full mt-6">
            <Play className="w-4 h-4" />
            Run Preview
          </button>
        </div>
      </div>

      {/* 레시피 버전 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Saved Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['VLM-Standard', 'Video-Dense', 'Audio-ASR'].map((recipe, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-200">{recipe}</span>
                <span className="badge badge-slate text-xs">v{idx + 1}.0</span>
              </div>
              <p className="text-sm text-slate-500">
                {idx === 0 && 'Image: resize + crop + norm'}
                {idx === 1 && 'Video: 32 frames + keyframe'}
                {idx === 2 && 'Audio: 16kHz + VAD + segment'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
