import { useState } from 'react';
import { Plus, Edit, Trash2, Users, X, Grid, List } from 'lucide-react';

const groups = [
  { id: 1, name: 'Backend Developers', description: 'Backend development team. API development and server management permissions.', members: 8, roles: 3, color: 'primary' },
  { id: 2, name: 'Data Engineers', description: 'Data engineering team. Data pipeline and ETL job permissions.', members: 12, roles: 5, color: 'secondary' },
  { id: 3, name: 'Security Team', description: 'Security team. Security audit and access control management permissions.', members: 4, roles: 7, color: 'tertiary' },
  { id: 4, name: 'Data Analysts', description: 'Data analysis team. BI tools and analytics data access permissions.', members: 7, roles: 2, color: 'warning' },
  { id: 5, name: 'Platform Admins', description: 'Platform administrators. Full system management privileges.', members: 3, roles: 12, color: 'primary' },
  { id: 6, name: 'Frontend Developers', description: 'Frontend development team. Web application development permissions.', members: 5, roles: 2, color: 'secondary' },
];

export default function Groups() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);

  const colorMap: Record<string, string> = {
    primary: 'bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)]',
    secondary: 'bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)]',
    tertiary: 'bg-[rgba(139,92,246,0.15)] text-[var(--accent-tertiary)]',
    warning: 'bg-[rgba(245,158,11,0.15)] text-[var(--accent-warning)]',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Group Management</h1>
          <p className="text-[var(--text-muted)]">Create and manage user groups</p>
        </div>
        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--bg-card)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--bg-card)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="glass-card p-5 hover:border-[var(--accent-primary)] transition-all cursor-pointer relative group">
              {/* Accent Bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${colorMap[group.color]} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[group.color]}`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-danger)]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{group.name}</h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">{group.description}</p>

              {/* Member Avatars */}
              <div className="flex -space-x-2 mb-4">
                {[...Array(Math.min(3, group.members))].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-xs font-semibold text-[var(--bg-primary)]">
                    {['JK', 'SP', 'ML'][i]}
                  </div>
                ))}
                {group.members > 3 && (
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-xs text-[var(--text-muted)]">
                    +{group.members - 3}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-[var(--border-primary)]">
                <div>
                  <div className="text-xl font-bold font-mono text-[var(--text-primary)]">{group.members}</div>
                  <div className="text-xs text-[var(--text-muted)]">Members</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-[var(--text-primary)]">{group.roles}</div>
                  <div className="text-xs text-[var(--text-muted)]">Roles</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="glass-card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Roles</th>
                <th>Created</th>
                <th className="w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td className="font-medium text-[var(--text-primary)]">{group.name}</td>
                  <td className="text-[var(--text-muted)]">{group.description}</td>
                  <td>{group.members}</td>
                  <td>{group.roles}</td>
                  <td className="text-[var(--text-muted)]">2024-06-15</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-danger)]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create New Group</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Group Name *</label>
                <input type="text" className="form-input" placeholder="Enter group name" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Enter group description"></textarea>
              </div>
              <div>
                <label className="form-label">Initial Members (Optional)</label>
                <select className="form-select" multiple style={{ minHeight: '120px' }}>
                  <option>John Kim</option>
                  <option>Sarah Park</option>
                  <option>Mike Lee</option>
                  <option>Emily Jung</option>
                  <option>David Choi</option>
                </select>
                <small className="text-[var(--text-muted)] text-xs mt-1 block">Ctrl/Cmd + Click to select multiple</small>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-primary)]">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
