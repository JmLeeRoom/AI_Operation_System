import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  Play, 
  Database, 
  Beaker, 
  Box, 
  Rocket,
  Activity,
  Server,
  Shield,
  Settings,
  Sparkles,
  ChevronDown,
  Eye,
  Image,
  Tags,
  Wand2,
  GraduationCap,
  BarChart3,
  Package,
  FileOutput,
  // LLM Icons
  MessageSquare,
  FileText,
  Brain,
  BookOpen,
  Wrench,
  Bot,
  Search,
  ShieldCheck,
  DollarSign,
  // Audio Icons
  Mic,
  Volume2,
  AudioWaveform,
  Music,
  Radio,
  Headphones,
  Speaker,
  // Multimodal Icons
  Layers,
  Link2,
  Video,
  PlayCircle,
  Users,
  Globe,
  // Time Series Icons
  TrendingUp,
  Clock,
  Sliders,
  Calendar,
  Target,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path?: string;
  badge?: number | string;
  children?: { label: string; path: string }[];
  expanded?: boolean;
  onToggle?: () => void;
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string[]>(['Pipelines', 'CV Data', 'CV Training']);

  const toggleExpand = (label: string) => {
    setExpanded(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const NavItem = ({ icon, label, path, badge, children, expanded: isExpanded, onToggle }: NavItemProps) => {
    const isActive = path ? location.pathname === path : false;
    
    return (
      <div>
        <div 
          className={`nav-item ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (children) {
              onToggle?.();
            } else if (path) {
              navigate(path);
            }
          }}
        >
          {icon}
          <span className="flex-1 font-medium">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-brand-500/20 text-brand-400 rounded-full">
              {badge}
            </span>
          )}
          {children && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
        {children && isExpanded && (
          <div className="ml-8 mt-1 space-y-0.5">
            {children.map((child) => (
              <div 
                key={child.path}
                className={`nav-item text-sm py-2 ${location.pathname === child.path ? 'active' : ''}`}
                onClick={() => navigate(child.path)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                <span>{child.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-50"
      style={{ width: '256px' }}
    >
      {/* 로고 */}
      <div className="p-6 border-b border-slate-700/50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Ops</h1>
            <p className="text-xs text-slate-500">MLOps Platform</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main
          </p>
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            path="/"
          />
        </div>

        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Workflow
          </p>
          <NavItem 
            icon={<GitBranch className="w-5 h-5" />} 
            label="Pipelines" 
            children={[
              { label: 'All Pipelines', path: '/pipelines' },
              { label: 'Builder', path: '/pipelines/builder' },
              { label: 'Templates', path: '/pipelines/templates' },
            ]}
            expanded={expanded.includes('Pipelines')}
            onToggle={() => toggleExpand('Pipelines')}
          />
          <NavItem 
            icon={<Play className="w-5 h-5" />} 
            label="Runs" 
            path="/runs"
            badge={12}
          />
        </div>

        {/* Computer Vision 도메인 */}
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            🖼️ Computer Vision
          </p>
          <NavItem 
            icon={<Eye className="w-5 h-5" />} 
            label="CV Dashboard" 
            path="/cv"
          />
          <NavItem 
            icon={<Image className="w-5 h-5" />} 
            label="CV Data" 
            children={[
              { label: 'Data Sources', path: '/cv/data/sources' },
              { label: 'Datasets', path: '/cv/data/datasets' },
              { label: 'Dataset Detail', path: '/cv/data/datasets/detail' },
            ]}
            expanded={expanded.includes('CV Data')}
            onToggle={() => toggleExpand('CV Data')}
          />
          <NavItem 
            icon={<Tags className="w-5 h-5" />} 
            label="Labeling" 
            children={[
              { label: 'Annotation Jobs', path: '/cv/labeling/jobs' },
              { label: 'Label QA', path: '/cv/labeling/qa' },
              { label: 'Active Learning', path: '/cv/labeling/active-learning' },
            ]}
            expanded={expanded.includes('Labeling')}
            onToggle={() => toggleExpand('Labeling')}
          />
          <NavItem 
            icon={<Wand2 className="w-5 h-5" />} 
            label="Augmentation" 
            path="/cv/augmentation"
          />
          <NavItem 
            icon={<GraduationCap className="w-5 h-5" />} 
            label="CV Training" 
            children={[
              { label: 'Task Templates', path: '/cv/training/templates' },
              { label: 'Train Config', path: '/cv/training/config' },
            ]}
            expanded={expanded.includes('CV Training')}
            onToggle={() => toggleExpand('CV Training')}
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Evaluation" 
            children={[
              { label: 'Metrics', path: '/cv/evaluation/metrics' },
              { label: 'Error Analysis', path: '/cv/evaluation/errors' },
            ]}
            expanded={expanded.includes('Evaluation')}
            onToggle={() => toggleExpand('Evaluation')}
          />
          <NavItem 
            icon={<Package className="w-5 h-5" />} 
            label="CV Models" 
            children={[
              { label: 'Registry', path: '/cv/models/registry' },
              { label: 'Export & Optimize', path: '/cv/models/export' },
            ]}
            expanded={expanded.includes('CV Models')}
            onToggle={() => toggleExpand('CV Models')}
          />
        </div>

        {/* LLM 도메인 */}
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            📝 LLM / NLP
          </p>
          <NavItem 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="LLM Dashboard" 
            path="/llm"
          />
          <NavItem 
            icon={<FileText className="w-5 h-5" />} 
            label="Data Pipeline" 
            children={[
              { label: 'Sources', path: '/llm/data/sources' },
              { label: 'Processing', path: '/llm/data/processing' },
              { label: 'Labeling', path: '/llm/data/labeling' },
            ]}
            expanded={expanded.includes('LLM Data')}
            onToggle={() => toggleExpand('LLM Data')}
          />
          <NavItem 
            icon={<Brain className="w-5 h-5" />} 
            label="Training" 
            children={[
              { label: 'Templates', path: '/llm/training/templates' },
              { label: 'Config', path: '/llm/training/config' },
            ]}
            expanded={expanded.includes('LLM Training')}
            onToggle={() => toggleExpand('LLM Training')}
          />
          <NavItem 
            icon={<ShieldCheck className="w-5 h-5" />} 
            label="Evaluation" 
            children={[
              { label: 'Eval Suites', path: '/llm/evaluation/suites' },
              { label: 'Safety & Policy', path: '/llm/evaluation/safety' },
              { label: 'Regression', path: '/llm/evaluation/regression' },
            ]}
            expanded={expanded.includes('LLM Eval')}
            onToggle={() => toggleExpand('LLM Eval')}
          />
          <NavItem 
            icon={<BookOpen className="w-5 h-5" />} 
            label="RAG" 
            children={[
              { label: 'Documents', path: '/llm/rag/documents' },
              { label: 'Chunking', path: '/llm/rag/chunking' },
              { label: 'Embeddings', path: '/llm/rag/embeddings' },
              { label: 'Playground', path: '/llm/rag/playground' },
            ]}
            expanded={expanded.includes('RAG')}
            onToggle={() => toggleExpand('RAG')}
          />
          <NavItem 
            icon={<Bot className="w-5 h-5" />} 
            label="Agents" 
            children={[
              { label: 'Tool Registry', path: '/llm/agents/tools' },
              { label: 'Agent Builder', path: '/llm/agents/builder' },
              { label: 'Traces', path: '/llm/agents/traces' },
            ]}
            expanded={expanded.includes('Agents')}
            onToggle={() => toggleExpand('Agents')}
          />
          <NavItem 
            icon={<Rocket className="w-5 h-5" />} 
            label="Deployment" 
            children={[
              { label: 'Endpoints', path: '/llm/deployment/endpoints' },
              { label: 'Prompts', path: '/llm/deployment/prompts' },
            ]}
            expanded={expanded.includes('LLM Deploy')}
            onToggle={() => toggleExpand('LLM Deploy')}
          />
        </div>

        {/* Speech/Audio 도메인 */}
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            🎤 Speech / Audio
          </p>
          <NavItem 
            icon={<AudioWaveform className="w-5 h-5" />} 
            label="Audio Dashboard" 
            path="/audio"
          />
          <NavItem 
            icon={<Volume2 className="w-5 h-5" />} 
            label="Audio Data" 
            children={[
              { label: 'Sources', path: '/audio/data/sources' },
              { label: 'Processing', path: '/audio/data/processing' },
              { label: 'QA Report', path: '/audio/data/qa' },
            ]}
            expanded={expanded.includes('Audio Data')}
            onToggle={() => toggleExpand('Audio Data')}
          />
          <NavItem 
            icon={<Mic className="w-5 h-5" />} 
            label="ASR" 
            children={[
              { label: 'Transcripts', path: '/audio/asr/transcripts' },
              { label: 'Alignment', path: '/audio/asr/alignment' },
              { label: 'Training', path: '/audio/asr/training' },
              { label: 'Eval', path: '/audio/asr/eval' },
              { label: 'Playground', path: '/audio/asr/playground' },
            ]}
            expanded={expanded.includes('ASR')}
            onToggle={() => toggleExpand('ASR')}
          />
          <NavItem 
            icon={<Speaker className="w-5 h-5" />} 
            label="TTS" 
            children={[
              { label: 'Text Normalization', path: '/audio/tts/normalization' },
              { label: 'Dataset Builder', path: '/audio/tts/dataset' },
              { label: 'Training', path: '/audio/tts/training' },
              { label: 'Eval', path: '/audio/tts/eval' },
            ]}
            expanded={expanded.includes('TTS')}
            onToggle={() => toggleExpand('TTS')}
          />
          <NavItem 
            icon={<Headphones className="w-5 h-5" />} 
            label="Voice Conversion" 
            children={[
              { label: 'Speaker Profiles', path: '/audio/vc/speakers' },
              { label: 'Training & Eval', path: '/audio/vc/training' },
            ]}
            expanded={expanded.includes('VC')}
            onToggle={() => toggleExpand('VC')}
          />
          <NavItem 
            icon={<Music className="w-5 h-5" />} 
            label="Music Gen" 
            children={[
              { label: 'Dataset & Tags', path: '/audio/music/dataset' },
              { label: 'Playground', path: '/audio/music/playground' },
              { label: 'Eval', path: '/audio/music/eval' },
            ]}
            expanded={expanded.includes('Music')}
            onToggle={() => toggleExpand('Music')}
          />
          <NavItem 
            icon={<Radio className="w-5 h-5" />} 
            label="Deployment" 
            children={[
              { label: 'Endpoints', path: '/audio/deployment/endpoints' },
              { label: 'Monitoring', path: '/audio/deployment/monitoring' },
            ]}
            expanded={expanded.includes('Audio Deploy')}
            onToggle={() => toggleExpand('Audio Deploy')}
          />
        </div>

        {/* Multimodal 도메인 */}
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            🎭 Multimodal
          </p>
          <NavItem 
            icon={<Layers className="w-5 h-5" />} 
            label="MM Dashboard" 
            path="/multimodal"
          />
          <NavItem 
            icon={<Link2 className="w-5 h-5" />} 
            label="MM Data" 
            children={[
              { label: 'Sources', path: '/multimodal/data/sources' },
              { label: 'Datasets', path: '/multimodal/data/datasets' },
              { label: 'Pairing Studio', path: '/multimodal/data/pairing' },
              { label: 'Alignment', path: '/multimodal/data/alignment' },
              { label: 'Preprocess', path: '/multimodal/data/preprocess' },
              { label: 'Labeling & QA', path: '/multimodal/data/labeling' },
              { label: 'Embedding', path: '/multimodal/data/embedding' },
            ]}
            expanded={expanded.includes('MM Data')}
            onToggle={() => toggleExpand('MM Data')}
          />
          <NavItem 
            icon={<Brain className="w-5 h-5" />} 
            label="MM Training" 
            children={[
              { label: 'Templates', path: '/multimodal/training/templates' },
              { label: 'Config', path: '/multimodal/training/config' },
              { label: 'Run Detail', path: '/multimodal/training/runs' },
            ]}
            expanded={expanded.includes('MM Training')}
            onToggle={() => toggleExpand('MM Training')}
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="MM Evaluation" 
            children={[
              { label: 'Task Eval', path: '/multimodal/evaluation/tasks' },
              { label: 'Grounding', path: '/multimodal/evaluation/grounding' },
              { label: 'Regression', path: '/multimodal/evaluation/regression' },
              { label: 'Human Review', path: '/multimodal/evaluation/review' },
            ]}
            expanded={expanded.includes('MM Eval')}
            onToggle={() => toggleExpand('MM Eval')}
          />
          <NavItem 
            icon={<PlayCircle className="w-5 h-5" />} 
            label="Serving & Agents" 
            children={[
              { label: 'Playground', path: '/multimodal/serving/playground' },
              { label: 'Tools', path: '/multimodal/serving/tools' },
              { label: 'Agent Builder', path: '/multimodal/serving/agent-builder' },
              { label: 'Traces', path: '/multimodal/serving/traces' },
            ]}
            expanded={expanded.includes('MM Serving')}
            onToggle={() => toggleExpand('MM Serving')}
          />
          <NavItem 
            icon={<Globe className="w-5 h-5" />} 
            label="MM Deployment" 
            children={[
              { label: 'Model Registry', path: '/multimodal/deployment/registry' },
              { label: 'Endpoints', path: '/multimodal/deployment/endpoints' },
              { label: 'Monitoring', path: '/multimodal/deployment/monitoring' },
            ]}
            expanded={expanded.includes('MM Deploy')}
            onToggle={() => toggleExpand('MM Deploy')}
          />
        </div>

        {/* Time Series / Tabular 도메인 */}
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            📈 Time Series / Tabular
          </p>
          <NavItem 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="TS Dashboard" 
            path="/timeseries"
          />
          <NavItem 
            icon={<Database className="w-5 h-5" />} 
            label="TS Data" 
            children={[
              { label: 'Connections', path: '/timeseries/data/connections' },
              { label: 'Datasets', path: '/timeseries/data/datasets' },
              { label: 'Schema & Quality', path: '/timeseries/data/quality' },
              { label: 'Feature Pipeline', path: '/timeseries/data/features' },
              { label: 'Feature Store', path: '/timeseries/data/store' },
              { label: 'Targets', path: '/timeseries/data/targets' },
            ]}
            expanded={expanded.includes('TS Data')}
            onToggle={() => toggleExpand('TS Data')}
          />
          <NavItem 
            icon={<Layers className="w-5 h-5" />} 
            label="Modeling" 
            children={[
              { label: 'Templates', path: '/timeseries/modeling/templates' },
              { label: 'Train Config', path: '/timeseries/modeling/config' },
              { label: 'Run Detail', path: '/timeseries/modeling/run' },
            ]}
            expanded={expanded.includes('TS Modeling')}
            onToggle={() => toggleExpand('TS Modeling')}
          />
          <NavItem 
            icon={<Calendar className="w-5 h-5" />} 
            label="Evaluation" 
            children={[
              { label: 'Backtest Builder', path: '/timeseries/evaluation/backtest' },
              { label: 'Backtest Report', path: '/timeseries/evaluation/report' },
              { label: 'Segment Metrics', path: '/timeseries/evaluation/metrics' },
              { label: 'Error Analysis', path: '/timeseries/evaluation/errors' },
              { label: 'Benchmark', path: '/timeseries/evaluation/benchmark' },
            ]}
            expanded={expanded.includes('TS Eval')}
            onToggle={() => toggleExpand('TS Eval')}
          />
          <NavItem 
            icon={<Sliders className="w-5 h-5" />} 
            label="Anomaly Ops" 
            children={[
              { label: 'Threshold Tuning', path: '/timeseries/anomaly/threshold' },
              { label: 'Alert Triage', path: '/timeseries/anomaly/triage' },
            ]}
            expanded={expanded.includes('Anomaly')}
            onToggle={() => toggleExpand('Anomaly')}
          />
          <NavItem 
            icon={<Rocket className="w-5 h-5" />} 
            label="TS Deployment" 
            children={[
              { label: 'Model Registry', path: '/timeseries/deployment/registry' },
              { label: 'Endpoints', path: '/timeseries/deployment/endpoints' },
              { label: 'Rollout', path: '/timeseries/deployment/rollout' },
            ]}
            expanded={expanded.includes('TS Deploy')}
            onToggle={() => toggleExpand('TS Deploy')}
          />
          <NavItem 
            icon={<Activity className="w-5 h-5" />} 
            label="TS Monitoring" 
            children={[
              { label: 'Monitoring', path: '/timeseries/monitoring/dashboard' },
              { label: 'Alert Rules', path: '/timeseries/monitoring/alerts' },
              { label: 'Feedback & Retrain', path: '/timeseries/monitoring/feedback' },
            ]}
            expanded={expanded.includes('TS Monitor')}
            onToggle={() => toggleExpand('TS Monitor')}
          />
        </div>

        {/* 공통 인프라 */}
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Common
          </p>
          <NavItem 
            icon={<Database className="w-5 h-5" />} 
            label="Datasets" 
            path="/data/datasets"
          />
          <NavItem 
            icon={<Beaker className="w-5 h-5" />} 
            label="Experiments" 
            path="/experiments"
          />
          <NavItem 
            icon={<Box className="w-5 h-5" />} 
            label="Models" 
            path="/models/registry"
            badge={24}
          />
        </div>

        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Production
          </p>
          <NavItem 
            icon={<Rocket className="w-5 h-5" />} 
            label="Deployments" 
            path="/deployments/endpoints"
          />
          <NavItem 
            icon={<Activity className="w-5 h-5" />} 
            label="Monitoring" 
            path="/monitoring/dashboard"
          />
        </div>

        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Admin
          </p>
          <NavItem 
            icon={<Server className="w-5 h-5" />} 
            label="Resources" 
            path="/resources/compute"
          />
          <NavItem 
            icon={<Shield className="w-5 h-5" />} 
            label="Governance" 
            path="/governance/users"
          />
        </div>
      </nav>

      {/* 하단 */}
      <div className="p-4 border-t border-slate-700/50">
        <NavItem
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          path="/settings"
        />
        
        {/* 사용자 정보 */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">JM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">JaeMyeong</p>
            <p className="text-xs text-slate-500 truncate">Admin</p>
          </div>
          <div className="status-dot online" />
        </div>
      </div>
    </aside>
  );
}
