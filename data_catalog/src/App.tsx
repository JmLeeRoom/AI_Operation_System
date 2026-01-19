import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Dashboard,
  Catalogs,
  Tables,
  TableDetail,
  Search,
  Trending,
  Lineage,
  Tags,
  Owners,
  Glossary,
  Settings
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogs" element={<Catalogs />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tables/:tableId" element={<TableDetail />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/lineage" element={<Lineage />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/owners" element={<Owners />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
