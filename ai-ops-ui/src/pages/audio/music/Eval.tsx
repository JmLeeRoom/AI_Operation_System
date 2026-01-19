import { 
  BarChart3,
  Play,
  Pause,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Clock,
  Disc,
  Music
} from 'lucide-react';
import { useState } from 'react';

export function MusicEval() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const autoMetrics = {
    tempoConsistency: 0.92,
    keyConsistency: 0.88,
    repetitionScore: 0.15,
    audioQuality: 0.91,
  };

  const evalSamples = [
    { 
      id: 1, 
      prompt: 'calm ambient piano with soft strings', 
      tempo: '90 BPM',
      duration: '30s',
      autoScore: 4.2,
      humanScore: null,
      status: 'pending_review'
    },
    { 
      id: 2, 
      prompt: 'upbeat electronic music with synth leads', 
      tempo: '128 BPM',
      duration: '30s',
      autoScore: 3.8,
      humanScore: 4.0,
      status: 'reviewed'
    },
    { 
      id: 3, 
      prompt: 'energetic rock with heavy drums', 
      tempo: '145 BPM',
      duration: '30s',
      autoScore: 4.5,
      humanScore: 4.5,
      status: 'approved'
    },
  ];

  const feedbackTags = [
    'Good melody',
    'Nice rhythm',
    'Too repetitive',
    'Abrupt ending',
    'Wrong tempo',
    'Audio artifacts',
    'Matches prompt',
    'Creative',
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'badge-emerald';
      case 'reviewed': return 'badge-cyan';
      case 'pending_review': return 'badge-amber';
      case 'rejected': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Music Evaluation
          </h1>
          <p className="text-slate-400 mt-1">자동 메트릭 + Human Review 워크플로</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Auto Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Tempo Consistency</p>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{(autoMetrics.tempoConsistency * 100).toFixed(0)}%</p>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${autoMetrics.tempoConsistency * 100}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Key Consistency</p>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{(autoMetrics.keyConsistency * 100).toFixed(0)}%</p>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500" style={{ width: `${autoMetrics.keyConsistency * 100}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Repetition Score</p>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{(autoMetrics.repetitionScore * 100).toFixed(0)}%</p>
          <p className="text-xs text-slate-500 mt-1">Lower is better</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Audio Quality</p>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{(autoMetrics.audioQuality * 100).toFixed(0)}%</p>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500" style={{ width: `${autoMetrics.audioQuality * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Human Review Queue */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Human Review Queue</h2>
            <span className="badge badge-amber">3 pending</span>
          </div>

          <div className="space-y-4">
            {evalSamples.map((sample) => (
              <div key={sample.id} className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-slate-200 mb-1">"{sample.prompt}"</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Disc className="w-3 h-3" />
                        {sample.tempo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sample.duration}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadge(sample.status)} capitalize`}>
                    {sample.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Waveform */}
                <div className="h-12 bg-slate-700/30 rounded-lg mb-3 flex items-center px-3">
                  <button 
                    className="btn-ghost p-1.5 mr-2"
                    onClick={() => setIsPlaying(isPlaying === sample.id ? null : sample.id)}
                  >
                    {isPlaying === sample.id ? (
                      <Pause className="w-4 h-4 text-brand-400" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex items-center gap-0.5 h-8 flex-1">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1 rounded-full ${isPlaying === sample.id ? 'bg-brand-400' : 'bg-slate-500'}`}
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Scores */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Auto Score</p>
                      <p className="text-lg font-bold text-cyan-400">{sample.autoScore}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Human Score</p>
                      <p className="text-lg font-bold text-white">
                        {sample.humanScore || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                {sample.status === 'pending_review' && (
                  <div className="border-t border-slate-700/50 pt-3">
                    <p className="text-xs text-slate-500 mb-2">Rate this sample:</p>
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button 
                          key={score}
                          className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-brand-500/30 text-slate-300 hover:text-white font-bold transition-all"
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Tags (select all that apply):</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {feedbackTags.slice(0, 6).map((tag) => (
                        <button key={tag} className="badge badge-slate cursor-pointer hover:bg-slate-600">
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-primary flex-1">
                        <CheckCircle className="w-4 h-4" />
                        Submit Review
                      </button>
                      <button className="btn-ghost text-rose-400">
                        Skip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Settings */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Review Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Samples</span>
                <span className="text-white">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reviewed</span>
                <span className="text-emerald-400">128</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pending</span>
                <span className="text-amber-400">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Human Score</span>
                <span className="text-white">4.1 / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Auto Score</span>
                <span className="text-white">4.0 / 5</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Common Issues</h2>
            <div className="space-y-2">
              {[
                { tag: 'Too repetitive', count: 23 },
                { tag: 'Abrupt ending', count: 15 },
                { tag: 'Audio artifacts', count: 8 },
                { tag: 'Wrong tempo', count: 5 },
              ].map((issue, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-sm text-slate-300">{issue.tag}</span>
                  <span className="badge badge-rose text-xs">{issue.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Actions</h2>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-center">
                <RefreshCw className="w-4 h-4" />
                Re-run Auto Eval
              </button>
              <button className="btn-ghost w-full justify-center">
                Export to Retrain Queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
