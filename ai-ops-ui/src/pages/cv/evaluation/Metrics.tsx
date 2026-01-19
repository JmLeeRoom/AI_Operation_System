import { 
  BarChart3,
  Play,
  Download,
  RefreshCw,
  TrendingUp,
  Target,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { useState } from 'react';

export function CVMetrics() {
  const [selectedModel, setSelectedModel] = useState('YOLOv8m-StreetScene-v3');
  const [selectedDataset, setSelectedDataset] = useState('Street Scene Detection v2.3 (test)');

  const overallMetrics = {
    mAP50: 0.847,
    mAP5095: 0.623,
    precision: 0.891,
    recall: 0.812,
    f1: 0.850,
    inferenceTime: '12.4ms'
  };

  const perClassMetrics = [
    { class: 'Car', ap50: 0.921, ap5095: 0.734, precision: 0.934, recall: 0.892, support: 12540 },
    { class: 'Person', ap50: 0.889, ap5095: 0.678, precision: 0.912, recall: 0.856, support: 8920 },
    { class: 'Truck', ap50: 0.834, ap5095: 0.598, precision: 0.867, recall: 0.789, support: 3210 },
    { class: 'Bus', ap50: 0.812, ap5095: 0.567, precision: 0.845, recall: 0.756, support: 2150 },
    { class: 'Motorcycle', ap50: 0.778, ap5095: 0.523, precision: 0.801, recall: 0.712, support: 1890 },
    { class: 'Bicycle', ap50: 0.756, ap5095: 0.489, precision: 0.789, recall: 0.698, support: 1560 },
    { class: 'Traffic Light', ap50: 0.867, ap5095: 0.612, precision: 0.889, recall: 0.823, support: 1230 },
    { class: 'Traffic Sign', ap50: 0.834, ap5095: 0.578, precision: 0.856, recall: 0.789, support: 840 },
  ];

  const sizeMetrics = [
    { size: 'Small (<32²)', ap: 0.456, count: 4520 },
    { size: 'Medium (32²-96²)', ap: 0.678, count: 12340 },
    { size: 'Large (>96²)', ap: 0.812, count: 8450 },
  ];

  const confusionData = [
    ['Car', 'Person', 'Truck', 'Bus', 'Motorcycle', 'Bicycle'],
    [0.92, 0.02, 0.04, 0.01, 0.01, 0.00],
    [0.03, 0.89, 0.01, 0.01, 0.04, 0.02],
    [0.05, 0.01, 0.83, 0.08, 0.02, 0.01],
    [0.02, 0.01, 0.12, 0.81, 0.03, 0.01],
    [0.02, 0.05, 0.03, 0.02, 0.78, 0.10],
    [0.01, 0.04, 0.01, 0.01, 0.15, 0.78],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Evaluation Metrics
          </h1>
          <p className="text-slate-400 mt-1">모델 성능 평가 및 메트릭 분석</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Run Evaluation
          </button>
        </div>
      </div>

      {/* 모델/데이터셋 선택 */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Model</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="input-field"
          >
            <option>YOLOv8m-StreetScene-v3</option>
            <option>YOLOv8l-StreetScene-v2</option>
            <option>YOLOv8s-StreetScene-v1</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Dataset</label>
          <select 
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="input-field"
          >
            <option>Street Scene Detection v2.3 (test)</option>
            <option>Street Scene Detection v2.3 (val)</option>
            <option>Street Scene Detection v2.2 (test)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Baseline (Compare)</label>
          <select className="input-field">
            <option>None</option>
            <option>YOLOv8l-StreetScene-v2</option>
            <option>Previous Best</option>
          </select>
        </div>
      </div>

      {/* 전체 메트릭 */}
      <div className="grid grid-cols-6 gap-4">
        <div className="stat-card text-center">
          <p className="text-3xl font-bold text-cyan-400">{overallMetrics.mAP50.toFixed(3)}</p>
          <p className="text-sm text-slate-400">mAP@0.5</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-bold text-violet-400">{overallMetrics.mAP5095.toFixed(3)}</p>
          <p className="text-sm text-slate-400">mAP@0.5:0.95</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-bold text-emerald-400">{overallMetrics.precision.toFixed(3)}</p>
          <p className="text-sm text-slate-400">Precision</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-bold text-amber-400">{overallMetrics.recall.toFixed(3)}</p>
          <p className="text-sm text-slate-400">Recall</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-bold text-rose-400">{overallMetrics.f1.toFixed(3)}</p>
          <p className="text-sm text-slate-400">F1 Score</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-bold text-white">{overallMetrics.inferenceTime}</p>
          <p className="text-sm text-slate-400">Inference Time</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Per-Class Metrics */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-400" />
              Per-Class Performance
            </h3>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-slate-700/50">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>AP@0.5</th>
                  <th>AP@0.5:0.95</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                {perClassMetrics.map((row) => (
                  <tr key={row.class}>
                    <td className="font-medium text-slate-200">{row.class}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${row.ap50 * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-300">{row.ap50.toFixed(3)}</span>
                      </div>
                    </td>
                    <td className="text-slate-300">{row.ap5095.toFixed(3)}</td>
                    <td className="text-slate-300">{row.precision.toFixed(3)}</td>
                    <td className="text-slate-300">{row.recall.toFixed(3)}</td>
                    <td className="text-slate-400">{row.support.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Size-based Metrics */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Performance by Object Size
            </h3>
            <div className="space-y-4">
              {sizeMetrics.map((size) => (
                <div key={size.size}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{size.size}</span>
                    <span className="text-sm font-medium text-slate-200">{size.ap.toFixed(3)}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        size.ap >= 0.7 ? 'bg-emerald-500' : 
                        size.ap >= 0.5 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${size.ap * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{size.count.toLocaleString()} objects</p>
                </div>
              ))}
            </div>
          </div>

          {/* Confusion Matrix Preview */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Confusion Matrix</h3>
            <div className="grid grid-cols-6 gap-0.5 text-xs">
              {confusionData.slice(1).map((row, i) => (
                row.map((val, j) => (
                  <div 
                    key={`${i}-${j}`}
                    className={`aspect-square flex items-center justify-center rounded ${
                      i === j 
                        ? 'bg-emerald-500/30 text-emerald-400' 
                        : (typeof val === 'number' && val > 0.05)
                          ? 'bg-rose-500/30 text-rose-400' 
                          : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {typeof val === 'number' ? val.toFixed(2) : val}
                  </div>
                ))
              ))}
            </div>
            <button className="w-full mt-4 btn-ghost text-sm justify-center">
              View Full Matrix
            </button>
          </div>
        </div>
      </div>

      {/* PR Curve Placeholder */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            Precision-Recall Curves
          </h3>
          <div className="flex items-center gap-2">
            <select className="input-field text-sm py-1.5 w-32">
              <option>All Classes</option>
              <option>Car</option>
              <option>Person</option>
            </select>
          </div>
        </div>
        
        {/* PR Curve 플레이스홀더 */}
        <div className="h-64 bg-slate-800/30 rounded-lg flex items-center justify-center border border-slate-700/50">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500">Precision-Recall Curve</p>
            <p className="text-xs text-slate-600 mt-1">Interactive chart would be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
