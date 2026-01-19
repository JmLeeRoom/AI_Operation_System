import { 
  Sparkles,
  Image,
  Send,
  Filter,
  RefreshCw,
  Settings,
  Info,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { useState } from 'react';

export function ActiveLearning() {
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
  const [uncertaintyThreshold, setUncertaintyThreshold] = useState(0.7);
  const [strategy, setStrategy] = useState('uncertainty');

  const samples = [
    { id: 1, uncertainty: 0.94, reason: 'High entropy across classes', predictedClass: 'Vehicle', confidence: 0.52, source: 'Camera-A' },
    { id: 2, uncertainty: 0.91, reason: 'Low margin between top-2', predictedClass: 'Person', confidence: 0.48, source: 'Camera-B' },
    { id: 3, uncertainty: 0.89, reason: 'Near decision boundary', predictedClass: 'Traffic Sign', confidence: 0.55, source: 'Camera-A' },
    { id: 4, uncertainty: 0.87, reason: 'Occlusion detected', predictedClass: 'Vehicle', confidence: 0.61, source: 'Camera-C' },
    { id: 5, uncertainty: 0.85, reason: 'Small object size', predictedClass: 'Person', confidence: 0.58, source: 'Camera-B' },
    { id: 6, uncertainty: 0.83, reason: 'High entropy across classes', predictedClass: 'Bicycle', confidence: 0.49, source: 'Camera-A' },
    { id: 7, uncertainty: 0.81, reason: 'Novel pattern detected', predictedClass: 'Truck', confidence: 0.63, source: 'Camera-D' },
    { id: 8, uncertainty: 0.79, reason: 'Low margin between top-2', predictedClass: 'Bus', confidence: 0.54, source: 'Camera-C' },
    { id: 9, uncertainty: 0.77, reason: 'Blurry input', predictedClass: 'Person', confidence: 0.57, source: 'Camera-B' },
    { id: 10, uncertainty: 0.75, reason: 'Unusual lighting', predictedClass: 'Vehicle', confidence: 0.66, source: 'Camera-A' },
    { id: 11, uncertainty: 0.73, reason: 'Cluster representative', predictedClass: 'Traffic Light', confidence: 0.59, source: 'Camera-D' },
    { id: 12, uncertainty: 0.71, reason: 'Error-prone pattern', predictedClass: 'Motorcycle', confidence: 0.62, source: 'Camera-C' },
  ];

  const strategies = [
    { id: 'uncertainty', name: 'Uncertainty Sampling', description: 'Select samples with highest prediction uncertainty (entropy)' },
    { id: 'margin', name: 'Margin Sampling', description: 'Select samples with smallest margin between top-2 classes' },
    { id: 'diversity', name: 'Diversity Sampling', description: 'Select representative samples from different clusters' },
    { id: 'error', name: 'Error-Driven', description: 'Select samples similar to previous misclassifications' },
  ];

  const toggleSelect = (id: number) => {
    setSelectedSamples(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedSamples.length === samples.length) {
      setSelectedSamples([]);
    } else {
      setSelectedSamples(samples.map(s => s.id));
    }
  };

  const filteredSamples = samples.filter(s => s.uncertainty >= uncertaintyThreshold);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Active Learning Queue
          </h1>
          <p className="text-slate-400 mt-1">불확실도 기반 라벨링 추천 샘플</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Refresh Samples
          </button>
          <button 
            className="btn-primary"
            disabled={selectedSamples.length === 0}
          >
            <Send className="w-4 h-4" />
            Send to Labeling ({selectedSamples.length})
          </button>
        </div>
      </div>

      {/* 설정 패널 */}
      <div className="grid grid-cols-4 gap-4">
        {/* 전략 선택 */}
        <div className="col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-400" />
            Sampling Strategy
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {strategies.map((s) => (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  strategy === s.id 
                    ? 'border-brand-500 bg-brand-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <p className={`text-sm font-medium ${strategy === s.id ? 'text-brand-400' : 'text-slate-200'}`}>
                  {s.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 임계값 설정 */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            Uncertainty Threshold
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{uncertaintyThreshold.toFixed(2)}</span>
              <span className="text-sm text-slate-400">{filteredSamples.length} samples</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={uncertaintyThreshold}
              onChange={(e) => setUncertaintyThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>0.50</span>
              <span>0.95</span>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Queue Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Samples</span>
              <span className="font-semibold text-white">{samples.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Above Threshold</span>
              <span className="font-semibold text-violet-400">{filteredSamples.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Selected</span>
              <span className="font-semibold text-brand-400">{selectedSamples.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Avg. Uncertainty</span>
              <span className="font-semibold text-white">
                {(filteredSamples.reduce((a, b) => a + b.uncertainty, 0) / filteredSamples.length).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 샘플 갤러리 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Recommended Samples</h3>
            <button 
              onClick={selectAll}
              className="btn-ghost text-sm"
            >
              {selectedSamples.length === samples.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Info className="w-4 h-4" />
            Click to select samples for labeling
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => toggleSelect(sample.id)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedSamples.includes(sample.id)
                  ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-slate-900'
                  : 'hover:ring-2 hover:ring-slate-600'
              }`}
            >
              {/* 이미지 플레이스홀더 */}
              <div className="aspect-square bg-slate-800 flex items-center justify-center relative">
                <Image className="w-10 h-10 text-slate-600" />
                
                {/* 선택 표시 */}
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedSamples.includes(sample.id)
                    ? 'bg-brand-500'
                    : 'bg-slate-800/80 opacity-0 group-hover:opacity-100'
                }`}>
                  {selectedSamples.includes(sample.id) ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-slate-400" />
                  )}
                </div>

                {/* 불확실도 바 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                    style={{ width: `${sample.uncertainty * 100}%` }}
                  />
                </div>
              </div>

              {/* 정보 */}
              <div className="p-3 bg-slate-800/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-violet-400">
                    {(sample.uncertainty * 100).toFixed(0)}% uncertain
                  </span>
                  <span className="text-xs text-slate-500">#{sample.id}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{sample.reason}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="badge badge-slate text-xs">{sample.predictedClass}</span>
                  <span className="text-xs text-slate-500">{sample.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더 보기 */}
        <div className="mt-6 text-center">
          <button className="btn-ghost">
            Load More Samples
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
