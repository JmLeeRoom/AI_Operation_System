import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Table2, 
  Search, 
  TrendingUp, 
  Settings, 
  BookOpen,
  Users,
  Tag,
  GitBranch,
  ChevronDown,
  Layers
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path?: string;
  active?: boolean;
  badge?: number;
  children?: { label: string; path?: string; active?: boolean }[];
  expanded?: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const NavItem = ({ icon, label, path, badge, children, expanded }: NavItemProps) => {
    const isActive = path ? location.pathname === path : false;
    
    return (
      <div className="space-y-1">
        <div 
          className={`nav-item ${isActive ? 'active' : ''}`}
          onClick={() => path && navigate(path)}
        >
          {icon}
          <span className="flex-1 font-medium">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-brand-500/20 text-brand-400 rounded-full">
              {badge}
            </span>
          )}
          {children && (
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          )}
        </div>
        {children && expanded && (
          <div className="ml-8 space-y-1">
            {children.map((child, idx) => (
              <div 
                key={idx}
                className={`nav-item text-sm ${child.path && location.pathname === child.path ? 'active' : ''}`}
                onClick={() => child.path && navigate(child.path)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                <span>{child.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-50">
      {/* 로고 영역 */}
      <div className="p-6 border-b border-slate-700/50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">DataCatalog</h1>
            <p className="text-xs text-slate-500">Data Discovery Platform</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main
          </p>
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            path="/dashboard"
          />
          <NavItem 
            icon={<Search className="w-5 h-5" />} 
            label="Search" 
            path="/search"
          />
          <NavItem
            icon={<TrendingUp className="w-5 h-5" />}
            label="Trending"
            path="/trending"
            badge={12}
          />
        </div>

        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Data Assets
          </p>
          <NavItem 
            icon={<Database className="w-5 h-5" />} 
            label="Catalogs" 
            path="/catalogs"
            children={[
              { label: 'All Catalogs', path: '/catalogs' },
              { label: 'Snowflake' },
              { label: 'BigQuery' },
              { label: 'PostgreSQL' },
            ]}
            expanded
          />
          <NavItem 
            icon={<Table2 className="w-5 h-5" />} 
            label="Tables" 
            path="/tables"
            badge={1284}
          />
          <NavItem
            icon={<GitBranch className="w-5 h-5" />}
            label="Lineage"
            path="/lineage"
          />
        </div>

        <div className="mb-6">
          <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Governance
          </p>
          <NavItem
            icon={<Tag className="w-5 h-5" />}
            label="Tags"
            path="/tags"
          />
          <NavItem
            icon={<Users className="w-5 h-5" />}
            label="Owners"
            path="/owners"
          />
          <NavItem
            icon={<BookOpen className="w-5 h-5" />}
            label="Glossary"
            path="/glossary"
          />
        </div>
      </nav>

      {/* 하단 영역 */}
      <div className="p-4 border-t border-slate-700/50">
        <NavItem
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          path="/settings"
        />
        
        {/* 사용자 정보 */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">JM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">JaeMyeong Lee</p>
            <p className="text-xs text-slate-500 truncate">Data Engineer</p>
          </div>
          <div className="status-dot online" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
