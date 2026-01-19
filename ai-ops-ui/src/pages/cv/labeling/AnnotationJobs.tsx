import { 
  Tag,
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  ExternalLink,
  BarChart3,
  Users
} from 'lucide-react';

export function AnnotationJobs() {
  const jobs = [
    {
      id: 'job-001',
      name: 'Street Scene Batch 42',
      dataset: 'Street Scene Detection',
      type: 'Detection',
      status: 'in_progress',
      progress: 78,
      totalImages: 500,
      completedImages: 390,
      assignee: 'Labeler Team A',
      reviewer: 'JaeMyeong',
      dueDate: '2024-03-20',
      priority: 'high',
      cvat_link: 'https://cvat.internal/project/42'
    },
    {
      id: 'job-002',
      name: 'Factory Defect Review',
      dataset: 'Factory Defect Segmentation',
      type: 'Segmentation',
      status: 'review',
      progress: 100,
      totalImages: 250,
      completedImages: 250,
      assignee: 'Labeler Team B',
      reviewer: 'QA Team',
      dueDate: '2024-03-18',
      priority: 'medium',
      cvat_link: 'https://cvat.internal/project/43'
    },
    {
      id: 'job-003',
      name: 'Pose Keypoints - Sports',
      dataset: 'Pose Estimation Dataset',
      type: 'Pose',
      status: 'pending',
      progress: 0,
      totalImages: 800,
      completedImages: 0,
      assignee: 'Unassigned',
      reviewer: 'MLTeam',
      dueDate: '2024-03-25',
      priority: 'low',
      cvat_link: null
    },
    {
      id: 'job-004',
      name: 'OCR Document Batch 5',
      dataset: 'OCR Document Dataset',
      type: 'OCR',
      status: 'completed',
      progress: 100,
      totalImages: 300,
      completedImages: 300,
      assignee: 'Labeler Team C',
      reviewer: 'JaeMyeong',
      dueDate: '2024-03-15',
      priority: 'medium',
      cvat_link: 'https://cvat.internal/project/41'
    },
    {
      id: 'job-005',
      name: 'Active Learning Samples',
      dataset: 'Street Scene Detection',
      type: 'Detection',
      status: 'in_progress',
      progress: 45,
      totalImages: 150,
      completedImages: 68,
      assignee: 'Expert Labeler',
      reviewer: 'JaeMyeong',
      dueDate: '2024-03-22',
      priority: 'high',
      cvat_link: 'https://cvat.internal/project/44'
    },
  ];

  const stats = [
    { label: 'Total Jobs', value: '12', icon: Tag, color: 'cyan' },
    { label: 'In Progress', value: '4', icon: Play, color: 'amber' },
    { label: 'Pending Review', value: '2', icon: AlertCircle, color: 'violet' },
    { label: 'Completed', value: '6', icon: CheckCircle, color: 'emerald' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { badge: string; label: string }> = {
      'pending': { badge: 'badge-slate', label: 'Pending' },
      'in_progress': { badge: 'badge-amber', label: 'In Progress' },
      'review': { badge: 'badge-violet', label: 'In Review' },
      'completed': { badge: 'badge-emerald', label: 'Completed' },
    };
    return styles[status] || styles['pending'];
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      'high': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      'medium': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'low': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return styles[priority] || styles['low'];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Annotation Jobs</h1>
          <p className="text-slate-400 mt-1">라벨링 작업 관리 및 CVAT 연동</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <ExternalLink className="w-4 h-4" />
            Open CVAT
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Create Job
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="input-field pl-10"
          />
        </div>
        <select className="input-field w-40">
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>In Review</option>
          <option>Completed</option>
        </select>
        <select className="input-field w-40">
          <option>All Types</option>
          <option>Detection</option>
          <option>Segmentation</option>
          <option>Pose</option>
          <option>OCR</option>
        </select>
        <button className="btn-ghost">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Job 테이블 */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Name</th>
              <th>Dataset</th>
              <th>Type</th>
              <th>Progress</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="cursor-pointer">
                <td>
                  <div>
                    <p className="font-medium text-slate-200">{job.name}</p>
                    <p className="text-xs text-slate-500">{job.id}</p>
                  </div>
                </td>
                <td className="text-slate-300">{job.dataset}</td>
                <td>
                  <span className="badge badge-cyan">{job.type}</span>
                </td>
                <td>
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          job.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400 w-16">
                      {job.completedImages}/{job.totalImages}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{job.assignee}</span>
                  </div>
                </td>
                <td>
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {job.dueDate}
                  </span>
                </td>
                <td>
                  <span className={`badge border ${getPriorityBadge(job.priority)} capitalize`}>
                    {job.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(job.status).badge}`}>
                    {getStatusBadge(job.status).label}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {job.cvat_link && (
                      <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
