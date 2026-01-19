import { useState } from 'react';
import { 
  Clock, 
  RotateCcw, 
  Ban, 
  Download,
  Terminal,
  CheckCircle2,
  Loader2,
  XCircle,
  FileText,
  BarChart2,
  ChevronRight,
  DollarSign,
  User,
  GitCommit,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const runInfo = {
  id: 'run-001',
  pipeline: 'CV Object Detection Training',
  status: 'running',
  startedAt: '2024-01-15 10:30:00',
  trigger: 'manual',
  initiator: 'JaeMyeong',
  commitHash: 'a8f3e21',
  datasetVersion: 'v1.2.3',
  duration: '45m 23s',
  cost: 12.45,
};

const tasks = [
  { id: '1', name: 'Data Loader', status: 'succeeded', duration: '2m 15s' },
  { id: '2', name: 'Data Validator', status: 'succeeded', duration: '1m 45s' },
  { id: '3', name: 'Data Augmentation', status: 'succeeded', duration: '5m 30s' },
  { id: '4', name: 'Train Model', status: 'running', duration: '35m' },
  { id: '5', name: 'Evaluate Model', status: 'queued', duration: '-' },
  { id: '6', name: 'Register Model', status: 'queued', duration: '-' },
];

const mockLogs = `[10:30:00] INFO: Starting Data Loader...
[10:30:05] INFO: Loading dataset from s3://ml-data/cv-dataset-v1.2.3
[10:30:15] INFO: Loaded 50,000 images across 10 classes
[10:32:15] INFO: Data Loader completed successfully
[10:32:16] INFO: Starting Data Validator...
[10:33:00] INFO: Schema validation passed
[10:34:00] INFO: Data Validator completed successfully
[10:34:01] INFO: Starting Data Augmentation...
[10:39:31] INFO: Data Augmentation completed
[10:39:32] INFO: Starting Train Model...
[10:39:35] INFO: Initializing ResNet-50 model
[10:39:40] INFO: Training on 2x A100 GPUs
[10:45:00] INFO: Epoch 1/100 - Loss: 2.345 - Acc: 0.234
[10:50:00] INFO: Epoch 10/100 - Loss: 1.234 - Acc: 0.567
[10:55:00] INFO: Epoch 20/100 - Loss: 0.876 - Acc: 0.723
[11:00:00] INFO: Epoch 30/100 - Loss: 0.654 - Acc: 0.812
[11:05:00] INFO: Epoch 40/100 - Loss: 0.512 - Acc: 0.867`;

const metrics = [
  { name: 'Loss', value: '0.512' },
  { name: 'Accuracy', value: '86.7%' },
  { name: 'Epoch', value: '40/100' },
  { name: 'Learning Rate', value: '0.0001' },
];

export function RunDetail() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState('4');
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'artifacts'>('logs');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'queued': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <button 
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-2"
            onClick={() => navigate('/runs')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Runs
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{runInfo.id}</h1>
            <span className="badge badge-blue flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Running
            </span>
          </div>
          <p className="text-slate-400 mt-1">{runInfo.pipeline}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
          <button className="btn-danger">
            <Ban className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Run 정보 */}
      <div className="glass-card p-5">
        <div className="grid grid-cols-6 gap-6">
          {[
            { icon: <Calendar className="w-4 h-4" />, label: 'Started', value: runInfo.startedAt },
            { icon: <Clock className="w-4 h-4" />, label: 'Duration', value: runInfo.duration },
            { icon: <User className="w-4 h-4" />, label: 'Trigger', value: `${runInfo.trigger} by ${runInfo.initiator}` },
            { icon: <GitCommit className="w-4 h-4" />, label: 'Commit', value: runInfo.commitHash, mono: true },
            { icon: <FileText className="w-4 h-4" />, label: 'Dataset', value: runInfo.datasetVersion, mono: true },
            { icon: <DollarSign className="w-4 h-4" />, label: 'Cost', value: `$${runInfo.cost.toFixed(2)}` },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className={`text-sm font-medium text-slate-200 ${item.mono ? 'font-mono' : ''}`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tasks */}
        <div className="col-span-3">
          <div className="glass-card">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h3 className="font-semibold text-white">Tasks</h3>
            </div>
            <div className="divide-y divide-slate-700/50">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    selectedTask === task.id 
                      ? 'bg-brand-500/10 border-l-2 border-brand-500' 
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{task.name}</p>
                    <p className="text-xs text-slate-500">{task.duration}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${
                    selectedTask === task.id ? 'translate-x-0.5 text-brand-400' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 상세 */}
        <div className="col-span-9 space-y-4">
          {/* 메트릭 카드 */}
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="stat-card">
                <p className="text-xs text-slate-500">{metric.name}</p>
                <p className="text-xl font-bold text-white mt-1">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* 탭 */}
          <div className="glass-card">
            <div className="flex items-center border-b border-slate-700/50">
              {[
                { id: 'logs', label: 'Logs', icon: <Terminal className="w-4 h-4" /> },
                { id: 'metrics', label: 'Metrics', icon: <BarChart2 className="w-4 h-4" /> },
                { id: 'artifacts', label: 'Artifacts', icon: <FileText className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <div className="flex-1" />
              {activeTab === 'logs' && (
                <button className="btn-ghost mr-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
            
            <div className="p-4">
              {activeTab === 'logs' && (
                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-xs max-h-80 overflow-auto border border-slate-800">
                  {mockLogs.split('\n').map((line, i) => (
                    <div key={i} className="py-0.5 text-slate-400 hover:text-slate-200 transition-colors">
                      <span className="text-slate-600 mr-3 select-none">{String(i + 1).padStart(2, '0')}</span>
                      {line}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800 text-blue-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Live tailing...</span>
                  </div>
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="space-y-4">
                  <div className="h-48 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Training Loss & Accuracy Chart</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Training Progress', value: 40, max: 100, unit: 'epochs' },
                      { label: 'GPU Utilization', value: 92, max: 100, unit: '%' },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-xs text-slate-500 mb-2">{item.label}</p>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${item.value}%` }} />
                        </div>
                        <p className="text-xs text-slate-400">{item.value} / {item.max} {item.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'artifacts' && (
                <div className="divide-y divide-slate-800">
                  {[
                    { name: 'checkpoint_epoch_40.pt', size: '245 MB' },
                    { name: 'training_metrics.json', size: '12 KB' },
                    { name: 'confusion_matrix.png', size: '156 KB' },
                  ].map((artifact) => (
                    <div key={artifact.name} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800/50">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{artifact.name}</p>
                          <p className="text-xs text-slate-500">{artifact.size}</p>
                        </div>
                      </div>
                      <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
