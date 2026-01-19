import { 
  Wand2,
  Plus,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  AudioWaveform,
  Volume2,
  Scissors,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  Save
} from 'lucide-react';
import { useState } from 'react';

export function AudioProcessing() {
  const [activeTab, setActiveTab] = useState<'resample' | 'normalize' | 'vad' | 'segment' | 'features'>('resample');

  const processingRecipes = [
    { id: 1, name: 'ASR Standard', steps: ['Resample 16kHz', 'Normalize', 'VAD', 'Segment 10-30s'], lastRun: '2 hours ago', status: 'ready' },
    { id: 2, name: 'TTS High Quality', steps: ['Resample 22.05kHz', 'Silence Trim', 'Loudness -23 LUFS'], lastRun: '1 day ago', status: 'ready' },
    { id: 3, name: 'Music Processing', steps: ['Resample 44.1kHz', 'Stereo Keep', 'Feature Extract'], lastRun: '3 days ago', status: 'ready' },
    { id: 4, name: 'Denoise + VAD', steps: ['Denoise', 'VAD', 'Segment'], lastRun: '1 hour ago', status: 'running' },
  ];

  const recentJobs = [
    { id: 1, recipe: 'ASR Standard', files: 5000, processed: 4850, status: 'running', duration: '45m' },
    { id: 2, recipe: 'TTS High Quality', files: 1200, processed: 1200, status: 'completed', duration: '30m' },
    { id: 3, recipe: 'Denoise + VAD', files: 3000, processed: 3000, status: 'completed', duration: '1h 15m' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audio Processing</h1>
          <p className="text-slate-400 mt-1">Resample, Normalize, VAD, Segment, Feature Extraction</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Recipe
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽: Recipe Builder */}
        <div className="col-span-2 space-y-6">
          {/* 탭 */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg w-fit">
            {[
              { key: 'resample', label: 'Resample' },
              { key: 'normalize', label: 'Normalize' },
              { key: 'vad', label: 'VAD' },
              { key: 'segment', label: 'Segment' },
              { key: 'features', label: 'Features' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Processing Settings */}
          <div className="glass-card p-6">
            {activeTab === 'resample' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  Resampling
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Target Sample Rate</label>
                    <select className="input-field">
                      <option>16000 Hz (ASR standard)</option>
                      <option>22050 Hz (TTS)</option>
                      <option>44100 Hz (Music)</option>
                      <option>48000 Hz (Broadcast)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Channels</label>
                    <select className="input-field">
                      <option>Mono (convert stereo to mono)</option>
                      <option>Keep original</option>
                      <option>Stereo</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Resampling Algorithm</label>
                  <select className="input-field">
                    <option>librosa (high quality)</option>
                    <option>scipy</option>
                    <option>sox</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'normalize' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                  Normalization
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Normalization Type</label>
                    <select className="input-field">
                      <option>Peak normalization</option>
                      <option>RMS normalization</option>
                      <option>Loudness (LUFS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Target Level</label>
                    <input type="text" className="input-field" defaultValue="-3 dB" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span className="text-slate-300">Remove DC offset</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-brand-500" />
                    <span className="text-slate-300">Apply limiter</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'vad' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AudioWaveform className="w-5 h-5 text-violet-400" />
                  Voice Activity Detection
                </h2>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">VAD Engine</label>
                  <select className="input-field">
                    <option>Silero VAD (recommended)</option>
                    <option>WebRTC VAD</option>
                    <option>Energy-based</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Threshold</label>
                    <input type="range" min="0" max="1" step="0.05" defaultValue="0.5" className="w-full accent-brand-500" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0 (Sensitive)</span>
                      <span className="text-brand-400">0.5</span>
                      <span>1 (Aggressive)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Min Speech Duration</label>
                    <input type="text" className="input-field" defaultValue="0.3s" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                  <span className="text-slate-300">Pad speech segments (100ms)</span>
                </div>
              </div>
            )}

            {activeTab === 'segment' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-amber-400" />
                  Segmentation
                </h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Min Length (sec)</label>
                    <input type="number" className="input-field" defaultValue={1} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Max Length (sec)</label>
                    <input type="number" className="input-field" defaultValue={30} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Target Length (sec)</label>
                    <input type="number" className="input-field" defaultValue={15} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Segmentation Strategy</label>
                  <select className="input-field">
                    <option>Split at VAD boundaries</option>
                    <option>Fixed length (overlap)</option>
                    <option>Sentence-aligned (requires transcript)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-rose-400" />
                  Feature Extraction
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Mel Spectrogram', desc: '80 mel bins', checked: true },
                    { name: 'MFCC', desc: '13 coefficients', checked: false },
                    { name: 'F0 (Pitch)', desc: 'CREPE/DIO', checked: true },
                    { name: 'Energy', desc: 'Frame-level', checked: true },
                    { name: 'Speaker Embedding', desc: 'd-vector/x-vector', checked: false },
                    { name: 'Pitch Contour', desc: 'For prosody', checked: false },
                  ].map((feature, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked={feature.checked} className="rounded text-brand-500" />
                      <div>
                        <p className="text-slate-200">{feature.name}</p>
                        <p className="text-xs text-slate-500">{feature.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Section */}
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Before / After Preview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Original</p>
                  <div className="h-16 bg-slate-700/50 rounded flex items-center justify-center">
                    <AudioWaveform className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">44.1kHz, stereo, 3.2s</p>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Processed</p>
                  <div className="h-16 bg-emerald-500/10 rounded flex items-center justify-center">
                    <AudioWaveform className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-xs text-emerald-400 mt-2">16kHz, mono, 3.2s</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button className="btn-secondary">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="btn-primary">
                <Save className="w-4 h-4" />
                Save Recipe
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: Saved Recipes & Jobs */}
        <div className="space-y-6">
          {/* Saved Recipes */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Saved Recipes</h2>
            
            <div className="space-y-3">
              {processingRecipes.map((recipe) => (
                <div 
                  key={recipe.id}
                  className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-200">{recipe.name}</span>
                    {recipe.status === 'running' && (
                      <span className="badge badge-cyan">Running</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.steps.map((step, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded text-slate-400">
                        {step}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Last: {recipe.lastRun}</span>
                    <button className="btn-ghost text-xs py-1">
                      <Play className="w-3 h-3" />
                      Run
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Jobs</h2>
            
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-3 bg-slate-800/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-200">{job.recipe}</span>
                    <span className={`badge ${job.status === 'completed' ? 'badge-emerald' : 'badge-cyan'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                          style={{ width: `${(job.processed / job.files) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {job.processed}/{job.files}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Duration: {job.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
