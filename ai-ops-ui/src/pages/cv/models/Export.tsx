import { 
  FileOutput,
  ArrowRight,
  Play,
  Download,
  Settings,
  Zap,
  Clock,
  HardDrive,
  Cpu,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useState } from 'react';

export function CVModelExport() {
  const [selectedModel, setSelectedModel] = useState('YOLOv8m-StreetScene-v3.2');
  const [exportFormat, setExportFormat] = useState('onnx');
  const [precision, setPrecision] = useState('fp16');

  const exportFormats = [
    { id: 'onnx', name: 'ONNX', description: 'Open Neural Network Exchange', recommended: true },
    { id: 'tensorrt', name: 'TensorRT', description: 'NVIDIA optimized inference', recommended: true },
    { id: 'torchscript', name: 'TorchScript', description: 'PyTorch JIT compilation', recommended: false },
    { id: 'openvino', name: 'OpenVINO', description: 'Intel optimized inference', recommended: false },
    { id: 'tflite', name: 'TensorFlow Lite', description: 'Mobile/Edge deployment', recommended: false },
    { id: 'coreml', name: 'CoreML', description: 'Apple devices', recommended: false },
  ];

  const precisionOptions = [
    { id: 'fp32', name: 'FP32', description: 'Full precision, best accuracy' },
    { id: 'fp16', name: 'FP16', description: 'Half precision, good balance' },
    { id: 'int8', name: 'INT8', description: 'Quantized, fastest inference' },
  ];

  const exportJobs = [
    { 
      id: 1, 
      model: 'YOLOv8m-StreetScene-v3.2', 
      format: 'ONNX', 
      precision: 'FP16',
      status: 'completed',
      size: '52.4 MB',
      latency: '8.2ms',
      throughput: '122 FPS',
      createdAt: '2 hours ago'
    },
    { 
      id: 2, 
      model: 'YOLOv8m-StreetScene-v3.2', 
      format: 'TensorRT', 
      precision: 'INT8',
      status: 'completed',
      size: '18.7 MB',
      latency: '3.1ms',
      throughput: '323 FPS',
      createdAt: '1 hour ago'
    },
    { 
      id: 3, 
      model: 'UNet-FactoryDefect-v2.1', 
      format: 'ONNX', 
      precision: 'FP32',
      status: 'running',
      size: '-',
      latency: '-',
      throughput: '-',
      createdAt: '10 mins ago'
    },
  ];

  const performanceComparison = [
    { format: 'PyTorch (Original)', latency: '15.4ms', throughput: '65 FPS', size: '104.2 MB', accuracy: '0.847' },
    { format: 'ONNX FP32', latency: '12.1ms', throughput: '83 FPS', size: '104.2 MB', accuracy: '0.847' },
    { format: 'ONNX FP16', latency: '8.2ms', throughput: '122 FPS', size: '52.4 MB', accuracy: '0.846' },
    { format: 'TensorRT FP16', latency: '4.5ms', throughput: '222 FPS', size: '48.1 MB', accuracy: '0.845' },
    { format: 'TensorRT INT8', latency: '3.1ms', throughput: '323 FPS', size: '18.7 MB', accuracy: '0.841' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <FileOutput className="w-5 h-5 text-white" />
            </div>
            Export & Optimize
          </h1>
          <p className="text-slate-400 mt-1">모델 변환 및 최적화 (ONNX/TensorRT/Quantization)</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Export 설정 */}
        <div className="col-span-2 space-y-6">
          {/* 모델 선택 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Model</h3>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="input-field w-full"
            >
              <option>YOLOv8m-StreetScene-v3.2</option>
              <option>YOLOv8l-StreetScene-v3.1</option>
              <option>UNet-FactoryDefect-v2.1</option>
              <option>HRNet-Pose-v1.5</option>
            </select>
          </div>

          {/* Export Format */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-3">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setExportFormat(format.id)}
                  className={`p-4 rounded-lg border text-left transition-all relative ${
                    exportFormat === format.id 
                      ? 'border-brand-500 bg-brand-500/10' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {format.recommended && (
                    <span className="absolute -top-2 -right-2 badge badge-emerald text-xs">
                      Recommended
                    </span>
                  )}
                  <p className={`font-medium ${exportFormat === format.id ? 'text-brand-400' : 'text-slate-200'}`}>
                    {format.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{format.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Precision */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Precision / Quantization</h3>
            <div className="grid grid-cols-3 gap-3">
              {precisionOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPrecision(opt.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    precision === opt.id 
                      ? 'border-brand-500 bg-brand-500/10' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <p className={`font-medium ${precision === opt.id ? 'text-brand-400' : 'text-slate-200'}`}>
                    {opt.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
                </button>
              ))}
            </div>

            {precision === 'int8' && (
              <div className="mt-4 p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-200">INT8 Calibration Required</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Select a calibration dataset for accurate INT8 quantization
                    </p>
                    <select className="input-field mt-2 text-sm py-2 w-full">
                      <option>Street Scene Detection v2.3 (val) - 4,523 images</option>
                      <option>Street Scene Detection v2.3 (train subset) - 1,000 images</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-400" />
              Advanced Options
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Input Shape</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={640} className="input-field text-center" readOnly />
                  <span className="text-slate-500">×</span>
                  <input type="number" value={640} className="input-field text-center" readOnly />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">Batch Size</label>
                <select className="input-field">
                  <option>1 (Static)</option>
                  <option>Dynamic</option>
                  <option>4 (Static)</option>
                  <option>8 (Static)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="simplify" defaultChecked className="w-4 h-4 accent-brand-500" />
                <label htmlFor="simplify" className="text-sm text-slate-300">ONNX Simplify</label>
              </div>
              <span className="text-xs text-slate-500">Remove redundant operations</span>
            </div>
          </div>

          {/* Start Export */}
          <button className="w-full btn-primary py-3 justify-center text-lg">
            <Zap className="w-5 h-5" />
            Start Export
          </button>
        </div>

        {/* 사이드 패널 */}
        <div className="space-y-4">
          {/* Performance Comparison */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Performance Comparison</h3>
            <div className="space-y-3">
              {performanceComparison.map((row, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-lg ${
                    row.format.includes(exportFormat.toUpperCase()) && row.format.toLowerCase().includes(precision.toLowerCase())
                      ? 'bg-brand-500/10 border border-brand-500/30'
                      : 'bg-slate-800/30'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-200 mb-2">{row.format}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Latency:</span>
                      <span className="text-slate-300">{row.latency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Throughput:</span>
                      <span className="text-slate-300">{row.throughput}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Size:</span>
                      <span className="text-slate-300">{row.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">mAP@0.5:</span>
                      <span className="text-slate-300">{row.accuracy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Exports */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Recent Exports</h3>
            <div className="space-y-3">
              {exportJobs.map((job) => (
                <div key={job.id} className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200 truncate flex-1">
                      {job.model.split('-').slice(0, 2).join('-')}
                    </span>
                    {job.status === 'completed' ? (
                      <span className="badge badge-emerald flex items-center gap-1 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Done
                      </span>
                    ) : (
                      <span className="badge badge-amber flex items-center gap-1 text-xs">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Running
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{job.format}</span>
                    <span>•</span>
                    <span>{job.precision}</span>
                    {job.status === 'completed' && (
                      <>
                        <span>•</span>
                        <span>{job.latency}</span>
                      </>
                    )}
                  </div>
                  {job.status === 'completed' && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{job.size}</span>
                      <button className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
