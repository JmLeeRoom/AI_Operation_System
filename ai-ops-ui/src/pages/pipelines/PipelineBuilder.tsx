import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Save, 
  Play, 
  CheckCircle, 
  ZoomIn, 
  ZoomOut,
  Search,
  ChevronRight,
  Database,
  Cpu,
  BarChart2,
  Upload,
  Settings,
  Box,
  Layers,
  Eye,
  MessageSquare,
  Mic,
  Image,
  TrendingUp,
  Wand2,
  Package,
  Brain,
  FileText,
  GitBranch,
  AudioWaveform,
  Speaker,
  Volume2,
  Video,
  Link2,
  Calendar,
  AlertTriangle,
  Target,
  GripVertical
} from 'lucide-react';
import { cn } from '../../lib/utils';

// 도메인별 노드 카테고리 정의
const domainConfigs: Record<string, {
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  categories: { name: string; icon: React.ReactNode; nodes: string[] }[];
  defaultNodes: { id: string; type: string; x: number; y: number }[];
  pipelineName: string;
}> = {
  cv: {
    name: 'Computer Vision',
    icon: <Eye size={16} />,
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-500',
    categories: [
      { name: 'Data', icon: <Image size={14} />, nodes: ['Data Source', 'Label Loader', 'Augmentation'] },
      { name: 'Preprocess', icon: <Wand2 size={14} />, nodes: ['Resize', 'Normalize', 'Color Transform'] },
      { name: 'Train', icon: <Cpu size={14} />, nodes: ['Train Model', 'Transfer Learning', 'HP Tune'] },
      { name: 'Evaluate', icon: <BarChart2 size={14} />, nodes: ['mAP Eval', 'IoU Eval', 'Confusion Matrix'] },
      { name: 'Export', icon: <Package size={14} />, nodes: ['ONNX Export', 'TensorRT', 'TFLite'] },
      { name: 'Deploy', icon: <Upload size={14} />, nodes: ['Register Model', 'Deploy Endpoint'] },
    ],
    defaultNodes: [
      { id: '1', type: 'Data Source', x: 50, y: 80 },
      { id: '2', type: 'Augmentation', x: 200, y: 80 },
      { id: '3', type: 'Train Model', x: 350, y: 80 },
      { id: '4', type: 'mAP Eval', x: 500, y: 80 },
      { id: '5', type: 'Register Model', x: 650, y: 80 },
    ],
    pipelineName: 'CV Training Pipeline',
  },
  llm: {
    name: 'LLM / NLP',
    icon: <MessageSquare size={16} />,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    categories: [
      { name: 'Data', icon: <Database size={14} />, nodes: ['Text Source', 'Tokenize', 'Format (Alpaca)'] },
      { name: 'Process', icon: <FileText size={14} />, nodes: ['Clean', 'Filter', 'Dedupe'] },
      { name: 'Train', icon: <Brain size={14} />, nodes: ['SFT', 'LoRA', 'RLHF', 'DPO'] },
      { name: 'Merge', icon: <GitBranch size={14} />, nodes: ['Merge Adapter', 'Quantize (GPTQ)', 'Quantize (AWQ)'] },
      { name: 'Evaluate', icon: <BarChart2 size={14} />, nodes: ['MMLU', 'HellaSwag', 'Human Eval', 'Safety Test'] },
      { name: 'Deploy', icon: <Upload size={14} />, nodes: ['vLLM Deploy', 'TGI Deploy', 'Register'] },
    ],
    defaultNodes: [
      { id: '1', type: 'Text Source', x: 50, y: 80 },
      { id: '2', type: 'Format (Alpaca)', x: 200, y: 80 },
      { id: '3', type: 'LoRA', x: 350, y: 80 },
      { id: '4', type: 'Merge Adapter', x: 500, y: 80 },
      { id: '5', type: 'MMLU', x: 650, y: 80 },
    ],
    pipelineName: 'LLM Fine-tuning Pipeline',
  },
  audio: {
    name: 'Speech / Audio',
    icon: <Mic size={16} />,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    categories: [
      { name: 'Data', icon: <AudioWaveform size={14} />, nodes: ['Audio Source', 'Transcript Load', 'Speaker Data'] },
      { name: 'Preprocess', icon: <Volume2 size={14} />, nodes: ['VAD', 'Denoise', 'Resample', 'Normalize'] },
      { name: 'Features', icon: <Layers size={14} />, nodes: ['Mel-Spectrogram', 'MFCC', 'Forced Align'] },
      { name: 'Train', icon: <Cpu size={14} />, nodes: ['ASR Train', 'TTS Train', 'VC Train'] },
      { name: 'Vocoder', icon: <Speaker size={14} />, nodes: ['HiFi-GAN', 'WaveGlow', 'Vocos'] },
      { name: 'Evaluate', icon: <BarChart2 size={14} />, nodes: ['WER Eval', 'MOS Eval', 'RTF Eval'] },
    ],
    defaultNodes: [
      { id: '1', type: 'Audio Source', x: 50, y: 80 },
      { id: '2', type: 'VAD', x: 200, y: 80 },
      { id: '3', type: 'Mel-Spectrogram', x: 350, y: 80 },
      { id: '4', type: 'ASR Train', x: 500, y: 80 },
      { id: '5', type: 'WER Eval', x: 650, y: 80 },
    ],
    pipelineName: 'ASR Training Pipeline',
  },
  multimodal: {
    name: 'Multimodal',
    icon: <Layers size={16} />,
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    categories: [
      { name: 'Image', icon: <Image size={14} />, nodes: ['Image Source', 'Vision Encoder'] },
      { name: 'Text', icon: <MessageSquare size={14} />, nodes: ['Text Source', 'Text Encoder'] },
      { name: 'Video', icon: <Video size={14} />, nodes: ['Video Source', 'Frame Extract'] },
      { name: 'Audio', icon: <Mic size={14} />, nodes: ['Audio Source', 'Audio Encoder'] },
      { name: 'Fusion', icon: <Link2 size={14} />, nodes: ['Alignment', 'Projection', 'Cross-Attention'] },
      { name: 'Train', icon: <Brain size={14} />, nodes: ['Contrastive', 'VLM Train', 'A/V Fusion'] },
      { name: 'Evaluate', icon: <BarChart2 size={14} />, nodes: ['VQA Eval', 'Zero-shot', 'Grounding'] },
    ],
    defaultNodes: [
      { id: '1', type: 'Image Source', x: 50, y: 60 },
      { id: '2', type: 'Vision Encoder', x: 200, y: 60 },
      { id: '3', type: 'Projection', x: 350, y: 80 },
      { id: '4', type: 'VLM Train', x: 500, y: 80 },
      { id: '5', type: 'VQA Eval', x: 650, y: 80 },
    ],
    pipelineName: 'VLM Training Pipeline',
  },
  timeseries: {
    name: 'Time Series',
    icon: <TrendingUp size={16} />,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    categories: [
      { name: 'Ingest', icon: <Database size={14} />, nodes: ['Data Ingest', 'Quality Check'] },
      { name: 'Features', icon: <Layers size={14} />, nodes: ['Lag', 'Rolling', 'Calendar', 'Target Encode'] },
      { name: 'Split', icon: <Calendar size={14} />, nodes: ['Time Split', 'Walk-forward'] },
      { name: 'Train', icon: <Cpu size={14} />, nodes: ['XGBoost', 'LightGBM', 'LSTM', 'Prophet'] },
      { name: 'Anomaly', icon: <AlertTriangle size={14} />, nodes: ['AutoEncoder', 'IsolationForest', 'Threshold'] },
      { name: 'Evaluate', icon: <BarChart2 size={14} />, nodes: ['Backtest', 'MAPE/MAE', 'PR Curve'] },
      { name: 'Deploy', icon: <Target size={14} />, nodes: ['Batch Deploy', 'Realtime Deploy', 'Monitor'] },
    ],
    defaultNodes: [
      { id: '1', type: 'Data Ingest', x: 50, y: 80 },
      { id: '2', type: 'Quality Check', x: 170, y: 80 },
      { id: '3', type: 'Rolling', x: 290, y: 80 },
      { id: '4', type: 'Walk-forward', x: 410, y: 80 },
      { id: '5', type: 'XGBoost', x: 530, y: 80 },
      { id: '6', type: 'Backtest', x: 650, y: 80 },
    ],
    pipelineName: 'Forecasting Pipeline',
  },
};

// 도메인별 색상 스타일
const getDomainColors = (domain: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    cv: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/50', iconBg: 'bg-indigo-500/10' },
    llm: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/50', iconBg: 'bg-violet-500/10' },
    audio: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50', iconBg: 'bg-emerald-500/10' },
    multimodal: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/50', iconBg: 'bg-pink-500/10' },
    timeseries: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/50', iconBg: 'bg-teal-500/10' },
  };
  return colors[domain] || colors.cv;
};

export function PipelineBuilder() {
  const [searchParams] = useSearchParams();
  const initialDomain = searchParams.get('domain') || 'cv';
  
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);
  const [selectedNode, setSelectedNode] = useState<string | null>('3');
  const [expandedCategory, setExpandedCategory] = useState<string>('Train');

  useEffect(() => {
    const domain = searchParams.get('domain');
    if (domain && domainConfigs[domain]) {
      setSelectedDomain(domain);
      setExpandedCategory(domainConfigs[domain].categories[2]?.name || domainConfigs[domain].categories[0]?.name);
    }
  }, [searchParams]);

  const currentConfig = domainConfigs[selectedDomain];
  const canvasNodes = currentConfig.defaultNodes;
  const domainColors = getDomainColors(selectedDomain);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentConfig.gradient} flex items-center justify-center shadow-lg`}>
            {currentConfig.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">{currentConfig.pipelineName}</h1>
            <p className="text-sm text-slate-500">Draft • Last saved 2 min ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            <CheckCircle size={16} />
            Validate
          </button>
          <button className="btn-secondary">
            <Play size={16} />
            Dry Run
          </button>
          <button className="btn-primary">
            <Save size={16} />
            Save & Run
          </button>
        </div>
      </div>

      {/* Domain Selector */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/50 overflow-x-auto">
        <span className="text-sm text-slate-500 whitespace-nowrap">Domain:</span>
        {Object.entries(domainConfigs).map(([key, config]) => {
          const colors = getDomainColors(key);
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedDomain(key);
                setSelectedNode(null);
                setExpandedCategory(config.categories[2]?.name || config.categories[0]?.name);
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border whitespace-nowrap',
                selectedDomain === key
                  ? `${colors.bg} ${colors.text} ${colors.border}`
                  : 'bg-slate-800/30 text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-300'
              )}
            >
              {config.icon}
              {config.name}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Node Palette */}
        <div className="w-60 glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search nodes..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {currentConfig.categories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.name ? '' : category.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    expandedCategory === category.name 
                      ? `${domainColors.bg} ${domainColors.text}` 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    {category.name}
                  </div>
                  <ChevronRight 
                    size={14} 
                    className={cn('transition-transform', expandedCategory === category.name && 'rotate-90')} 
                  />
                </button>
                {expandedCategory === category.name && (
                  <div className="mt-1 ml-3 space-y-0.5">
                    {category.nodes.map((node) => (
                      <button 
                        key={node} 
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 text-left rounded-lg hover:bg-slate-800/30 cursor-grab transition-colors"
                        draggable
                      >
                        <GripVertical size={12} className="text-slate-600" />
                        {node}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 glass-card flex flex-col overflow-hidden relative">
          {/* Canvas Controls */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700/50 p-1">
            <button className="p-1.5 rounded-md hover:bg-slate-800/50 transition-colors">
              <ZoomIn size={16} className="text-slate-400" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-slate-800/50 transition-colors">
              <ZoomOut size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-slate-900/30 overflow-auto">
            <div className="min-w-[800px] min-h-full p-6 relative">
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />
              
              {/* Edges */}
              <svg className="absolute inset-0 pointer-events-none">
                <defs>
                  <linearGradient id={`edge-gradient-${selectedDomain}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={domainColors.text} stopOpacity="0.3" />
                    <stop offset="50%" className={domainColors.text} stopOpacity="0.6" />
                    <stop offset="100%" className={domainColors.text} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {canvasNodes.slice(0, -1).map((node, i) => (
                  <line
                    key={`edge-${node.id}`}
                    x1={node.x + 100}
                    y1={node.y + 32}
                    x2={canvasNodes[i + 1].x}
                    y2={canvasNodes[i + 1].y + 32}
                    stroke="rgb(71, 85, 105)"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                ))}
              </svg>

              {/* Nodes */}
              {canvasNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={cn(
                    'absolute w-[100px] rounded-xl border-2 bg-slate-800/80 backdrop-blur cursor-pointer transition-all hover:scale-105 hover:shadow-lg',
                    selectedNode === node.id 
                      ? `${domainColors.border} shadow-lg` 
                      : 'border-slate-700/50 hover:border-slate-600'
                  )}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="p-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center mb-2',
                      domainColors.iconBg
                    )}>
                      <Box size={16} className={domainColors.text} />
                    </div>
                    <p className="text-xs font-medium text-slate-200 truncate">{node.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div className="w-72 glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', domainColors.iconBg)}>
                <Settings size={18} className={domainColors.text} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Inspector</h3>
                <p className="text-xs text-slate-500">
                  {selectedNode ? canvasNodes.find(n => n.id === selectedNode)?.type : 'Select a node'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode ? (
              <div className="space-y-4">
                {/* Domain-specific fields */}
                {selectedDomain === 'cv' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>YOLOv8n</option>
                        <option>YOLOv8s</option>
                        <option>ResNet-50</option>
                        <option>EfficientNet-B4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Image Size</label>
                      <input 
                        type="text" 
                        defaultValue="640" 
                        className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                      />
                    </div>
                  </>
                )}
                {selectedDomain === 'llm' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Base Model</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>Llama-3-8B</option>
                        <option>Mistral-7B</option>
                        <option>Qwen-7B</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">LoRA Rank</label>
                      <input 
                        type="number" 
                        defaultValue="16" 
                        className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                      />
                    </div>
                  </>
                )}
                {selectedDomain === 'audio' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>Whisper-large-v3</option>
                        <option>Whisper-medium</option>
                        <option>Conformer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Sample Rate</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>16000 Hz</option>
                        <option>22050 Hz</option>
                        <option>44100 Hz</option>
                      </select>
                    </div>
                  </>
                )}
                {selectedDomain === 'multimodal' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Vision Encoder</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>CLIP ViT-L/14</option>
                        <option>SigLIP</option>
                        <option>EVA-CLIP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">LLM Base</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>Llama-3-8B</option>
                        <option>Vicuna-13B</option>
                      </select>
                    </div>
                  </>
                )}
                {selectedDomain === 'timeseries' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Algorithm</label>
                      <select className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>XGBoost</option>
                        <option>LightGBM</option>
                        <option>Prophet</option>
                        <option>LSTM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Horizon</label>
                      <input 
                        type="number" 
                        defaultValue="7" 
                        className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                      />
                    </div>
                  </>
                )}

                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Learning Rate</label>
                  <input 
                    type="text" 
                    defaultValue="0.001" 
                    className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Epochs</label>
                  <input 
                    type="number" 
                    defaultValue="100" 
                    className="w-full h-9 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                  />
                </div>

                {/* Execution Section */}
                <div className="pt-4 border-t border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-200 mb-3">Execution</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Resource</label>
                      <select className="w-full h-8 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50">
                        <option>GPU-2x (A100)</option>
                        <option>GPU-1x (V100)</option>
                        <option>CPU (16 cores)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Timeout</span>
                      <input 
                        type="text" 
                        defaultValue="2h" 
                        className="w-20 h-7 px-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 text-center focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Retries</span>
                      <input 
                        type="number" 
                        defaultValue="3" 
                        className="w-20 h-7 px-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 text-center focus:outline-none focus:ring-1 focus:ring-brand-500/50" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-3">
                  <Settings size={24} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">Select a node to configure</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
