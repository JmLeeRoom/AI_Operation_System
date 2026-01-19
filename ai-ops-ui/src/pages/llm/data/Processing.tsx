import { 
  Wand2,
  Filter,
  Shield,
  GitBranch,
  Play,
  Plus,
  ArrowRight,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
  FileText,
  Hash,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

export function LLMDataProcessing() {
  const [activeTab, setActiveTab] = useState<'cleaning' | 'dedup' | 'pii' | 'tokenization'>('cleaning');

  const processingJobs = [
    { id: 1, name: 'Tech Blog Cleaning', type: 'cleaning', status: 'completed', input: '125,400', output: '98,234', reduction: '21.6%', duration: '45m' },
    { id: 2, name: 'Chat Log Dedup', type: 'dedup', status: 'running', input: '1,250,000', output: '890,000', reduction: '28.8%', duration: '2h 30m' },
    { id: 3, name: 'Support Tickets PII', type: 'pii', status: 'completed', input: '45,600', output: '45,600', reduction: '-', duration: '1h 15m' },
    { id: 4, name: 'Wiki Tokenization', type: 'tokenization', status: 'completed', input: '8,920', output: '142M tokens', reduction: '-', duration: '25m' },
  ];

  const cleaningRules = [
    { name: 'Remove HTML tags', enabled: true },
    { name: 'Normalize whitespace', enabled: true },
    { name: 'Fix encoding issues', enabled: true },
    { name: 'Remove URLs', enabled: false },
    { name: 'Language filter (EN/KO)', enabled: true },
    { name: 'Minimum length (100 chars)', enabled: true },
    { name: 'Quality score filter (>0.7)', enabled: true },
  ];

  const piiCategories = [
    { name: 'Email addresses', count: 1245, action: 'mask' },
    { name: 'Phone numbers', count: 892, action: 'mask' },
    { name: 'Credit card numbers', count: 12, action: 'remove' },
    { name: 'Social Security Numbers', count: 0, action: 'remove' },
    { name: 'Person names', count: 5621, action: 'mask' },
    { name: 'Physical addresses', count: 234, action: 'mask' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-emerald';
      case 'running': return 'badge-cyan';
      case 'failed': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cleaning': return <Wand2 className="w-4 h-4" />;
      case 'dedup': return <Filter className="w-4 h-4" />;
      case 'pii': return <Shield className="w-4 h-4" />;
      case 'tokenization': return <Hash className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Processing</h1>
          <p className="text-slate-400 mt-1">정제, 중복 제거, PII 필터링, 토크나이저 설정</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Pipeline
        </button>
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg w-fit">
        {[
          { key: 'cleaning', label: 'Cleaning', icon: Wand2 },
          { key: 'dedup', label: 'Deduplication', icon: Filter },
          { key: 'pii', label: 'PII Filter', icon: Shield },
          { key: 'tokenization', label: 'Tokenization', icon: Hash },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽: 설정 */}
        <div className="col-span-2 space-y-6">
          {/* Cleaning Tab */}
          {activeTab === 'cleaning' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-violet-400" />
                Cleaning Recipe
              </h2>
              
              <div className="space-y-3">
                {cleaningRules.map((rule, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                  >
                    <span className="text-slate-200">{rule.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={rule.enabled}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Sample Preview */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Sample Preview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Before</p>
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-sm text-slate-300 font-mono leading-relaxed">
                      {'<p>Check out our blog at http://example.com!</p>\n\n\n We offer    great products...'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">After</p>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-sm text-slate-300 font-mono leading-relaxed">
                      {'Check out our blog! We offer great products...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dedup Tab */}
          {activeTab === 'dedup' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                Deduplication Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Algorithm</label>
                  <select className="input-field">
                    <option>SimHash (Near-duplicate)</option>
                    <option>Exact Hash (MD5)</option>
                    <option>MinHash LSH</option>
                    <option>Sentence Embedding Similarity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Similarity Threshold</label>
                  <input type="range" min="0.5" max="1" step="0.05" defaultValue="0.85" className="w-full accent-brand-500" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0.5 (Loose)</span>
                    <span className="text-brand-400">0.85</span>
                    <span>1.0 (Exact)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Dedup Level</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="level" defaultChecked className="text-brand-500" />
                      <span className="text-slate-300">Document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="level" className="text-brand-500" />
                      <span className="text-slate-300">Paragraph</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="level" className="text-brand-500" />
                      <span className="text-slate-300">Sentence</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Last Dedup Report</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">1.25M</p>
                    <p className="text-xs text-slate-500">Input Documents</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-rose-400">360K</p>
                    <p className="text-xs text-slate-500">Duplicates Found</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-400">890K</p>
                    <p className="text-xs text-slate-500">Unique Documents</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PII Tab */}
          {activeTab === 'pii' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                PII Detection & Masking
              </h2>
              
              <div className="overflow-hidden rounded-lg border border-slate-700/50">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PII Category</th>
                      <th>Detected</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {piiCategories.map((item, index) => (
                      <tr key={index}>
                        <td className="text-slate-200">{item.name}</td>
                        <td>
                          <span className={`font-mono ${item.count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {item.count.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <select className="input-field py-1.5 text-sm" defaultValue={item.action}>
                            <option value="mask">Mask</option>
                            <option value="remove">Remove</option>
                            <option value="keep">Keep</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-200 font-medium">PII Warning</p>
                    <p className="text-sm text-amber-300/70 mt-1">
                      8,004 PII instances detected. Ensure masking is applied before training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tokenization Tab */}
          {activeTab === 'tokenization' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-amber-400" />
                Tokenization & Sharding
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tokenizer</label>
                  <select className="input-field">
                    <option>llama-3-tokenizer (128k vocab)</option>
                    <option>gpt-4-tokenizer (100k vocab)</option>
                    <option>mistral-tokenizer (32k vocab)</option>
                    <option>Custom BPE (train new)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Max Sequence Length</label>
                    <input type="number" className="input-field" defaultValue={4096} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Shard Size (MB)</label>
                    <input type="number" className="input-field" defaultValue={512} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="packing" defaultChecked className="rounded text-brand-500" />
                  <label htmlFor="packing" className="text-slate-300">Enable sequence packing</label>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Token Preview</h3>
                <input 
                  type="text" 
                  placeholder="Enter text to preview tokenization..." 
                  className="input-field mb-3"
                  defaultValue="Hello, how are you today?"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['Hello', ',', ' how', ' are', ' you', ' today', '?'].map((token, i) => (
                    <span key={i} className="px-2 py-1 bg-brand-500/20 text-brand-300 rounded text-sm font-mono">
                      {token}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">7 tokens</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 처리 작업 목록 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Jobs</h2>
            <button className="btn-ghost text-sm">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {processingJobs.map((job) => (
              <div 
                key={job.id}
                className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(job.type)}
                    <span className="font-medium text-slate-200">{job.name}</span>
                  </div>
                  <span className={`badge ${getStatusBadge(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <span>Input: {job.input}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Output: {job.output}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration: {job.duration}</span>
                    {job.reduction !== '-' && (
                      <span className="text-emerald-400">-{job.reduction}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full mt-4">
            <Play className="w-4 h-4" />
            Run Processing Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}
