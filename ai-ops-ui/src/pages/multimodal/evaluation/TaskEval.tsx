import { 
  BarChart3,
  Play,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Image,
  Video,
  Search,
  Download
} from 'lucide-react';
import { useState } from 'react';

export function TaskEval() {
  const [selectedTask, setSelectedTask] = useState('vqa');

  const tasks = [
    { id: 'vqa', name: 'VQA', icon: Image, description: 'Visual Question Answering' },
    { id: 'caption', name: 'Caption', icon: Image, description: 'Image Captioning' },
    { id: 'retrieval', name: 'Retrieval', icon: Search, description: 'Image-Text Retrieval' },
    { id: 'videoqa', name: 'VideoQA', icon: Video, description: 'Video Question Answering' },
  ];

  const evalResults = {
    vqa: {
      metrics: [
        { name: 'Accuracy', current: 78.5, baseline: 75.2, change: '+3.3%' },
        { name: 'F1 Score', current: 81.2, baseline: 78.9, change: '+2.3%' },
        { name: 'Exact Match', current: 65.8, baseline: 63.1, change: '+2.7%' },
      ],
      passGate: true,
      threshold: 75,
    },
    caption: {
      metrics: [
        { name: 'BLEU-4', current: 36.2, baseline: 34.8, change: '+1.4' },
        { name: 'CIDEr', current: 128.5, baseline: 125.2, change: '+3.3' },
        { name: 'METEOR', current: 29.8, baseline: 28.5, change: '+1.3' },
      ],
      passGate: true,
      threshold: 35,
    },
    retrieval: {
      metrics: [
        { name: 'R@1', current: 68.2, baseline: 65.5, change: '+2.7%' },
        { name: 'R@5', current: 89.5, baseline: 87.2, change: '+2.3%' },
        { name: 'R@10', current: 95.1, baseline: 93.8, change: '+1.3%' },
      ],
      passGate: true,
      threshold: 65,
    },
    videoqa: {
      metrics: [
        { name: 'Accuracy', current: 62.5, baseline: 65.2, change: '-2.7%' },
        { name: 'Temporal', current: 58.2, baseline: 60.1, change: '-1.9%' },
        { name: 'Causal', current: 55.8, baseline: 56.2, change: '-0.4%' },
      ],
      passGate: false,
      threshold: 65,
    },
  };

  const currentResults = evalResults[selectedTask as keyof typeof evalResults];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-violet-400" />
            </div>
            Task Evaluation
          </h1>
          <p className="text-slate-400 mt-1">VQA, Caption, Retrieval, VideoQA 평가</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Settings className="w-4 h-4" />
            Configure
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Run Evaluation
          </button>
        </div>
      </div>

      {/* Task 선택 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          const results = evalResults[task.id as keyof typeof evalResults];
          return (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedTask === task.id
                  ? 'bg-violet-500/20 border-violet-500/50'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${selectedTask === task.id ? 'text-violet-400' : 'text-slate-400'}`} />
                {results.passGate ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <h3 className="font-semibold text-slate-200">{task.name}</h3>
              <p className="text-xs text-slate-500">{task.description}</p>
            </button>
          );
        })}
      </div>

      {/* 평가 결과 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메트릭 카드 */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Metrics</h2>
            <div className="flex items-center gap-2">
              <span className={`badge ${currentResults.passGate ? 'badge-emerald' : 'badge-rose'}`}>
                {currentResults.passGate ? 'PASS' : 'FAIL'}
              </span>
              <span className="text-sm text-slate-500">Threshold: {currentResults.threshold}</span>
            </div>
          </div>

          <div className="space-y-4">
            {currentResults.metrics.map((metric, idx) => {
              const isPositive = metric.change.startsWith('+');
              return (
                <div key={idx} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-200">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">Current</span>
                        <span className="text-slate-200 font-mono">{metric.current}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(metric.current, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      Baseline: {metric.baseline}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Model Version</label>
                <select className="input-field mt-1">
                  <option>vlm-instruct-v2.1</option>
                  <option>vlm-instruct-v2.0</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Baseline Model</label>
                <select className="input-field mt-1">
                  <option>vlm-instruct-v2.0</option>
                  <option>vlm-instruct-v1.5</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Test Set</label>
                <select className="input-field mt-1">
                  <option>VQAv2 Test</option>
                  <option>GQA Test</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-center">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="btn-ghost w-full justify-center">
                View Detailed Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
