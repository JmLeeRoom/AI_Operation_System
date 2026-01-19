import { 
  Link2,
  Plus,
  Play,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image,
  FileText,
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

export function Pairing() {
  const [activeTab, setActiveTab] = useState<'rules' | 'preview' | 'issues'>('rules');

  const pairingRules = [
    {
      id: 'rule-001',
      name: 'Filename Match',
      type: 'filename',
      pattern: '{id}.jpg ↔ {id}.txt',
      matched: 850000,
      failed: 1200,
      status: 'active'
    },
    {
      id: 'rule-002',
      name: 'Metadata Join',
      type: 'metadata',
      pattern: 'images.id = captions.image_id',
      matched: 320000,
      failed: 450,
      status: 'active'
    },
    {
      id: 'rule-003',
      name: 'External CSV',
      type: 'external',
      pattern: 'pairs.csv (image_path, caption)',
      matched: 45000,
      failed: 80,
      status: 'paused'
    },
  ];

  const previewPairs = [
    { id: 1, image: 'img_001.jpg', text: 'A beautiful sunset over the ocean with orange and pink clouds.', score: 0.95, status: 'matched' },
    { id: 2, image: 'img_002.jpg', text: 'A cat sleeping on a cozy blanket near the fireplace.', score: 0.92, status: 'matched' },
    { id: 3, image: 'img_003.jpg', text: 'Mountain landscape with snow peaks.', score: 0.45, status: 'mismatch' },
    { id: 4, image: 'img_004.jpg', text: 'A group of friends having a picnic in the park.', score: 0.88, status: 'matched' },
  ];

  const issueCategories = [
    { category: 'Wrong Caption', count: 320, severity: 'high' },
    { category: 'Unrelated Pair', count: 180, severity: 'high' },
    { category: 'Duplicate Pair', count: 450, severity: 'medium' },
    { category: 'Spam/Low Quality', count: 120, severity: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-cyan-400" />
            </div>
            Pairing Studio
          </h1>
          <p className="text-slate-400 mt-1">이미지-텍스트, 비디오-텍스트 페어 생성 및 검증</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Run Pairing
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Pairs</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">1,215,000</p>
          <p className="text-sm text-emerald-400">+12.5K 이번 주</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Match Rate</span>
            <Link2 className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">98.5%</p>
          <p className="text-sm text-slate-500">Avg. similarity: 0.89</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Mismatch Detected</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">1,730</p>
          <p className="text-sm text-amber-400">Review needed</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Duplicates Removed</span>
            <Trash2 className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">450</p>
          <p className="text-sm text-slate-500">Auto-deduped</p>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="glass-card p-0">
        <div className="border-b border-slate-700/50">
          <nav className="flex">
            {(['rules', 'preview', 'issues'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-cyan-500 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'rules' && 'Pairing Rules'}
                {tab === 'preview' && 'Preview Pairs'}
                {tab === 'issues' && `Issues (${issueCategories.reduce((a, b) => a + b.count, 0)})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Pairing Rules</h3>
                <button className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {pairingRules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-200">{rule.name}</span>
                        <span className="badge badge-slate text-xs">{rule.type}</span>
                      </div>
                      <span className={`badge ${rule.status === 'active' ? 'badge-emerald' : 'badge-slate'}`}>
                        {rule.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-mono mb-3">{rule.pattern}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-emerald-400">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {rule.matched.toLocaleString()} matched
                      </span>
                      <span className="text-rose-400">
                        <XCircle className="w-4 h-4 inline mr-1" />
                        {rule.failed.toLocaleString()} failed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Pair Preview</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search pairs..."
                      className="input-field pl-9 py-1.5 text-sm w-64"
                    />
                  </div>
                  <button className="btn-ghost text-sm">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                {previewPairs.map((pair) => (
                  <div 
                    key={pair.id}
                    className={`p-4 rounded-lg border ${
                      pair.status === 'matched' 
                        ? 'bg-slate-800/50 border-slate-700/50' 
                        : 'bg-rose-900/10 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                        <Image className="w-8 h-8 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-slate-400">{pair.image}</span>
                          <span className="text-slate-600">↔</span>
                        </div>
                        <p className="text-slate-200 mb-2">{pair.text}</p>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm ${pair.score >= 0.8 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            Similarity: {pair.score.toFixed(2)}
                          </span>
                          <span className={`badge ${pair.status === 'matched' ? 'badge-emerald' : 'badge-rose'}`}>
                            {pair.status}
                          </span>
                        </div>
                      </div>
                      <button className="btn-ghost text-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Mismatch Issues</h3>
                <button className="btn-secondary text-sm">
                  <RefreshCw className="w-4 h-4" />
                  Re-scan
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {issueCategories.map((issue, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      issue.severity === 'high' ? 'bg-rose-900/10 border-rose-500/30' :
                      issue.severity === 'medium' ? 'bg-amber-900/10 border-amber-500/30' :
                      'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <p className="text-sm text-slate-400 mb-1">{issue.category}</p>
                    <p className="text-2xl font-bold text-slate-100">{issue.count}</p>
                    <span className={`badge ${
                      issue.severity === 'high' ? 'badge-rose' :
                      issue.severity === 'medium' ? 'badge-amber' : 'badge-slate'
                    } mt-2`}>
                      {issue.severity} severity
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full">
                Send to Review Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
