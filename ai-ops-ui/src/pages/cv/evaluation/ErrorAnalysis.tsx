import { 
  AlertTriangle,
  Image,
  Filter,
  Search,
  Eye,
  EyeOff,
  Send,
  Download,
  ChevronDown,
  Grid3X3,
  List,
  ZoomIn,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';

export function ErrorAnalysis() {
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [errorType, setErrorType] = useState<'all' | 'fp' | 'fn'>('all');
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);

  const errorStats = {
    total: 1245,
    falsePositives: 534,
    falseNegatives: 711,
    topErrorClasses: [
      { name: 'Bicycle → Motorcycle', count: 156, percentage: 12.5 },
      { name: 'Truck → Bus', count: 134, percentage: 10.8 },
      { name: 'Missing Person', count: 289, percentage: 23.2 },
      { name: 'Small Object FN', count: 198, percentage: 15.9 },
    ]
  };

  const errorSamples = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    filename: `street_scene_${String(i * 100 + 234).padStart(5, '0')}.jpg`,
    errorType: i % 3 === 0 ? 'FP' : 'FN',
    predictedClass: ['Car', 'Person', 'Truck', 'Bicycle'][i % 4],
    actualClass: i % 3 === 0 ? 'Background' : ['Person', 'Motorcycle', 'Bus', 'Motorcycle'][i % 4],
    confidence: 0.5 + Math.random() * 0.4,
    iou: i % 3 === 0 ? null : 0.2 + Math.random() * 0.5,
    objectSize: ['small', 'medium', 'large'][i % 3],
    reason: ['Low confidence', 'Class confusion', 'Occlusion', 'Small object', 'Bad lighting'][i % 5],
  }));

  const clusters = [
    { id: 1, name: 'Occluded Pedestrians', count: 89, samples: 5 },
    { id: 2, name: 'Night Scene Vehicles', count: 67, samples: 4 },
    { id: 3, name: 'Small Traffic Signs', count: 123, samples: 6 },
    { id: 4, name: 'Cyclist/Motorcycle Confusion', count: 156, samples: 8 },
  ];

  const confusionMatrix = [
    { actual: 'Car', predicted: 'Truck', count: 45 },
    { actual: 'Truck', predicted: 'Bus', count: 134 },
    { actual: 'Bicycle', predicted: 'Motorcycle', count: 156 },
    { actual: 'Person', predicted: 'Background', count: 89 },
    { actual: 'Motorcycle', predicted: 'Bicycle', count: 78 },
  ];

  const toggleSelect = (id: number) => {
    setSelectedSamples(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            Error Analysis Studio
          </h1>
          <p className="text-slate-400 mt-1">FP/FN 분석 및 실패 케이스 클러스터링</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
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

      {/* 통계 개요 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-3xl font-bold text-white">{errorStats.total.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Errors</p>
        </div>
        <div className="stat-card cursor-pointer hover:border-rose-500/30" onClick={() => setErrorType('fp')}>
          <p className="text-3xl font-bold text-rose-400">{errorStats.falsePositives}</p>
          <p className="text-sm text-slate-400">False Positives</p>
        </div>
        <div className="stat-card cursor-pointer hover:border-amber-500/30" onClick={() => setErrorType('fn')}>
          <p className="text-3xl font-bold text-amber-400">{errorStats.falseNegatives}</p>
          <p className="text-sm text-slate-400">False Negatives</p>
        </div>
        <div className="stat-card">
          <p className="text-3xl font-bold text-violet-400">{clusters.length}</p>
          <p className="text-sm text-slate-400">Error Clusters</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 메인 갤러리 */}
        <div className="col-span-3 space-y-4">
          {/* 필터 바 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
                <button 
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${errorType === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  onClick={() => setErrorType('all')}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${errorType === 'fp' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400'}`}
                  onClick={() => setErrorType('fp')}
                >
                  False Positives
                </button>
                <button 
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${errorType === 'fn' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`}
                  onClick={() => setErrorType('fn')}
                >
                  False Negatives
                </button>
              </div>
              <select className="input-field w-40 text-sm py-1.5">
                <option>All Classes</option>
                <option>Car</option>
                <option>Person</option>
                <option>Truck</option>
              </select>
              <select className="input-field w-40 text-sm py-1.5">
                <option>All Sizes</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setOverlayVisible(!overlayVisible)}
                className={`btn-ghost text-sm ${overlayVisible ? 'text-brand-400' : ''}`}
              >
                {overlayVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button 
                className={`p-2 rounded-lg ${viewMode === 'gallery' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                onClick={() => setViewMode('gallery')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
            <span className="text-sm text-slate-400">Confidence Threshold:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <span className="text-sm font-medium text-white w-12">{confidenceThreshold.toFixed(2)}</span>
          </div>

          {/* 에러 갤러리 */}
          <div className="glass-card p-6">
            <div className="grid grid-cols-4 gap-4">
              {errorSamples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => toggleSelect(sample.id)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedSamples.includes(sample.id)
                      ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-slate-900'
                      : 'hover:ring-2 hover:ring-slate-600'
                  }`}
                >
                  {/* 이미지 */}
                  <div className="aspect-square bg-slate-800 flex items-center justify-center relative">
                    <Image className="w-10 h-10 text-slate-600" />
                    
                    {/* 오버레이 */}
                    {overlayVisible && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-12 h-10 border-2 rounded ${
                          sample.errorType === 'FP' ? 'border-rose-500' : 'border-amber-500 border-dashed'
                        }`} />
                      </div>
                    )}

                    {/* 에러 타입 뱃지 */}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${
                      sample.errorType === 'FP' 
                        ? 'bg-rose-500/80 text-white' 
                        : 'bg-amber-500/80 text-white'
                    }`}>
                      {sample.errorType}
                    </div>

                    {/* 선택 표시 */}
                    <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedSamples.includes(sample.id)
                        ? 'bg-brand-500 border-brand-500'
                        : 'border-white/50 opacity-0 group-hover:opacity-100'
                    }`}>
                      {selectedSamples.includes(sample.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="p-3 bg-slate-800/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Pred:</span>
                      <span className="text-xs font-medium text-slate-200">{sample.predictedClass}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Actual:</span>
                      <span className="text-xs font-medium text-slate-200">{sample.actualClass}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Conf:</span>
                      <span className={`text-xs font-medium ${
                        sample.confidence > 0.7 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {sample.confidence.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-xs text-slate-500">{sample.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-2 pt-6 mt-4 border-t border-slate-700/50">
              <button className="btn-ghost text-sm">Previous</button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, '...', 52].map((page, i) => (
                  <button 
                    key={i}
                    className={`w-8 h-8 rounded-lg text-sm ${page === 1 ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="btn-ghost text-sm">Next</button>
            </div>
          </div>
        </div>

        {/* 사이드 패널 */}
        <div className="space-y-4">
          {/* Top Error Patterns */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Top Error Patterns</h3>
            <div className="space-y-3">
              {errorStats.topErrorClasses.map((error, i) => (
                <div key={i} className="p-3 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-200">{error.name}</span>
                    <span className="text-xs text-slate-400">{error.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${error.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Clusters */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-400" />
              Auto-Detected Clusters
            </h3>
            <div className="space-y-2">
              {clusters.map((cluster) => (
                <div 
                  key={cluster.id}
                  className="p-3 border border-slate-700 rounded-lg cursor-pointer hover:border-brand-500/50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-200">{cluster.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">{cluster.count} samples</span>
                    <button className="text-xs text-brand-400 hover:underline">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confusion Pairs */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Top Confusion Pairs</h3>
            <div className="space-y-2">
              {confusionMatrix.map((pair, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg text-sm cursor-pointer hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{pair.actual}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-rose-400">{pair.predicted}</span>
                  </div>
                  <span className="text-slate-400">{pair.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
