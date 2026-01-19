import { 
  Headphones,
  Play,
  ArrowRight,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Save,
  Settings,
  Volume2,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useState } from 'react';

export function VCTraining() {
  const [sourceSpk, setSourceSpk] = useState('Speaker_A');
  const [targetSpk, setTargetSpk] = useState('Speaker_B');

  const speakers = ['Speaker_A', 'Speaker_B', 'Speaker_C', 'Speaker_D'];

  const evalMetrics = {
    speakerSim: 0.89,
    intelligibility: 0.94,
    artifactScore: 0.12,
    mos: 3.95,
  };

  const samples = [
    {
      id: 1,
      text: '안녕하세요, 반갑습니다.',
      sourceAudio: 'src_001.wav',
      convertedAudio: 'conv_001.wav',
      speakerSim: 0.91,
      quality: 'good',
    },
    {
      id: 2,
      text: '오늘 날씨가 정말 좋네요.',
      sourceAudio: 'src_002.wav',
      convertedAudio: 'conv_002.wav',
      speakerSim: 0.87,
      quality: 'fair',
    },
    {
      id: 3,
      text: '주문하신 상품이 발송되었습니다.',
      sourceAudio: 'src_003.wav',
      convertedAudio: 'conv_003.wav',
      speakerSim: 0.93,
      quality: 'excellent',
    },
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-cyan-400';
      case 'fair': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            Voice Conversion Training & Eval
          </h1>
          <p className="text-slate-400 mt-1">화자 변환 모델 학습 및 평가</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save Config
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Start Training
          </button>
        </div>
      </div>

      {/* Conversion Setup */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Conversion Setup</h2>
        
        <div className="flex items-center justify-center gap-8">
          {/* Source Speaker */}
          <div className="w-48">
            <label className="block text-sm text-slate-400 mb-2">Source Speaker</label>
            <select 
              className="input-field"
              value={sourceSpk}
              onChange={(e) => setSourceSpk(e.target.value)}
            >
              {speakers.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="mt-2 p-3 bg-slate-800/30 rounded-lg flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-bold">{sourceSpk.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm text-slate-200">{sourceSpk}</p>
                <p className="text-xs text-slate-500">Male • 2.5h data</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-8 h-8 text-brand-400" />
            <span className="text-xs text-slate-500">Convert to</span>
          </div>

          {/* Target Speaker */}
          <div className="w-48">
            <label className="block text-sm text-slate-400 mb-2">Target Speaker</label>
            <select 
              className="input-field"
              value={targetSpk}
              onChange={(e) => setTargetSpk(e.target.value)}
            >
              {speakers.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="mt-2 p-3 bg-slate-800/30 rounded-lg flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <span className="text-rose-400 font-bold">{targetSpk.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm text-slate-200">{targetSpk}</p>
                <p className="text-xs text-slate-500">Female • 1.8h data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Training Config */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-400" />
            Training Config
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">VC Model</label>
              <select className="input-field">
                <option>So-VITS-SVC</option>
                <option>RVC</option>
                <option>kNN-VC</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Epochs</label>
                <input type="number" className="input-field" defaultValue={200} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Batch Size</label>
                <input type="number" className="input-field" defaultValue={8} />
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <Shield className="w-4 h-4" />
                Safety Policy Active
              </div>
              <p className="text-xs text-slate-400 mt-1">Only authorized speakers allowed</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-brand-500" />
              <span className="text-sm text-slate-300">Add watermark to output</span>
            </div>
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Evaluation Metrics
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Speaker Similarity</span>
                <span className={`text-lg font-bold ${evalMetrics.speakerSim > 0.85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {(evalMetrics.speakerSim * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500"
                  style={{ width: `${evalMetrics.speakerSim * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Intelligibility (ASR WER)</span>
                <span className={`text-lg font-bold ${evalMetrics.intelligibility > 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {(evalMetrics.intelligibility * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500"
                  style={{ width: `${evalMetrics.intelligibility * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Artifact Score</span>
                <span className={`text-lg font-bold ${evalMetrics.artifactScore < 0.2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {(evalMetrics.artifactScore * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500">Lower is better</p>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated MOS</span>
                <span className="text-lg font-bold text-white">{evalMetrics.mos}</span>
              </div>
            </div>
          </div>
        </div>

        {/* A/B Samples */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-violet-400" />
            A/B Comparison
          </h2>

          <div className="space-y-3">
            {samples.map((sample) => (
              <div key={sample.id} className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-sm text-slate-200 mb-2">"{sample.text}"</p>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Source</span>
                      <button className="btn-ghost p-1">
                        <Play className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="h-4 bg-slate-600/50 rounded" />
                  </div>
                  <div className="p-2 bg-brand-500/10 border border-brand-500/30 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-brand-400">Converted</span>
                      <button className="btn-ghost p-1">
                        <Play className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="h-4 bg-brand-500/30 rounded" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${getQualityColor(sample.quality)}`}>
                    Sim: {(sample.speakerSim * 100).toFixed(0)}%
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-rose-400 hover:bg-rose-500/20 rounded">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-ghost w-full mt-4">
            <RefreshCw className="w-4 h-4" />
            Generate More
          </button>
        </div>
      </div>
    </div>
  );
}
