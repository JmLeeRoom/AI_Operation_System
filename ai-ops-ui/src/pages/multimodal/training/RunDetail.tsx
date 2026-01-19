import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Download,
  Clock,
  Cpu,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image,
  FileText,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function RunDetail() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'samples' | 'logs'>('metrics');

  const run = {
    id: 'vlm-train-047',
    name: 'VLM Instruction Tuning',
    status: 'running',
    startTime: '2024-01-18 14:30',
    elapsed: '8h 32m',
    progress: 67,
    currentStep: 45000,
    totalSteps: 67500,
  };

  const metrics = {
    loss: [2.4, 2.1, 1.8, 1.5, 1.3, 1.2, 1.1, 1.05],
    accuracy: [45, 52, 58, 63, 67, 70, 72, 74],
  };

  const throughput = {
    framesPerSec: 1250,
    tokensPerSec: 8500,
    samplesPerSec: 45,
  };

  const sampleResults = [
    {
      id: 1,
      image: null,
      question: 'What is the main object in this image?',
      answer: 'A golden retriever dog playing with a red ball in a grassy park.',
      confidence: 0.92,
    },
    {
      id: 2,
      image: null,
      question: 'How many people are in the scene?',
      answer: 'There are three people sitting at the table.',
      confidence: 0.88,
    },
    {
      id: 3,
      image: null,
      question: 'Describe the weather conditions.',
      answer: 'It appears to be a sunny day with clear blue skies.',
      confidence: 0.95,
    },
  ];

  const failureReasons = [
    { reason: 'OOM (Frame overflow)', count: 3, severity: 'high' },
    { reason: 'Data pair mismatch', count: 12, severity: 'medium' },
    { reason: 'Tokenizer error', count: 2, severity: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link 
          to="/multimodal/training/runs" 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{run.id}</h1>
            <span className="badge badge-cyan flex items-center gap-1">
              <span className="status-dot" style={{ background: '#22d3ee' }} />
              {run.status}
            </span>
          </div>
          <p className="text-slate-400">{run.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Pause className="w-4 h-4" />
            Pause
          </button>
          <button className="btn-ghost">
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
          <button className="btn-ghost">
            <Download className="w-4 h-4" />
            Logs
          </button>
        </div>
      </div>

      {/* 진행률 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-slate-400">Progress</p>
              <p className="text-2xl font-bold text-slate-100">{run.progress}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Steps</p>
              <p className="text-2xl font-bold text-slate-100">{run.currentStep.toLocaleString()} / {run.totalSteps.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Elapsed</p>
              <p className="text-2xl font-bold text-slate-100">{run.elapsed}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">ETA</p>
            <p className="text-lg font-medium text-slate-300">~4h 15m</p>
          </div>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${run.progress}%` }}
          />
        </div>
      </div>

      {/* Throughput */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400 text-sm">Frames/sec</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{throughput.framesPerSec.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-sm">Tokens/sec</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{throughput.tokensPerSec.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-sm">Samples/sec</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{throughput.samplesPerSec}</p>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="glass-card p-0">
        <div className="border-b border-slate-700/50">
          <nav className="flex">
            {(['metrics', 'samples', 'logs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-cyan-500 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'metrics' && 'Loss & Metrics'}
                {tab === 'samples' && 'Sample Results'}
                {tab === 'logs' && 'Logs & Errors'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loss Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                    Training Loss
                  </h3>
                  <div className="h-48 bg-slate-800/50 rounded-lg flex items-end p-4 gap-2">
                    {metrics.loss.map((val, idx) => (
                      <div 
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                        style={{ height: `${(val / 2.4) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Step 0</span>
                    <span>Current: {metrics.loss[metrics.loss.length - 1]}</span>
                    <span>Step {run.currentStep}</span>
                  </div>
                </div>

                {/* Accuracy Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-violet-400" />
                    Validation Accuracy
                  </h3>
                  <div className="h-48 bg-slate-800/50 rounded-lg flex items-end p-4 gap-2">
                    {metrics.accuracy.map((val, idx) => (
                      <div 
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-violet-500 to-violet-400 rounded-t"
                        style={{ height: `${val}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Epoch 1</span>
                    <span>Current: {metrics.accuracy[metrics.accuracy.length - 1]}%</span>
                    <span>Epoch 8</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Sample Predictions</h3>
              {sampleResults.map((sample) => (
                <div 
                  key={sample.id}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-slate-700 rounded-lg shrink-0 flex items-center justify-center">
                      <Image className="w-8 h-8 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 mb-1">Q: {sample.question}</p>
                      <p className="text-slate-200 mb-2">A: {sample.answer}</p>
                      <span className={`badge ${sample.confidence >= 0.9 ? 'badge-emerald' : 'badge-amber'}`}>
                        Confidence: {(sample.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Failure Analysis</h3>
                <div className="space-y-2">
                  {failureReasons.map((failure, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border flex items-center justify-between ${
                        failure.severity === 'high' ? 'bg-rose-900/10 border-rose-500/30' :
                        failure.severity === 'medium' ? 'bg-amber-900/10 border-amber-500/30' :
                        'bg-slate-800/50 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {failure.severity === 'high' && <XCircle className="w-5 h-5 text-rose-400" />}
                        {failure.severity === 'medium' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                        {failure.severity === 'low' && <AlertTriangle className="w-5 h-5 text-slate-400" />}
                        <span className="text-slate-200">{failure.reason}</span>
                      </div>
                      <span className="text-slate-400">{failure.count} occurrences</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Logs</h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-slate-500">[2024-01-18 23:02:15] INFO: Step 45000/67500, Loss: 1.05</p>
                  <p className="text-emerald-400">[2024-01-18 23:02:15] INFO: Checkpoint saved: ckpt-45000.pt</p>
                  <p className="text-slate-500">[2024-01-18 23:02:10] INFO: Batch processed, frames: 512, tokens: 4096</p>
                  <p className="text-amber-400">[2024-01-18 23:01:55] WARN: High memory usage: 78GB/80GB</p>
                  <p className="text-slate-500">[2024-01-18 23:01:50] INFO: Step 44999/67500, Loss: 1.06</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
