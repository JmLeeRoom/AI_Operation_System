import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  FileKey,
  Activity,
  TrendingUp,
  TrendingDown,
  UserPlus,
  FilePlus,
  Search,
  Trash2,
  ArrowUpRight,
  Clock,
  Zap,
  Eye,
  Lock,
  CheckCircle,
  Star,
} from 'lucide-react';

const stats = [
  { 
    title: 'Total Users', 
    value: '156', 
    change: '+12 this week',
    changeType: 'positive' as const,
    icon: <Users className="w-6 h-6" />,
    iconColor: 'bg-brand-500/15 text-brand-400'
  },
  { 
    title: 'Active Roles', 
    value: '24', 
    change: '+3 this month',
    changeType: 'positive' as const,
    icon: <Shield className="w-6 h-6" />,
    iconColor: 'bg-accent-blue/15 text-accent-blue'
  },
  { 
    title: 'Policies', 
    value: '89', 
    change: '+7 this week',
    changeType: 'positive' as const,
    icon: <FileKey className="w-6 h-6" />,
    iconColor: 'bg-accent-violet/15 text-accent-violet'
  },
  { 
    title: 'Access Requests', 
    value: '2.4K', 
    change: '-5% vs yesterday',
    changeType: 'negative' as const,
    icon: <Activity className="w-6 h-6" />,
    iconColor: 'bg-accent-amber/15 text-accent-amber'
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'User created',
    target: 'kim.cs@company.com',
    user: 'Admin',
    time: '5 min ago',
    type: 'create',
    icon: UserPlus,
  },
  {
    id: 2,
    action: 'Role modified',
    target: 'DataAnalyst',
    user: 'John Lee',
    time: '23 min ago',
    type: 'update',
    icon: Shield,
  },
  {
    id: 3,
    action: 'Policy evaluated',
    target: 'S3-ReadOnly',
    user: 'OPA Engine',
    time: '1 hour ago',
    type: 'auth',
    icon: Lock,
  },
  {
    id: 4,
    action: 'User deleted',
    target: 'test_user',
    user: 'System',
    time: '2 hours ago',
    type: 'delete',
    icon: Trash2,
  },
  {
    id: 5,
    action: 'Policy created',
    target: 'MinIO-Admin',
    user: 'Sarah Park',
    time: '3 hours ago',
    type: 'create',
    icon: FilePlus,
  },
];

const topRoles = [
  { name: 'Admin', users: 12, permissions: 45, color: 'rose' },
  { name: 'DataAnalyst', users: 34, permissions: 28, color: 'brand' },
  { name: 'Developer', users: 67, permissions: 32, color: 'blue' },
  { name: 'Viewer', users: 43, permissions: 8, color: 'amber' },
];

const systemStatus = [
  { name: 'OPA Policy Engine', status: 'healthy', uptime: '99.9%' },
  { name: 'Keycloak IdP', status: 'healthy', uptime: '99.8%' },
  { name: 'MinIO Integration', status: 'healthy', uptime: '100%' },
  { name: 'Policy Sync', status: 'syncing', uptime: '98.5%' },
  { name: 'Database', status: 'healthy', uptime: '99.99%' },
];

const quickAccess = [
  { name: 'Users', path: '/users', icon: Users, count: 156, starred: true },
  { name: 'Roles', path: '/roles', icon: Shield, count: 24, starred: true },
  { name: 'Policies', path: '/policies', icon: FileKey, count: 89, starred: false },
  { name: 'Audit Logs', path: '/audit-logs', icon: Search, count: null, starred: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card relative overflow-hidden bg-gradient-to-r from-brand-600/20 via-violet-600/15 to-blue-600/10 border-brand-500/20">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome back, John! 👋
            </h2>
            <p className="mt-2 text-slate-400 max-w-xl">
              Your authorization system is managing 156 users across 24 roles with 89 policies.
              There have been 2.4K access requests today.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link to="/users" className="btn-primary">
                <Zap className="w-4 h-4" />
                Add User
              </Link>
              <Link to="/policies" className="btn-ghost">View Reports</Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-brand-500/20 to-violet-500/20 blur-3xl" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-500/10 to-transparent" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="stat-card hover-card animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`stat-card-icon ${stat.iconColor.split(' ')[0]} ${stat.iconColor.split(' ')[1]}`}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.title}</div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.changeType === 'positive' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Requests Chart (2 cols) */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/15">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Access Requests</h3>
                <p className="text-sm text-slate-500">Last 7 days</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs py-1.5 px-3">Daily</button>
              <button className="btn-secondary text-xs py-1.5 px-3">Weekly</button>
              <button className="btn-ghost text-xs py-1.5 px-3">Monthly</button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-around gap-3 bg-slate-800/20 rounded-xl p-4">
            {[65, 80, 45, 90, 70, 55, 85].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-brand-600/50 to-brand-400 rounded-lg relative group cursor-pointer transition-all hover:from-brand-500/60 hover:to-brand-300"
                  style={{ 
                    height: `${height}%`, 
                    animation: `barGrow 0.8s ease-out forwards`,
                    animationDelay: `${index * 80}ms`,
                    transformOrigin: 'bottom'
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 rounded text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(height * 30)} requests
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-around mt-4 text-xs text-slate-500 font-medium">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Quick Access */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white">Quick Access</h3>
            </div>
          </div>
          <div className="space-y-2">
            {quickAccess.map((item, idx) => (
              <Link 
                key={idx}
                to={item.path}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-brand-400 transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200 group-hover:text-brand-400 transition-colors">
                      {item.name}
                    </p>
                    {item.count && (
                      <p className="text-xs text-slate-500">{item.count} items</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.starred && (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  )}
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Roles */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/15">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Top Roles by Users</h3>
                <p className="text-sm text-slate-500">Most assigned roles</p>
              </div>
            </div>
            <Link to="/roles" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {topRoles.map((role, idx) => (
              <div 
                key={role.name}
                className="p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 cursor-pointer transition-all duration-200 hover:-translate-x-1 animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/50 text-slate-300 font-mono text-sm font-semibold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{role.name}</span>
                        <span className={`badge badge-${role.color === 'rose' ? 'danger' : role.color === 'brand' ? 'primary' : role.color === 'blue' ? 'secondary' : 'warning'}`}>
                          {role.color === 'rose' ? 'Critical' : 'Standard'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {role.permissions} permissions assigned
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-semibold">{role.users}</span>
                      </div>
                      <p className="text-xs text-slate-600">users</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">{role.permissions}</span>
                      </div>
                      <p className="text-xs text-slate-600">perms</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">System Status</h3>
              </div>
              <span className="badge badge-success">All Systems Go</span>
            </div>
            <div className="space-y-3">
              {systemStatus.map((system) => (
                <div 
                  key={system.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`status-dot ${system.status === 'healthy' ? 'active' : 'pending'}`} />
                    <span className="text-sm text-slate-300">{system.name}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{system.uptime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">Recent Activity</h3>
              </div>
              <Link to="/audit-logs" className="text-xs text-brand-400 hover:text-brand-300">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.slice(0, 4).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${
                    activity.type === 'create' ? 'bg-emerald-500/15 text-emerald-400' :
                    activity.type === 'update' ? 'bg-blue-500/15 text-blue-400' :
                    activity.type === 'delete' ? 'bg-rose-500/15 text-rose-400' :
                    'bg-violet-500/15 text-violet-400'
                  }`}>
                    <activity.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-medium">{activity.action}</span>
                      {' '}
                      <span className="text-brand-400">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activity.user} · {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
