import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, Settings, ChevronRight } from 'lucide-react';

const breadcrumbMap: Record<string, { label: string }[]> = {
  '/': [{ label: 'Dashboard' }],
  '/users': [{ label: 'Home' }, { label: 'Users' }],
  '/groups': [{ label: 'Home' }, { label: 'Groups' }],
  '/departments': [{ label: 'Home' }, { label: 'Departments' }],
  '/roles': [{ label: 'Home' }, { label: 'Roles' }],
  '/policies': [{ label: 'Home' }, { label: 'Policies' }],
  '/audit-logs': [{ label: 'Home' }, { label: 'Audit Logs' }],
};

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your authorization system' },
  '/users': { title: 'User Management', subtitle: 'Manage users registered in the system' },
  '/groups': { title: 'Group Management', subtitle: 'Organize users into groups' },
  '/departments': { title: 'Departments', subtitle: 'Manage organizational departments' },
  '/roles': { title: 'Role Management', subtitle: 'Define and manage access roles' },
  '/policies': { title: 'Policy Management', subtitle: 'Configure access control policies' },
  '/audit-logs': { title: 'Audit Logs', subtitle: 'Monitor system activities and access logs' },
};

export default function Layout() {
  const location = useLocation();
  const breadcrumbs = breadcrumbMap[location.pathname] || [{ label: 'Home' }];
  const pageInfo = pageTitles[location.pathname] || { title: 'AuthZ Platform', subtitle: '' };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="h-full flex items-center justify-between px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                  <span 
                    className={`text-sm ${
                      index === breadcrumbs.length - 1 
                        ? 'text-slate-200 font-medium' 
                        : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users, roles, policies..."
                  className="w-80 pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-800/80 transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              </button>

              {/* Settings */}
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-800/80 transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="page-title">{pageInfo.title}</h1>
          <p className="page-subtitle">{pageInfo.subtitle}</p>
        </div>

        {/* Page Content */}
        <main className="px-8 pb-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
