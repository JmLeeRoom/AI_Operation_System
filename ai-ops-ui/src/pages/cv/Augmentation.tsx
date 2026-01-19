import { 
  Wand2,
  Plus,
  Play,
  Save,
  Image,
  ArrowRight,
  GripVertical,
  Settings,
  Trash2,
  Copy,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export function Augmentation() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets = [
    { id: 'yolo', name: 'YOLO Detection', description: 'Optimized for object detection' },
    { id: 'seg', name: 'Segmentation', description: 'Mask-safe augmentations' },
    { id: 'pose', name: 'Pose Estimation', description: 'Keypoint-aware transforms' },
    { id: 'ocr', name: 'OCR/Document', description: 'Text-preserving augmentations' },
  ];

  const augmentations = [
    { id: 1, name: 'RandomHorizontalFlip', enabled: true, params: { p: 0.5 } },
    { id: 2, name: 'RandomRotate', enabled: true, params: { degrees: [-15, 15] } },
    { id: 3, name: 'ColorJitter', enabled: true, params: { brightness: 0.2, contrast: 0.2, saturation: 0.2 } },
    { id: 4, name: 'RandomResizedCrop', enabled: true, params: { scale: [0.8, 1.0], ratio: [0.9, 1.1] } },
    { id: 5, name: 'GaussianBlur', enabled: false, params: { kernel_size: [3, 7], sigma: [0.1, 2.0] } },
    { id: 6, name: 'RandomAffine', enabled: false, params: { translate: [0.1, 0.1], shear: 10 } },
  ];

  const availableAugmentations = [
    { category: 'Geometric', items: ['Rotate', 'Flip', 'Affine', 'Perspective', 'ElasticTransform'] },
    { category: 'Color', items: ['ColorJitter', 'GaussianBlur', 'GaussianNoise', 'CLAHE', 'ChannelShuffle'] },
    { category: 'Crop', items: ['RandomCrop', 'CenterCrop', 'RandomResizedCrop', 'CoarseDropout'] },
    { category: 'Mix', items: ['Mosaic', 'Mixup', 'CutMix', 'CutOut'] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            Augmentation Recipe Builder
          </h1>
          <p className="text-slate-400 mt-1">이미지 증강 파이프라인 구성 및 미리보기</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Recipe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 프리셋 선택 */}
        <div className="col-span-3 space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Presets</h3>
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedPreset === preset.id 
                      ? 'border-brand-500 bg-brand-500/10' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <p className={`text-sm font-medium ${selectedPreset === preset.id ? 'text-brand-400' : 'text-slate-200'}`}>
                    {preset.name}
                  </p>
                  <p className="text-xs text-slate-500">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 사용 가능한 증강 */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Available Augmentations</h3>
            <div className="space-y-4">
              {availableAugmentations.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    {cat.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 파이프라인 빌더 */}
        <div className="col-span-5 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Pipeline</h3>
            <button className="btn-ghost text-sm">
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          <div className="space-y-3">
            {augmentations.map((aug, index) => (
              <div 
                key={aug.id}
                className={`p-4 rounded-lg border ${
                  aug.enabled 
                    ? 'border-slate-600 bg-slate-800/30' 
                    : 'border-slate-700/50 bg-slate-800/10 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button className="cursor-grab text-slate-500 hover:text-slate-300">
                    <GripVertical className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-200">{aug.name}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {Object.entries(aug.params).map(([key, value]) => (
                        <span key={key} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                          {key}: {JSON.stringify(value)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={aug.enabled} 
                        className="sr-only peer" 
                        readOnly
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-checked:bg-brand-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 추가 버튼 */}
          <button className="mt-4 w-full p-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-brand-500 hover:text-brand-400 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Augmentation Step
          </button>
        </div>

        {/* 미리보기 */}
        <div className="col-span-4 space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Preview</h3>
              <button className="btn-ghost text-sm py-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>

            {/* 원본 이미지 */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Original</p>
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                <Image className="w-12 h-12 text-slate-600" />
              </div>
            </div>

            {/* 증강 결과들 */}
            <div>
              <p className="text-xs text-slate-500 mb-2">Augmented Samples</p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative group">
                    <Image className="w-8 h-8 text-slate-600" />
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-slate-300">Seed: {1000 + i}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 설정 */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Random Seed</label>
                <input 
                  type="number" 
                  placeholder="Auto" 
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Recipe Name</label>
                <input 
                  type="text" 
                  placeholder="my-augmentation-recipe" 
                  className="input-field text-sm py-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Sync BBox/Mask</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" readOnly />
                  <div className="w-9 h-5 bg-slate-700 peer-checked:bg-brand-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
