import { 
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Settings,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Edit,
  RefreshCw,
  Zap,
  AudioWaveform,
  Radio,
  Clock
} from 'lucide-react';
import { useState } from 'react';

export function ASRPlayground() {
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);

  const transcriptResults = {
    partial: '안녕하세요 고객',
    final: '안녕하세요 고객 센터 입니다 무엇을 도와 드릴까요',
    words: [
      { word: '안녕하세요', confidence: 0.98, start: 0.0, end: 0.8 },
      { word: '고객', confidence: 0.95, start: 0.9, end: 1.3 },
      { word: '센터', confidence: 0.96, start: 1.35, end: 1.7 },
      { word: '입니다', confidence: 0.94, start: 1.75, end: 2.2 },
      { word: '무엇을', confidence: 0.88, start: 2.5, end: 2.9 },
      { word: '도와', confidence: 0.72, start: 2.95, end: 3.2 },
      { word: '드릴까요', confidence: 0.91, start: 3.25, end: 3.9 },
    ],
    metrics: { latency: '180ms', rtf: 0.35, audioLength: '3.9s' }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'bg-emerald-500/20 text-emerald-400';
    if (conf >= 0.7) return 'bg-amber-500/20 text-amber-400';
    return 'bg-rose-500/20 text-rose-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            ASR Streaming Playground
          </h1>
          <p className="text-slate-400 mt-1">실시간 음성 인식 테스트</p>
        </div>
        <button className="btn-ghost">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽: Input & Output */}
        <div className="col-span-2 space-y-6">
          {/* Audio Input */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Audio Input</h2>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                  <input 
                    type="checkbox" 
                    checked={isStreaming}
                    onChange={(e) => setIsStreaming(e.target.checked)}
                    className="rounded text-brand-500" 
                  />
                  Streaming Mode
                </label>
              </div>
            </div>

            {/* Waveform Display */}
            <div className="relative h-32 bg-slate-800/50 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              {isRecording ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-cyan-500 rounded-full animate-pulse"
                      style={{ 
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <AudioWaveform className="w-16 h-16 text-slate-600" />
              )}
              
              {isRecording && (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                  <span className="text-sm text-rose-400">Recording...</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="btn-secondary">
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <button 
                className={`btn-primary px-8 ${isRecording ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transcript Output */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Transcript Output</h2>
              <div className="flex items-center gap-2">
                <button className="btn-ghost text-sm py-1.5">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="btn-ghost text-sm py-1.5 text-emerald-400">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="btn-ghost text-sm py-1.5 text-rose-400">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Streaming Output */}
            {isStreaming && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Partial (streaming)</p>
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-lg text-cyan-300 animate-pulse">{transcriptResults.partial}_</p>
                </div>
              </div>
            )}

            {/* Final Output */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Final</p>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <p className="text-lg text-white leading-relaxed">{transcriptResults.final}</p>
              </div>
            </div>

            {/* Word-level Confidence */}
            <div>
              <p className="text-xs text-slate-500 mb-2">Word Confidence</p>
              <div className="flex flex-wrap gap-2">
                {transcriptResults.words.map((word, idx) => (
                  <span 
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getConfidenceColor(word.confidence)}`}
                  >
                    {word.word}
                    <span className="text-xs ml-1 opacity-70">{(word.confidence * 100).toFixed(0)}%</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Edit Section */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  className="input-field flex-1" 
                  placeholder="Edit transcript..."
                  defaultValue={transcriptResults.final}
                />
                <button className="btn-secondary">
                  <Edit className="w-4 h-4" />
                  Save Correction
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: Settings & Metrics */}
        <div className="space-y-6">
          {/* Metrics */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Performance Metrics
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">Latency</span>
                </div>
                <span className="text-lg font-semibold text-white">{transcriptResults.metrics.latency}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">RTF</span>
                </div>
                <span className={`text-lg font-semibold ${transcriptResults.metrics.rtf < 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {transcriptResults.metrics.rtf}x
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AudioWaveform className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">Audio Length</span>
                </div>
                <span className="text-lg font-semibold text-white">{transcriptResults.metrics.audioLength}</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-400" />
              Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500">Model</label>
                <select className="input-field py-2 text-sm">
                  <option>Conformer-ASR-v3 (prod)</option>
                  <option>Conformer-ASR-v2</option>
                  <option>Whisper-Large-v3</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">Language</label>
                <select className="input-field py-2 text-sm">
                  <option>Korean</option>
                  <option>English</option>
                  <option>Auto-detect</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">Chunk Size (ms)</label>
                <input type="number" className="input-field py-2 text-sm" defaultValue={640} />
              </div>

              <div>
                <label className="text-xs text-slate-500">Beam Width</label>
                <select className="input-field py-2 text-sm">
                  <option>Greedy (fastest)</option>
                  <option>Beam = 4</option>
                  <option>Beam = 8</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-sm text-slate-300">Show partial results</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-sm text-slate-300">Show word timestamps</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button className="btn-ghost w-full justify-start">
                <RefreshCw className="w-4 h-4" />
                Reset Session
              </button>
              <button className="btn-ghost w-full justify-start">
                <ThumbsDown className="w-4 h-4" />
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
