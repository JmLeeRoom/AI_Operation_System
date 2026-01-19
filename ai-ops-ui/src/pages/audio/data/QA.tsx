import { 
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Eye,
  RefreshCw,
  Download,
  Volume2,
  AudioWaveform,
  Zap,
  Filter,
  Search
} from 'lucide-react';
import { useState } from 'react';

export function AudioQAReport() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>('clipping');

  const qaSummary = {
    total: 15000,
    passed: 14250,
    warnings: 600,
    failed: 150,
    passRate: 95.0,
  };

  const issueCategories = [
    { id: 'clipping', name: 'Clipping', count: 45, severity: 'high', icon: Zap },
    { id: 'low_snr', name: 'Low SNR (<10dB)', count: 120, severity: 'medium', icon: Volume2 },
    { id: 'sr_mismatch', name: 'Sample Rate Mismatch', count: 85, severity: 'medium', icon: AudioWaveform },
    { id: 'too_long', name: 'Too Long (>60s)', count: 200, severity: 'low', icon: AlertTriangle },
    { id: 'too_short', name: 'Too Short (<0.5s)', count: 150, severity: 'low', icon: AlertTriangle },
    { id: 'silence_heavy', name: 'High Silence Ratio (>50%)', count: 180, severity: 'medium', icon: Volume2 },
    { id: 'corrupt', name: 'Corrupted/Unreadable', count: 15, severity: 'high', icon: XCircle },
  ];

  const sampleIssues = [
    { 
      id: 1, 
      filename: 'call_20240115_001.wav', 
      issue: 'clipping', 
      details: 'Peak: -0.1dB, Clipped samples: 234',
      duration: '12.5s',
      sr: '16kHz',
      suggested: 'Apply limiter or re-record'
    },
    { 
      id: 2, 
      filename: 'podcast_ep42_segment3.flac', 
      issue: 'low_snr', 
      details: 'SNR: 8.2dB (threshold: 10dB)',
      duration: '25.3s',
      sr: '44.1kHz',
      suggested: 'Apply denoising'
    },
    { 
      id: 3, 
      filename: 'meeting_record_final.mp3', 
      issue: 'sr_mismatch', 
      details: 'Expected: 16kHz, Actual: 8kHz',
      duration: '180.0s',
      sr: '8kHz',
      suggested: 'Resample or reject'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-rose-400 bg-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-slate-400 bg-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'badge-rose';
      case 'medium': return 'badge-amber';
      case 'low': return 'badge-slate';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audio QA Report</h1>
          <p className="text-slate-400 mt-1">오디오 품질 검사 및 이슈 관리</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Re-scan
          </button>
          <button className="btn-primary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className={`p-6 rounded-xl border ${
        qaSummary.passRate >= 95 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {qaSummary.passRate >= 95 ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-amber-400" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">Pass Rate: {qaSummary.passRate}%</h2>
              <p className="text-slate-400">
                {qaSummary.passed.toLocaleString()} passed / {qaSummary.total.toLocaleString()} total files
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{qaSummary.passed.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{qaSummary.warnings}</p>
              <p className="text-xs text-slate-500">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-rose-400">{qaSummary.failed}</p>
              <p className="text-xs text-slate-500">Failed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Issue Categories */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-brand-400" />
            Issue Categories
          </h2>

          <div className="space-y-2">
            {issueCategories.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedIssue === issue.id 
                    ? 'bg-brand-500/20 border border-brand-500/50' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(issue.severity)}`}>
                      <issue.icon className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200">{issue.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getSeverityBadge(issue.severity)}`}>
                      {issue.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Auto-fix Options</h3>
            <div className="space-y-2">
              <button className="btn-ghost w-full justify-start text-sm">
                <Zap className="w-4 h-4" />
                Apply Limiter (Clipping)
              </button>
              <button className="btn-ghost w-full justify-start text-sm">
                <Volume2 className="w-4 h-4" />
                Apply Denoising (Low SNR)
              </button>
              <button className="btn-ghost w-full justify-start text-sm">
                <AudioWaveform className="w-4 h-4" />
                Resample All (SR Mismatch)
              </button>
            </div>
          </div>
        </div>

        {/* Sample List */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {selectedIssue ? `${issueCategories.find(i => i.id === selectedIssue)?.name} Issues` : 'All Issues'}
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  className="input-field pl-10 py-2 text-sm w-48"
                />
              </div>
              <button className="btn-ghost">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sampleIssues.map((sample) => (
              <div 
                key={sample.id}
                className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-slate-200">{sample.filename}</span>
                      <span className={`badge ${getSeverityBadge(issueCategories.find(i => i.id === sample.issue)?.severity || 'low')}`}>
                        {sample.issue.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{sample.details}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost text-sm py-1.5">
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                    <button className="btn-ghost text-sm py-1.5">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Duration: {sample.duration}</span>
                  <span>•</span>
                  <span>SR: {sample.sr}</span>
                  <span>•</span>
                  <span className="text-cyan-400">💡 {sample.suggested}</span>
                </div>

                {/* Waveform Preview Placeholder */}
                <div className="mt-3 h-12 bg-slate-800/50 rounded flex items-center justify-center">
                  <AudioWaveform className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination / Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
              Showing 3 of {issueCategories.find(i => i.id === selectedIssue)?.count || 795} issues
            </p>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm">Select All</button>
              <button className="btn-secondary text-sm">
                <XCircle className="w-4 h-4" />
                Reject Selected
              </button>
              <button className="btn-primary text-sm">
                <Zap className="w-4 h-4" />
                Auto-fix Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
