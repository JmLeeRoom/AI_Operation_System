import { 
  GitCompare,
  Play,
  Plus,
  Image,
  Video,
  FileAudio,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { useState } from 'react';

export function Regression() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const regressionCases = [
    {
      id: 1,
      modality: 'image',
      prompt: 'What is the main subject of this image?',
      baseline: 'A golden retriever playing in the park.',
      current: 'A golden retriever dog playing with a ball in a grassy park area.',
      status: 'improved',
      diff: '+detail',
    },
    {
      id: 2,
      modality: 'image',
      prompt: 'How many people are visible?',
      baseline: 'There are 3 people in the image.',
      current: 'There are 2 people in the image.',
      status: 'regressed',
      diff: 'count mismatch',
    },
    {
      id: 3,
      modality: 'video',
      prompt: 'Summarize the main action in this video.',
      baseline: 'A chef is preparing a pasta dish in a kitchen.',
      current: 'A chef prepares pasta in a professional kitchen, adding ingredients and stirring.',
      status: 'improved',
      diff: '+detail',
    },
    {
      id: 4,
      modality: 'image',
      prompt: 'What color is the car?',
      baseline: 'The car is red.',
      current: 'The car is red.',
      status: 'unchanged',
      diff: 'identical',
    },
    {
      id: 5,
      modality: 'video',
      prompt: 'What happens at timestamp 0:30?',
      baseline: 'The speaker raises their hand.',
      current: 'The speaker gestures towards the audience.',
      status: 'regressed',
      diff: 'different action',
    },
  ];

  const stats = {
    total: regressionCases.length,
    improved: regressionCases.filter(c => c.status === 'improved').length,
    regressed: regressionCases.filter(c => c.status === 'regressed').length,
    unchanged: regressionCases.filter(c => c.status === 'unchanged').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-cyan-400" />
            </div>
            Regression Tests
          </h1>
          <p className="text-slate-400 mt-1">고정 프롬프트 세트 A/B 비교 및 Diff 분석</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add Case
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Run Tests
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Cases</p>
          <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-slate-400 text-sm">Improved</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.improved}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-rose-400" />
            <p className="text-slate-400 text-sm">Regressed</p>
          </div>
          <p className="text-2xl font-bold text-rose-400">{stats.regressed}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <p className="text-slate-400 text-sm">Unchanged</p>
          </div>
          <p className="text-2xl font-bold text-slate-400">{stats.unchanged}</p>
        </div>
      </div>

      {/* Gate Status */}
      {stats.regressed > 0 && (
        <div className="p-4 rounded-lg bg-rose-900/20 border border-rose-500/30 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
          <div className="flex-1">
            <p className="text-rose-400 font-medium">Regression Detected</p>
            <p className="text-sm text-slate-400">{stats.regressed} cases have regressed. Deployment blocked until resolved.</p>
          </div>
          <button className="btn-secondary text-sm">Review Issues</button>
        </div>
      )}

      {/* 케이스 목록 */}
      <div className="glass-card p-0">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Test Cases</h2>
          <button className="btn-ghost text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="divide-y divide-slate-700/50">
          {regressionCases.map((testCase) => (
            <div 
              key={testCase.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedCase === testCase.id ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'
              }`}
              onClick={() => setSelectedCase(selectedCase === testCase.id ? null : testCase.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  {testCase.modality === 'image' && <Image className="w-5 h-5 text-violet-400" />}
                  {testCase.modality === 'video' && <Video className="w-5 h-5 text-cyan-400" />}
                  {testCase.modality === 'audio' && <FileAudio className="w-5 h-5 text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium truncate">{testCase.prompt}</p>
                  <p className="text-sm text-slate-500">{testCase.diff}</p>
                </div>
                <span className={`badge ${
                  testCase.status === 'improved' ? 'badge-emerald' :
                  testCase.status === 'regressed' ? 'badge-rose' : 'badge-slate'
                }`}>
                  {testCase.status === 'improved' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {testCase.status === 'regressed' && <XCircle className="w-3 h-3 mr-1" />}
                  {testCase.status}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${
                  selectedCase === testCase.id ? 'rotate-90' : ''
                }`} />
              </div>

              {/* 확장된 비교 뷰 */}
              {selectedCase === testCase.id && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                    <p className="text-xs text-slate-500 mb-2">Baseline (v2.0)</p>
                    <p className="text-slate-300">{testCase.baseline}</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    testCase.status === 'improved' ? 'bg-emerald-900/10 border-emerald-500/30' :
                    testCase.status === 'regressed' ? 'bg-rose-900/10 border-rose-500/30' :
                    'bg-slate-900/50 border-slate-700/50'
                  }`}>
                    <p className="text-xs text-slate-500 mb-2">Current (v2.1)</p>
                    <p className="text-slate-300">{testCase.current}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 악화 케이스 리스트 */}
      {stats.regressed > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            Regressed Cases - Action Required
          </h2>
          <div className="space-y-3">
            {regressionCases.filter(c => c.status === 'regressed').map((testCase) => (
              <div 
                key={testCase.id}
                className="p-4 rounded-lg bg-rose-900/10 border border-rose-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {testCase.modality === 'image' && <Image className="w-5 h-5 text-rose-400" />}
                  {testCase.modality === 'video' && <Video className="w-5 h-5 text-rose-400" />}
                  <div>
                    <p className="text-slate-200">{testCase.prompt}</p>
                    <p className="text-sm text-slate-500">{testCase.diff}</p>
                  </div>
                </div>
                <button className="btn-secondary text-sm">
                  <Eye className="w-4 h-4" />
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
