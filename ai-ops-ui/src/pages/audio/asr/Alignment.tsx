import { 
  GitMerge,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  Search,
  Filter,
  Volume2
} from 'lucide-react';
import { useState } from 'react';

export function ASRAlignment() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2.5);
  const totalDuration = 12.8;

  const alignedWords = [
    { word: '안녕하세요', start: 0.0, end: 0.8, confidence: 0.98 },
    { word: '고객', start: 0.9, end: 1.3, confidence: 0.95 },
    { word: '센터', start: 1.35, end: 1.7, confidence: 0.96 },
    { word: '입니다', start: 1.75, end: 2.2, confidence: 0.94 },
    { word: '무엇을', start: 2.5, end: 2.9, confidence: 0.88 },
    { word: '도와', start: 2.95, end: 3.2, confidence: 0.72 },
    { word: '드릴까요', start: 3.25, end: 3.9, confidence: 0.91 },
  ];

  const pendingAlignments = [
    { id: 1, segment: 'call_015_seg_03', status: 'failed', reason: 'Length mismatch', duration: '15.2s' },
    { id: 2, segment: 'podcast_008_seg_22', status: 'low_conf', reason: 'Low confidence (< 0.7)', duration: '8.5s' },
    { id: 3, segment: 'meeting_002_seg_14', status: 'failed', reason: 'No speech detected', duration: '3.1s' },
  ];

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'bg-emerald-500';
    if (conf >= 0.7) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getConfidenceTextColor = (conf: number) => {
    if (conf >= 0.9) return 'text-emerald-400';
    if (conf >= 0.7) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alignment & Confidence</h1>
          <p className="text-slate-400 mt-1">CTC/Forced Alignment 기반 단어별 시간 정렬</p>
        </div>
        <button className="btn-primary">
          <RefreshCw className="w-4 h-4" />
          Run Alignment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽: Alignment Viewer */}
        <div className="col-span-2 space-y-6">
          {/* Waveform & Player */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-cyan-400" />
                Alignment Viewer
              </h2>
              <span className="font-mono text-sm text-slate-400">call_001_seg_01.wav</span>
            </div>

            {/* Waveform Placeholder */}
            <div className="relative h-24 bg-slate-800/50 rounded-lg mb-4 overflow-hidden">
              {/* 진행 표시 */}
              <div 
                className="absolute top-0 bottom-0 left-0 bg-brand-500/20 border-r-2 border-brand-500"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
              
              {/* Waveform */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-0.5 h-16">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-slate-500 rounded-full"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Word markers */}
              {alignedWords.map((word, idx) => (
                <div 
                  key={idx}
                  className="absolute bottom-0 h-1"
                  style={{ 
                    left: `${(word.start / totalDuration) * 100}%`,
                    width: `${((word.end - word.start) / totalDuration) * 100}%`,
                  }}
                >
                  <div className={`h-full ${getConfidenceColor(word.confidence)} rounded-full`} />
                </div>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="btn-ghost p-2">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button 
                  className="btn-primary p-2"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="btn-ghost p-2">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-slate-400">
                  {currentTime.toFixed(1)}s / {totalDuration}s
                </span>
                <select className="input-field py-1.5 text-sm">
                  <option>1.0x</option>
                  <option>0.5x</option>
                  <option>0.75x</option>
                  <option>1.5x</option>
                  <option>2.0x</option>
                </select>
              </div>
            </div>

            {/* Word-level alignment */}
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-500 mb-3">Word-level Alignment (click to edit)</p>
              <div className="flex flex-wrap gap-2">
                {alignedWords.map((word, idx) => (
                  <div 
                    key={idx}
                    className={`relative px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                      currentTime >= word.start && currentTime <= word.end
                        ? 'bg-brand-500/30 ring-2 ring-brand-500'
                        : 'bg-slate-700/50'
                    }`}
                  >
                    <span className="text-slate-200">{word.word}</span>
                    <div className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${getConfidenceColor(word.confidence)}`} />
                    <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-xs ${getConfidenceTextColor(word.confidence)}`}>
                      {(word.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Edit */}
            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Selected Word</label>
                    <input type="text" className="input-field py-1.5 text-sm w-24" defaultValue="도와" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Start (s)</label>
                    <input type="number" className="input-field py-1.5 text-sm w-20" defaultValue="2.95" step="0.05" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">End (s)</label>
                    <input type="number" className="input-field py-1.5 text-sm w-20" defaultValue="3.20" step="0.05" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost text-sm py-1.5">
                    <RefreshCw className="w-4 h-4" />
                    Re-align
                  </button>
                  <button className="btn-primary text-sm py-1.5">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: Pending & Failed */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Alignment Issues
            </h2>

            <div className="space-y-3">
              {pendingAlignments.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-slate-200">{item.segment}</span>
                    <span className={`badge ${item.status === 'failed' ? 'badge-rose' : 'badge-amber'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.reason}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">{item.duration}</span>
                    <button className="btn-ghost text-xs py-1">
                      <Eye className="w-3.5 h-3.5" />
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
              <p className="text-sm text-slate-400 mb-2">3 issues pending review</p>
              <button className="btn-secondary w-full">
                Review All
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Alignment Settings</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500">Algorithm</label>
                <select className="input-field py-2 text-sm">
                  <option>CTC Alignment</option>
                  <option>Forced Alignment (Montreal)</option>
                  <option>Kaldi Alignment</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-slate-500">Confidence Threshold</label>
                <input type="range" min="0" max="1" step="0.05" defaultValue="0.7" className="w-full accent-brand-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0</span>
                  <span className="text-brand-400">0.7</span>
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
