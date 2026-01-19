import { 
  Music,
  Play,
  Pause,
  Download,
  RefreshCw,
  Settings,
  Disc,
  Wand2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Save,
  Copy
} from 'lucide-react';
import { useState } from 'react';

export function MusicPlayground() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const generatedClips = [
    { id: 1, prompt: 'upbeat electronic music with synth leads', duration: '30s', seed: 42, timestamp: '2 mins ago' },
    { id: 2, prompt: 'calm ambient piano with soft strings', duration: '30s', seed: 123, timestamp: '15 mins ago' },
    { id: 3, prompt: 'energetic rock with heavy drums', duration: '30s', seed: 789, timestamp: '1 hour ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            Music Generation Playground
          </h1>
          <p className="text-slate-400 mt-1">AI 음악 생성 테스트 (내부 용도)</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Generation Panel */}
        <div className="col-span-2 space-y-6">
          {/* Prompt Input */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Generation Prompt</h2>
            
            <textarea 
              className="input-field min-h-[100px] mb-4"
              placeholder="Describe the music you want to generate... (e.g., 'upbeat electronic music with synth leads and energetic drums')"
              defaultValue="calm ambient music with soft piano and gentle strings"
            />

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Genre</label>
                <select className="input-field py-2 text-sm">
                  <option>Auto-detect</option>
                  <option>Ambient</option>
                  <option>Electronic</option>
                  <option>Jazz</option>
                  <option>Rock</option>
                  <option>Classical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Mood</label>
                <select className="input-field py-2 text-sm">
                  <option>Auto-detect</option>
                  <option>Calm</option>
                  <option>Energetic</option>
                  <option>Happy</option>
                  <option>Sad</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Tempo (BPM)</label>
                <input type="number" className="input-field py-2 text-sm" defaultValue={90} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Duration (sec)</label>
                <select className="input-field py-2 text-sm">
                  <option>15</option>
                  <option selected>30</option>
                  <option>60</option>
                  <option>120</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Seed (for reproducibility)</label>
                <div className="flex items-center gap-2">
                  <input type="number" className="input-field py-2 text-sm" defaultValue={42} />
                  <button className="btn-ghost p-2">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Temperature</label>
                <input type="range" min="0" max="2" step="0.1" defaultValue="1.0" className="w-full accent-brand-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            <button 
              className={`btn-primary w-full ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 3000);
              }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Music
                </>
              )}
            </button>
          </div>

          {/* Generated Results */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Generated Clips</h2>
              <button className="btn-ghost text-sm">Clear All</button>
            </div>

            <div className="space-y-4">
              {generatedClips.map((clip) => (
                <div key={clip.id} className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-slate-200 text-sm mb-1">"{clip.prompt}"</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {clip.duration}
                        </span>
                        <span>Seed: {clip.seed}</span>
                        <span>{clip.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Waveform */}
                  <div className="h-16 bg-slate-700/30 rounded-lg mb-3 flex items-center px-3">
                    <div className="flex items-center gap-0.5 h-12 flex-1">
                      {Array.from({ length: 80 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 rounded-full ${isPlaying === clip.id ? 'bg-brand-400' : 'bg-slate-500'}`}
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        className="btn-ghost p-2"
                        onClick={() => setIsPlaying(isPlaying === clip.id ? null : clip.id)}
                      >
                        {isPlaying === clip.id ? (
                          <Pause className="w-5 h-5 text-brand-400" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button className="btn-ghost p-2">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="btn-ghost p-2">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-ghost p-2 text-emerald-400">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="btn-ghost p-2 text-rose-400">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="btn-secondary text-sm py-1.5">
                        Send to Eval
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-400" />
              Model Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Model</label>
                <select className="input-field">
                  <option>MusicGen (Meta)</option>
                  <option>AudioCraft</option>
                  <option>Custom Fine-tuned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Model Size</label>
                <select className="input-field">
                  <option>Small (300M)</option>
                  <option>Medium (1.5B)</option>
                  <option>Large (3.3B)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Audio Quality</label>
                <select className="input-field">
                  <option>32kHz</option>
                  <option>44.1kHz</option>
                  <option>48kHz</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-brand-500" />
                <span className="text-sm text-slate-300">Enable melody conditioning</span>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                <span className="text-sm text-slate-300">Auto-save to artifacts</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Quick Prompts</h2>
            <div className="space-y-2">
              {[
                'Upbeat electronic with synths',
                'Calm piano ambient',
                'Energetic rock drums',
                'Jazz saxophone smooth',
                'Cinematic orchestral dramatic',
              ].map((prompt, idx) => (
                <button 
                  key={idx}
                  className="w-full p-2 text-left text-sm text-slate-300 bg-slate-800/30 rounded hover:bg-slate-800/50 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Usage Stats</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Today's Generations</span>
                <span className="text-white">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GPU Hours Used</span>
                <span className="text-white">2.5h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saved to Eval</span>
                <span className="text-emerald-400">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
