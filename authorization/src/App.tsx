import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Groups from './pages/Groups';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import Policies from './pages/Policies';
import AuditLogs from './pages/AuditLogs';

export default function App() {
  return (
    <Routes>
      {/* Login page without layout */}
      <Route path="/login" element={<Login />} />
      
      {/* Main app with layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
      </Route>
    </Routes>
  );
}
