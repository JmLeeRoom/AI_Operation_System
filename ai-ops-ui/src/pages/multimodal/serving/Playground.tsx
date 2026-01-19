import { 
  PlayCircle,
  Upload,
  Image,
  Video,
  FileAudio,
  Send,
  Settings,
  Eye,
  Clock,
  DollarSign,
  Save,
  XCircle,
  AlertTriangle,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';

export function Playground() {
  const [inputType, setInputType] = useState<'image' | 'video' | 'audio'>('image');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const settings = {
    model: 'vlm-instruct-v2.1',
    maxFrames: 32,
    retrievalK: 5,
    temperature: 0.7,
    allowTools: true,
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse('Based on the image, I can see a beautiful sunset over the ocean. The sky displays vibrant shades of orange, pink, and purple. There are a few clouds scattered across the horizon, catching the last rays of sunlight. The calm ocean water reflects the colorful sky, creating a serene and peaceful atmosphere.');
      setIsLoading(false);
    }, 2000);
  };

  const costEstimate = {
    frames: 32,
    tokens: 256,
    cost: '$0.012',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
            Multimodal Playground
          </h1>
          <p className="text-slate-400 mt-1">이미지/비디오 업로드 → 답변 + 근거 시각화</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save Session
          </button>
          <button className="btn-ghost">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 메인 플레이그라운드 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 입력 영역 */}
          <div className="glass-card p-6">
            {/* 입력 타입 선택 */}
            <div className="flex gap-2 mb-4">
              {(['image', 'video', 'audio'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setInputType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    inputType === type
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {type === 'image' && <Image className="w-4 h-4" />}
                  {type === 'video' && <Video className="w-4 h-4" />}
                  {type === 'audio' && <FileAudio className="w-4 h-4" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* 미디어 업로드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="aspect-video bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 hover:border-violet-500/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                <Upload className="w-10 h-10 text-slate-600 group-hover:text-violet-400 transition-colors mb-2" />
                <p className="text-slate-500 text-sm">
                  Drop {inputType} here or click to upload
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  {inputType === 'image' && 'JPG, PNG, WebP (max 10MB)'}
                  {inputType === 'video' && 'MP4, MOV (max 100MB, 5min)'}
                  {inputType === 'audio' && 'WAV, MP3 (max 50MB, 10min)'}
                </p>
              </div>

              {/* 프롬프트 입력 */}
              <div className="flex flex-col">
                <label className="text-sm text-slate-400 mb-2">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask a question about the uploaded media..."
                  className="input-field flex-1 resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {costEstimate.frames} frames
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      ~{costEstimate.tokens} tokens
                    </span>
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 출력 영역 */}
          {response && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  Response
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    1.2s
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {costEstimate.cost}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 답변 */}
                <div className="md:col-span-2">
                  <p className="text-slate-200 leading-relaxed">{response}</p>
                </div>

                {/* 근거 패널 */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Grounding Evidence
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs text-emerald-400">Grounded: sky region</p>
                      <p className="text-xs text-slate-500">attention: 0.85</p>
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs text-emerald-400">Grounded: ocean area</p>
                      <p className="text-xs text-slate-500">attention: 0.78</p>
                    </div>
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-400">Weak: cloud details</p>
                      <p className="text-xs text-slate-500">attention: 0.42</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                <button className="btn-ghost text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Report Issue
                </button>
                <button className="btn-ghost text-sm">
                  Send to Feedback
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 설정 패널 */}
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Model</label>
              <select className="input-field">
                <option>{settings.model}</option>
                <option>vlm-instruct-v2.0</option>
                <option>video-qa-v1.3</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Max Frames</label>
              <input type="number" className="input-field" defaultValue={settings.maxFrames} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Retrieval K</label>
              <input type="number" className="input-field" defaultValue={settings.retrievalK} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Temperature</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue={settings.temperature} className="w-full" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0</span>
                <span>{settings.temperature}</span>
                <span>1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Allow Tools</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={settings.allowTools} />
                <div className="w-9 h-5 bg-slate-700 peer-checked:bg-violet-500 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          </div>

          {/* 비용 표시 */}
          <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Cost Estimate</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Frames</span>
                <span className="text-slate-300">{costEstimate.frames}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tokens</span>
                <span className="text-slate-300">{costEstimate.tokens}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700/50">
                <span className="text-slate-400 font-medium">Total</span>
                <span className="text-violet-400 font-medium">{costEstimate.cost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
