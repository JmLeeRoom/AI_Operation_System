import { useState } from 'react';
import { Plus, Upload, Edit2, Trash2, X, ChevronLeft, ChevronRight, Filter, RotateCcw, MoreVertical } from 'lucide-react';

const users = [
  { id: 'usr_001', name: 'John Kim', email: 'kim.cs@company.com', department: 'Engineering', roles: ['Admin', 'Developer'], status: 'active', lastLogin: '2026-01-17 14:32' },
  { id: 'usr_002', name: 'Sarah Park', email: 'park.yh@company.com', department: 'Data Team', roles: ['DataAnalyst'], status: 'active', lastLogin: '2026-01-17 11:05' },
  { id: 'usr_003', name: 'Mike Lee', email: 'lee.ms@company.com', department: 'Security', roles: ['Admin', 'SecurityAuditor'], status: 'active', lastLogin: '2026-01-16 18:45' },
  { id: 'usr_004', name: 'Emily Jung', email: 'jung.hn@company.com', department: 'Infrastructure', roles: ['Viewer'], status: 'pending', lastLogin: '-' },
  { id: 'usr_005', name: 'David Choi', email: 'choi.sy@company.com', department: 'Engineering', roles: ['Developer'], status: 'inactive', lastLogin: '2026-01-10 09:12' },
  { id: 'usr_006', name: 'Amy Wang', email: 'wang.am@company.com', department: 'Data Team', roles: ['DataAnalyst', 'Viewer'], status: 'active', lastLogin: '2026-01-17 09:30' },
  { id: 'usr_007', name: 'Tom Chen', email: 'chen.tm@company.com', department: 'Engineering', roles: ['Developer'], status: 'active', lastLogin: '2026-01-17 13:15' },
];

const getRoleClass = (role: string) => {
  if (role === 'Admin') return 'role-tag admin';
  return 'role-tag';
};

export default function Users() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">156</span> users total
          </span>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="flex items-center gap-2 text-brand-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <div className="w-px h-6 bg-slate-700" />
        <div className="flex items-center gap-2">
          <label className="filter-label">Status:</label>
          <select className="form-select w-32 py-2 text-sm">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="filter-label">Department:</label>
          <select className="form-select w-44 py-2 text-sm">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Data Team</option>
            <option>Security</option>
            <option>Infrastructure</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="filter-label">Role:</label>
          <select className="form-select w-36 py-2 text-sm">
            <option>All Roles</option>
            <option>Admin</option>
            <option>DataAnalyst</option>
            <option>Developer</option>
            <option>Viewer</option>
          </select>
        </div>
        <button className="btn-ghost ml-auto text-sm py-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>
                  <input type="checkbox" />
                </th>
                <th style={{ minWidth: 300 }}>User</th>
                <th style={{ minWidth: 150 }}>Department</th>
                <th style={{ minWidth: 220 }}>Roles</th>
                <th style={{ minWidth: 130 }}>Status</th>
                <th style={{ minWidth: 170 }}>Last Login</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr 
                  key={user.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="user-avatar">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-slate-300">{user.department}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.map((role, index) => (
                        <span key={index} className={getRoleClass(role)}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${user.status}`}></span>
                      <span className="text-sm capitalize text-slate-300">
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-slate-500 font-mono text-sm">{user.lastLogin}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="action-btn edit" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="action-btn delete" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="action-btn" title="More">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/30">
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-300">1-7</span> of <span className="font-semibold text-slate-300">156</span> users
          </div>
          <div className="pagination">
            <button className="pagination-btn" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="px-2 text-slate-600">...</span>
            <button className="pagination-btn">23</button>
            <button className="pagination-btn">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div 
            className="glass-card w-full max-w-lg m-4 animate-slide-up shadow-2xl !border-slate-700/80" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-100">Add New User</h3>
              <button onClick={() => setShowModal(false)} className="action-btn">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">User ID *</label>
                  <input type="text" className="form-input" placeholder="e.g., john_doe" />
                </div>
                <div>
                  <label className="form-label">Display Name *</label>
                  <input type="text" className="form-input" placeholder="e.g., John Doe" />
                </div>
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" placeholder="user@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Department</label>
                  <select className="form-select">
                    <option value="">Select Department</option>
                    <option>Engineering</option>
                    <option>Data Team</option>
                    <option>Security</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Initial Role</label>
                  <select className="form-select">
                    <option value="">Select Role</option>
                    <option>Admin</option>
                    <option>Developer</option>
                    <option>DataAnalyst</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-slate-400">Send welcome email with login instructions</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-800">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
