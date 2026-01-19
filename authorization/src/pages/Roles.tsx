import { useState } from 'react';
import { Plus, Edit, Shield, Code, BarChart3, Eye, ShieldCheck, Database, X, Users, FileText } from 'lucide-react';

const roles = [
  {
    id: 1,
    name: 'Admin',
    type: 'System',
    description: 'Full system administrator privileges. Access to all resources and settings.',
    users: 5,
    groups: 2,
    policies: 12,
    status: 'active',
    icon: Shield,
    color: 'admin',
    linkedPolicies: ['FullAccess', 'SystemAdmin', 'AuditLog-Read', '+9 more'],
  },
  {
    id: 2,
    name: 'Developer',
    type: 'System',
    description: 'Developer base permissions. Development environment and code repository access.',
    users: 32,
    groups: 3,
    policies: 8,
    status: 'active',
    icon: Code,
    color: 'standard',
    linkedPolicies: ['GitRepo-ReadWrite', 'S3-DevBucket', 'K8s-Deploy', '+5 more'],
  },
  {
    id: 3,
    name: 'DataAnalyst',
    type: 'Custom',
    description: 'Data analyst role. Data warehouse and BI tool access permissions.',
    users: 18,
    groups: 1,
    policies: 6,
    status: 'active',
    icon: BarChart3,
    color: 'readonly',
    linkedPolicies: ['DWH-ReadOnly', 'BI-Access', 'S3-DataLake', '+3 more'],
  },
  {
    id: 4,
    name: 'Viewer',
    type: 'System',
    description: 'Read-only role. Dashboard and report viewing only.',
    users: 45,
    groups: 0,
    policies: 3,
    status: 'active',
    icon: Eye,
    color: 'custom',
    linkedPolicies: ['Dashboard-Read', 'Report-View', 'Profile-Self'],
  },
  {
    id: 5,
    name: 'SecurityAuditor',
    type: 'Custom',
    description: 'Security audit role. Audit log and security settings review permissions.',
    users: 4,
    groups: 1,
    policies: 7,
    status: 'active',
    icon: ShieldCheck,
    color: 'admin',
    linkedPolicies: ['AuditLog-FullRead', 'Security-Review', 'Policy-Read', '+4 more'],
  },
  {
    id: 6,
    name: 'MinIO-Admin',
    type: 'Custom',
    description: 'MinIO object storage administrator. Bucket and policy management permissions.',
    users: 3,
    groups: 1,
    policies: 5,
    status: 'active',
    icon: Database,
    color: 'standard',
    linkedPolicies: ['MinIO-FullAccess', 'Bucket-Manage', '+3 more'],
  },
];

const colorMap: Record<string, string> = {
  admin: 'bg-gradient-to-br from-[rgba(239,68,68,0.2)] to-[rgba(245,158,11,0.2)] text-[#f59e0b]',
  standard: 'bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)]',
  readonly: 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
  custom: 'bg-[rgba(139,92,246,0.15)] text-[var(--accent-tertiary)]',
};

export default function Roles() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'system', label: 'System', count: 8 },
    { id: 'custom', label: 'Custom', count: 16 },
    { id: 'active', label: 'Active', count: 21 },
    { id: 'inactive', label: 'Inactive', count: 3 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Role Management</h1>
          <p className="text-[var(--text-muted)]">Define roles to assign to users and groups</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[rgba(0,212,170,0.1)] border border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="glass-card overflow-hidden hover:border-[var(--border-secondary)] transition-all">
            {/* Header */}
            <div className="p-5 flex gap-4 border-b border-[var(--border-primary)]">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[role.color]}`}>
                <role.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold text-[var(--text-primary)]">{role.name}</span>
                  <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded ${
                    role.type === 'System' 
                      ? 'bg-[rgba(239,68,68,0.15)] text-[var(--accent-danger)]'
                      : 'bg-[rgba(139,92,246,0.15)] text-[var(--accent-tertiary)]'
                  }`}>
                    {role.type}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">{role.description}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              {/* Stats */}
              <div className="flex gap-6 mb-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Users className="w-4 h-4 text-[var(--text-muted)]" />
                  {role.users} users assigned
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Users className="w-4 h-4 text-[var(--text-muted)]" />
                  {role.groups} groups
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                  {role.policies} policies
                </div>
              </div>

              {/* Linked Policies */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Linked Policies</div>
                <div className="flex flex-wrap gap-2">
                  {role.linkedPolicies.map((policy, index) => (
                    <span
                      key={index}
                      className={`px-2.5 py-1 text-xs rounded-full ${
                        policy.startsWith('+') 
                          ? 'border border-dashed border-[var(--border-secondary)] text-[var(--text-muted)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {policy}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--border-primary)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className={`status-dot ${role.status}`}></span>
                <span className="text-[var(--text-secondary)]">{role.status === 'active' ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost text-sm">Details</button>
                <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create New Role</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Role Name *</label>
                <input type="text" className="form-input" placeholder="Enter role name (e.g., DataEngineer)" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Enter role description"></textarea>
              </div>
              <div>
                <label className="form-label">Role Type</label>
                <select className="form-select">
                  <option value="custom">Custom</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="form-label">Link Policies</label>
                <select className="form-select" multiple style={{ minHeight: '120px' }}>
                  <option>FullAccess</option>
                  <option>S3-ReadOnly</option>
                  <option>S3-ReadWrite</option>
                  <option>DWH-ReadOnly</option>
                  <option>GitRepo-ReadWrite</option>
                  <option>K8s-Deploy</option>
                  <option>Dashboard-Read</option>
                </select>
                <small className="text-[var(--text-muted)] text-xs mt-1 block">Ctrl/Cmd + Click to select multiple</small>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Activate role</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-primary)]">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Create Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
