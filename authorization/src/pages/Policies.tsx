import { useState } from 'react';
import { Plus, Download, Eye, Trash2, Database, Server, Globe, X, ChevronLeft, ChevronRight } from 'lucide-react';

const policies = [
  { id: 'pol_001', name: 'S3-DataLake-ReadOnly', type: 'S3/MinIO', resource: 'data-lake/*', actions: ['Read', 'List'], linkedRoles: 3, status: 'active' },
  { id: 'pol_002', name: 'MinIO-DevBucket-Full', type: 'S3/MinIO', resource: 'dev-bucket/*', actions: ['All'], linkedRoles: 2, status: 'active' },
  { id: 'pol_003', name: 'DWH-Analytics-Read', type: 'Database', resource: 'analytics.*', actions: ['Select'], linkedRoles: 5, status: 'active' },
  { id: 'pol_004', name: 'API-Gateway-Public', type: 'API Gateway', resource: '/api/v1/public/*', actions: ['GET'], linkedRoles: 1, status: 'active' },
  { id: 'pol_005', name: 'K8s-Deploy-Dev', type: 'Kubernetes', resource: 'dev-namespace/*', actions: ['Deploy', 'Get'], linkedRoles: 2, status: 'active' },
];

const typeColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  'S3/MinIO': { bg: 'bg-[rgba(245,158,11,0.15)]', text: 'text-[var(--accent-warning)]', icon: Database },
  'Database': { bg: 'bg-[rgba(14,165,233,0.15)]', text: 'text-[var(--accent-secondary)]', icon: Database },
  'API Gateway': { bg: 'bg-[rgba(139,92,246,0.15)]', text: 'text-[var(--accent-tertiary)]', icon: Globe },
  'Kubernetes': { bg: 'bg-[rgba(0,212,170,0.15)]', text: 'text-[var(--accent-primary)]', icon: Server },
};

const actionColors: Record<string, string> = {
  'Read': 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
  'List': 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
  'Write': 'bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)]',
  'Delete': 'bg-[rgba(239,68,68,0.15)] text-[var(--accent-danger)]',
  'Admin': 'bg-[rgba(245,158,11,0.15)] text-[var(--accent-warning)]',
  'All': 'bg-[rgba(139,92,246,0.15)] text-[var(--accent-tertiary)]',
  'Select': 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
  'GET': 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
  'Deploy': 'bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)]',
  'Get': 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
};

export default function Policies() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Policy Management</h1>
          <p className="text-[var(--text-muted)]">Define and manage resource access policies (OPA/Rego based)</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Create Policy
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--text-muted)]">Type:</label>
          <select className="form-select w-36">
            <option>All</option>
            <option>S3/MinIO</option>
            <option>Database</option>
            <option>API Gateway</option>
            <option>Kubernetes</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--text-muted)]">Status:</label>
          <select className="form-select w-28">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--text-muted)]">Action:</label>
          <select className="form-select w-28">
            <option>All</option>
            <option>Read</option>
            <option>Write</option>
            <option>Delete</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {/* Policies Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="accent-[var(--accent-primary)]" />
                </th>
                <th>Policy</th>
                <th>Type</th>
                <th>Resource</th>
                <th>Actions</th>
                <th>Linked Roles</th>
                <th>Status</th>
                <th className="w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => {
                const typeStyle = typeColors[policy.type] || typeColors['Database'];
                return (
                  <tr key={policy.id}>
                    <td>
                      <input type="checkbox" className="accent-[var(--accent-primary)]" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeStyle.bg} ${typeStyle.text}`}>
                          <typeStyle.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{policy.name}</div>
                          <div className="text-xs font-mono text-[var(--text-muted)]">{policy.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${typeStyle.bg} ${typeStyle.text}`}>{policy.type}</span>
                    </td>
                    <td>
                      <code className="px-2 py-1 bg-[var(--bg-tertiary)] rounded text-sm font-mono text-[var(--text-secondary)]">
                        {policy.resource}
                      </code>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {policy.actions.map((action, index) => (
                          <span key={index} className={`px-2 py-0.5 text-xs font-semibold uppercase rounded ${actionColors[action] || 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'}`}>
                            {action}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)]">{policy.linkedRoles}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`status-dot ${policy.status}`}></span>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {policy.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-danger)]">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-primary)] flex items-center justify-between">
          <div className="text-sm text-[var(--text-muted)]">
            Showing <strong className="text-[var(--text-primary)]">1-10</strong> of <strong className="text-[var(--text-primary)]">89</strong> policies
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)]">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">3</button>
            <span className="px-2 text-[var(--text-muted)]">...</span>
            <button className="px-3 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">9</button>
            <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Policy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-xl p-6 m-4 animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create New Policy</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Policy Name *</label>
                <input type="text" className="form-input" placeholder="e.g., S3-BucketName-ReadOnly" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Enter policy description"></textarea>
              </div>
              <div>
                <label className="form-label">Policy Type</label>
                <select className="form-select">
                  <option value="">Select Type</option>
                  <option>S3/MinIO</option>
                  <option>Database</option>
                  <option>API Gateway</option>
                  <option>Kubernetes</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Resource Path *</label>
                <input type="text" className="form-input font-mono" placeholder="e.g., bucket-name/*, database.table, /api/v1/*" />
              </div>
              <div>
                <label className="form-label">Allowed Actions</label>
                <div className="flex flex-wrap gap-4">
                  {['Read', 'Write', 'Delete', 'Admin'].map((action) => (
                    <label key={action} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[var(--accent-primary)]" />
                      <span className="text-sm text-[var(--text-secondary)]">{action}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Policy JSON (Advanced)</label>
                <textarea
                  className="form-textarea font-mono text-sm"
                  style={{ minHeight: '150px' }}
                  placeholder={`{
  "Version": "2012-10-17",
  "Statement": [...]
}`}
                ></textarea>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Activate policy</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-primary)]">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Create Policy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
