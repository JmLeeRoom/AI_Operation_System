import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* 배경 효과 */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 콘텐츠 - 사이드바 너비(256px) 만큼 왼쪽 여백 */}
      <main style={{ marginLeft: '256px', padding: '24px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
