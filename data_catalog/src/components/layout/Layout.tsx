import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout = ({ children, title, subtitle }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* 배경 그라데이션 효과 */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 컨텐츠 */}
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
