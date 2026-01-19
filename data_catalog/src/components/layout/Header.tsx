import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  HelpCircle,
  Command,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ title = "Dashboard", subtitle }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* 왼쪽: 타이틀 */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* 중앙: 검색바 */}
        <div className="flex-1 max-w-2xl mx-8">
          <div 
            className="relative group cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-brand-400 transition-colors" />
            <div className="w-full pl-12 pr-24 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-500 hover:border-slate-600 transition-all duration-200">
              Search tables, columns, or tags...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="px-2 py-1 text-xs font-mono text-slate-500 bg-slate-700/50 rounded border border-slate-600">
                <Command className="inline w-3 h-3" />
              </kbd>
              <kbd className="px-2 py-1 text-xs font-mono text-slate-500 bg-slate-700/50 rounded border border-slate-600">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* 오른쪽: 액션들 */}
        <div className="flex items-center gap-2">
          {/* AI 어시스턴트 버튼 */}
          <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-lg text-violet-400 hover:from-violet-500/30 hover:to-purple-500/30 transition-all duration-200">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Ask</span>
          </button>

          {/* 도움말 */}
          <button className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* 알림 */}
          <button className="relative p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* 환경 선택 */}
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <span className="text-sm">Production</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
