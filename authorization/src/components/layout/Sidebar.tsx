import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  Shield,
  FileKey,
  ScrollText,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: typeof LayoutDashboard;
  label: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navItems: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    title: 'Identity',
    items: [
      { path: '/users', icon: Users, label: 'Users', badge: 156 },
      { path: '/groups', icon: UserCog, label: 'Groups' },
      { path: '/departments', icon: Building2, label: 'Departments' },
    ],
  },
  {
    title: 'Access Control',
    items: [
      { path: '/roles', icon: Shield, label: 'Roles' },
      { path: '/policies', icon: FileKey, label: 'Policies' },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { path: '/audit-logs', icon: ScrollText, label: 'Audit Logs' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-900/50 border-r border-slate-800/80 flex flex-col fixed left-0 top-0 z-50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-blue flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Lock className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-lg tracking-tight">AuthZ Platform</h1>
            <span className="text-xs text-slate-500">Authorization System</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {navItems.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-400 border-l-2 border-brand-500 -ml-0.5 pl-[10px]'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade Banner */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/10 via-violet-500/10 to-blue-500/10 border border-brand-500/20">
          <div className="flex items-center gap-2 text-brand-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Pro Features</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Unlock advanced RBAC, SSO integration, and more.
          </p>
          <button className="w-full py-2 text-sm font-medium text-slate-950 bg-gradient-to-r from-brand-500 to-brand-400 rounded-lg hover:shadow-lg hover:shadow-brand-500/20 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Footer - User Profile */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-blue flex items-center justify-center text-sm font-bold text-slate-950">
            JL
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-200 truncate">John Lee</div>
            <div className="text-xs text-slate-500">System Admin</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
