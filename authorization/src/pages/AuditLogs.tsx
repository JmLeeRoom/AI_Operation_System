import { useState } from 'react';
import { Download, Filter, Search, RefreshCw, ChevronLeft, ChevronRight, UserPlus, Star, Shield, Trash2, Eye, AlertTriangle } from 'lucide-react';

const auditLogs = [
  { id: 1, timestamp: '2026-01-17 14:32:45', user: 'admin@company.com', action: 'USER_CREATED', resource: 'user/kim.cs', result: 'SUCCESS', ip: '192.168.1.100', icon: UserPlus, iconBg: 'bg-[rgba(16,185,129,0.15)]', iconColor: 'text-[var(--accent-success)]' },
  { id: 2, timestamp: '2026-01-17 14:28:12', user: 'john.lee@company.com', action: 'ROLE_MODIFIED', resource: 'role/DataAnalyst', result: 'SUCCESS', ip: '192.168.1.101', icon: Star, iconBg: 'bg-[rgba(14,165,233,0.15)]', iconColor: 'text-[var(--accent-secondary)]' },
  { id: 3, timestamp: '2026-01-17 14:15:33', user: 'system', action: 'POLICY_EVALUATED', resource: 'policy/S3-ReadOnly', result: 'ALLOW', ip: '-', icon: Shield, iconBg: 'bg-[rgba(139,92,246,0.15)]', iconColor: 'text-[var(--accent-tertiary)]' },
  { id: 4, timestamp: '2026-01-17 13:45:21', user: 'admin@company.com', action: 'USER_DELETED', resource: 'user/test_user', result: 'SUCCESS', ip: '192.168.1.100', icon: Trash2, iconBg: 'bg-[rgba(239,68,68,0.15)]', iconColor: 'text-[var(--accent-danger)]' },
  { id: 5, timestamp: '2026-01-17 13:30:08', user: 'system', action: 'POLICY_EVALUATED', resource: 'policy/S3-WriteOnly', result: 'DENY', ip: '-', icon: AlertTriangle, iconBg: 'bg-[rgba(245,158,11,0.15)]', iconColor: 'text-[var(--accent-warning)]' },
  { id: 6, timestamp: '2026-01-17 12:55:44', user: 'sarah.park@company.com', action: 'LOGIN', resource: 'auth/session', result: 'SUCCESS', ip: '192.168.1.105', icon: Eye, iconBg: 'bg-[rgba(0,212,170,0.15)]', iconColor: 'text-[var(--accent-primary)]' },
  { id: 7, timestamp: '2026-01-17 12:30:15', user: 'mike.lee@company.com', action: 'POLICY_CREATED', resource: 'policy/MinIO-Admin', result: 'SUCCESS', ip: '192.168.1.102', icon: Shield, iconBg: 'bg-[rgba(16,185,129,0.15)]', iconColor: 'text-[var(--accent-success)]' },
  { id: 8, timestamp: '2026-01-17 11:45:30', user: 'unknown', action: 'LOGIN_FAILED', resource: 'auth/session', result: 'FAILURE', ip: '203.45.67.89', icon: AlertTriangle, iconBg: 'bg-[rgba(239,68,68,0.15)]', iconColor: 'text-[var(--accent-danger)]' },
];

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'SUCCESS':
      case 'ALLOW':
        return 'badge-success';
      case 'DENY':
      case 'FAILURE':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Logs</h1>
          <p className="text-[var(--text-muted)]">View and search system activity logs</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn btn-ghost">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by user, action, or resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--text-muted)]" />
            <select className="form-select w-32">
              <option>All Actions</option>
              <option>USER_*</option>
              <option>ROLE_*</option>
              <option>POLICY_*</option>
              <option>LOGIN*</option>
            </select>
          </div>
          <div>
            <select className="form-select w-28">
              <option>All Results</option>
              <option>SUCCESS</option>
              <option>FAILURE</option>
              <option>ALLOW</option>
              <option>DENY</option>
            </select>
          </div>
          <div>
            <select className="form-select w-32">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Result</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-sm text-[var(--text-muted)]">{log.timestamp}</td>
                  <td className="text-[var(--text-secondary)]">{log.user}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.iconBg} ${log.iconColor}`}>
                        <log.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-[var(--text-primary)]">{log.action}</span>
                    </div>
                  </td>
                  <td>
                    <code className="text-sm font-mono text-[var(--text-muted)]">{log.resource}</code>
                  </td>
                  <td>
                    <span className={`badge ${getResultBadge(log.result)}`}>{log.result}</span>
                  </td>
                  <td className="font-mono text-sm text-[var(--text-muted)]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-primary)] flex items-center justify-between">
          <div className="text-sm text-[var(--text-muted)]">
            Showing <strong className="text-[var(--text-primary)]">1-50</strong> of <strong className="text-[var(--text-primary)]">12,847</strong> logs
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)]">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">3</button>
            <span className="px-2 text-[var(--text-muted)]">...</span>
            <button className="px-3 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">257</button>
            <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">12,847</div>
          <div className="text-sm text-[var(--text-muted)]">Total Logs (24h)</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--accent-success)]">98.5%</div>
          <div className="text-sm text-[var(--text-muted)]">Success Rate</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--accent-warning)]">23</div>
          <div className="text-sm text-[var(--text-muted)]">Failed Logins</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--accent-danger)]">5</div>
          <div className="text-sm text-[var(--text-muted)]">Policy Denials</div>
        </div>
      </div>
    </div>
  );
}
