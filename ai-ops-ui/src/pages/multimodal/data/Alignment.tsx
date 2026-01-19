import { 
  GitBranch,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Scissors,
  Save,
  RefreshCw,
  Clock,
  FileText,
  Video,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';
import { useState } from 'react';

export function Alignment() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const totalDuration = 180; // 3분

  const segments = [
    { id: 1, start: 0, end: 30, text: 'Introduction to the topic with background information.', speaker: 'Speaker A' },
    { id: 2, start: 30, end: 75, text: 'Main explanation of the concept with examples.', speaker: 'Speaker A' },
    { id: 3, start: 75, end: 120, text: 'Detailed analysis and discussion of implications.', speaker: 'Speaker B' },
    { id: 4, start: 120, end: 150, text: 'Q&A section with audience questions.', speaker: 'Mixed' },
    { id: 5, start: 150, end: 180, text: 'Summary and conclusion with key takeaways.', speaker: 'Speaker A' },
  ];

  const scenes = [
    { id: 1, start: 0, end: 45, label: 'Scene 1: Opening', frames: 1350 },
    { id: 2, start: 45, end: 90, label: 'Scene 2: Main Content', frames: 1350 },
    { id: 3, start: 90, end: 135, label: 'Scene 3: Discussion', frames: 1350 },
    { id: 4, start: 135, end: 180, label: 'Scene 4: Closing', frames: 1350 },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-emerald-400" />
            </div>
            Alignment Studio
          </h1>
          <p className="text-slate-400 mt-1">비디오/오디오 타임스탬프와 텍스트 세그먼트 정렬</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Auto-Align
          </button>
          <button className="btn-primary">
            <Save className="w-4 h-4" />
            Save Alignment
          </button>
        </div>
      </div>

      {/* 비디오 플레이어 & 타임라인 */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 비디오 프리뷰 */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-slate-900 rounded-xl border border-slate-700/50 flex items-center justify-center mb-4">
              <Video className="w-16 h-16 text-slate-600" />
            </div>
            
            {/* 플레이어 컨트롤 */}
            <div className="flex items-center gap-4 mb-4">
              <button 
                className="p-2 hover:bg-slate-700 rounded-lg"
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              >
                <SkipBack className="w-5 h-5 text-slate-400" />
              </button>
              <button 
                className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
              <button 
                className="p-2 hover:bg-slate-700 rounded-lg"
                onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}
              >
                <SkipForward className="w-5 h-5 text-slate-400" />
              </button>
              <span className="text-sm text-slate-400 font-mono">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
              <div className="flex-1" />
              <button className="p-2 hover:bg-slate-700 rounded-lg">
                <Volume2 className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg">
                <Scissors className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* 타임라인 */}
            <div className="space-y-3">
              {/* Scene 트랙 */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Scenes</p>
                <div className="h-8 bg-slate-800 rounded-lg relative overflow-hidden">
                  {scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="absolute top-0 h-full bg-violet-500/30 border-r border-violet-500/50 flex items-center px-2 cursor-pointer hover:bg-violet-500/40 transition-colors"
                      style={{
                        left: `${(scene.start / totalDuration) * 100}%`,
                        width: `${((scene.end - scene.start) / totalDuration) * 100}%`
                      }}
                    >
                      <span className="text-xs text-violet-300 truncate">{scene.label}</span>
                    </div>
                  ))}
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-white z-10"
                    style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Text Segment 트랙 */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Text Segments</p>
                <div className="h-8 bg-slate-800 rounded-lg relative overflow-hidden">
                  {segments.map((seg) => (
                    <div
                      key={seg.id}
                      className="absolute top-0 h-full bg-cyan-500/30 border-r border-cyan-500/50 flex items-center px-2 cursor-move hover:bg-cyan-500/40 transition-colors"
                      style={{
                        left: `${(seg.start / totalDuration) * 100}%`,
                        width: `${((seg.end - seg.start) / totalDuration) * 100}%`
                      }}
                    >
                      <span className="text-xs text-cyan-300 truncate">{seg.text.substring(0, 20)}...</span>
                    </div>
                  ))}
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-white z-10"
                    style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Waveform (옵션) */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Audio Waveform</p>
                <div className="h-12 bg-slate-800 rounded-lg relative overflow-hidden flex items-center">
                  {/* Simulated waveform */}
                  <div className="flex items-center gap-px w-full px-2">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-emerald-500/50"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-white z-10"
                    style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 줌 컨트롤 */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button className="p-1 hover:bg-slate-700 rounded">
                <ZoomOut className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-xs text-slate-500">100%</span>
              <button className="p-1 hover:bg-slate-700 rounded">
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* 세그먼트 목록 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Segments</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {segments.map((seg) => (
                <div 
                  key={seg.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentTime >= seg.start && currentTime < seg.end
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                  onClick={() => setCurrentTime(seg.start)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-400">
                      {formatTime(seg.start)} - {formatTime(seg.end)}
                    </span>
                    <span className="badge badge-slate text-xs">{seg.speaker}</span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-2">{seg.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="text-xs text-slate-500 hover:text-slate-300">Edit</button>
                    <button className="text-xs text-slate-500 hover:text-slate-300">Split</button>
                    <button className="text-xs text-slate-500 hover:text-slate-300">Merge</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 정렬 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Segments</p>
          <p className="text-2xl font-bold text-slate-100">{segments.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Total Scenes</p>
          <p className="text-2xl font-bold text-slate-100">{scenes.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Duration</p>
          <p className="text-2xl font-bold text-slate-100">{formatTime(totalDuration)}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm mb-1">Alignment Score</p>
          <p className="text-2xl font-bold text-emerald-400">95.2%</p>
        </div>
      </div>
    </div>
  );
}
