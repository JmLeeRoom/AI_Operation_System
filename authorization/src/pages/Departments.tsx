import { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Users, X, ChevronRight } from 'lucide-react';

const departments = [
  { id: 1, name: 'Engineering', description: 'Software engineering and development team', head: 'John Kim', members: 45, groups: 3, subDepts: ['Backend', 'Frontend', 'QA'] },
  { id: 2, name: 'Data Team', description: 'Data engineering, analytics, and science', head: 'Sarah Park', members: 28, groups: 2, subDepts: ['Data Engineering', 'Analytics', 'ML/AI'] },
  { id: 3, name: 'Security', description: 'Information security and compliance', head: 'Mike Lee', members: 12, groups: 1, subDepts: ['SecOps', 'Compliance'] },
  { id: 4, name: 'Infrastructure', description: 'Platform and infrastructure operations', head: 'Emily Jung', members: 18, groups: 2, subDepts: ['DevOps', 'SRE', 'Cloud'] },
  { id: 5, name: 'Product', description: 'Product management and design', head: 'David Choi', members: 15, groups: 1, subDepts: ['Product Management', 'UX Design'] },
];

export default function Departments() {
  const [showModal, setShowModal] = useState(false);
  const [expandedDept, setExpandedDept] = useState<number | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Department Management</h1>
          <p className="text-[var(--text-muted)]">Manage organizational structure and departments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">5</div>
          <div className="text-sm text-[var(--text-muted)]">Departments</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">15</div>
          <div className="text-sm text-[var(--text-muted)]">Sub-departments</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">118</div>
          <div className="text-sm text-[var(--text-muted)]">Total Members</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">9</div>
          <div className="text-sm text-[var(--text-muted)]">Linked Groups</div>
        </div>
      </div>

      {/* Departments List */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <div key={dept.id} className="glass-card overflow-hidden">
            {/* Main Department Row */}
            <div 
              className="p-5 flex items-center gap-4 cursor-pointer hover:bg-[rgba(0,212,170,0.02)] transition-colors"
              onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
            >
              <div className="w-12 h-12 rounded-lg bg-[rgba(0,212,170,0.15)] text-[var(--accent-primary)] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-semibold text-[var(--text-primary)]">{dept.name}</span>
                  {dept.subDepts.length > 0 && (
                    <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-muted)] px-2 py-0.5 rounded">
                      {dept.subDepts.length} sub-departments
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-muted)]">{dept.description}</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-lg font-bold font-mono text-[var(--text-primary)]">{dept.members}</div>
                  <div className="text-xs text-[var(--text-muted)]">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-mono text-[var(--text-primary)]">{dept.groups}</div>
                  <div className="text-xs text-[var(--text-muted)]">Groups</div>
                </div>
                <div className="text-center min-w-[100px]">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{dept.head}</div>
                  <div className="text-xs text-[var(--text-muted)]">Head</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-danger)]"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${expandedDept === dept.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {/* Expanded Sub-departments */}
            {expandedDept === dept.id && (
              <div className="border-t border-[var(--border-primary)] bg-[rgba(0,0,0,0.2)]">
                <div className="p-4 pl-20">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    Sub-departments
                  </div>
                  <div className="space-y-2">
                    {dept.subDepts.map((subDept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-[rgba(14,165,233,0.15)] text-[var(--accent-secondary)] flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="text-[var(--text-primary)]">{subDept}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--accent-danger)]">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full p-3 rounded-lg border border-dashed border-[var(--border-secondary)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Sub-department
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md p-6 m-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Add New Department</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Department Name *</label>
                <input type="text" className="form-input" placeholder="Enter department name" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Enter department description"></textarea>
              </div>
              <div>
                <label className="form-label">Department Head</label>
                <select className="form-select">
                  <option value="">Select Head</option>
                  <option>John Kim</option>
                  <option>Sarah Park</option>
                  <option>Mike Lee</option>
                  <option>Emily Jung</option>
                  <option>David Choi</option>
                </select>
              </div>
              <div>
                <label className="form-label">Parent Department (Optional)</label>
                <select className="form-select">
                  <option value="">None (Top-level)</option>
                  <option>Engineering</option>
                  <option>Data Team</option>
                  <option>Security</option>
                  <option>Infrastructure</option>
                  <option>Product</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-primary)]">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Add Department</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
