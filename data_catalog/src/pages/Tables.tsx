import { useState } from 'react';
import { 
  Table2, 
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Eye,
  Activity,
  Clock,
  Tag
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge, QualityBadge, TagList } from '../components/common/Badge';

// 더미 테이블 데이터
const tables = [
  {
    id: 1,
    name: 'users',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    schema: 'PUBLIC',
    platform: 'snowflake',
    description: 'Core user table containing all registered user information',
    rowCount: '12.4M',
    columns: 12,
    quality: 95,
    tags: ['PII', 'Core', 'Production'],
    owner: 'Data Platform',
    lastUpdated: '2 hours ago',
    views: '2.4K',
    queries: '1.2K',
  },
  {
    id: 2,
    name: 'orders',
    catalog: 'commerce_dw',
    database: 'commerce_core',
    schema: 'public',
    platform: 'bigquery',
    description: 'Order transactions including status and payment information',
    rowCount: '45.2M',
    columns: 28,
    quality: 88,
    tags: ['Revenue', 'Core', 'PII'],
    owner: 'Commerce Team',
    lastUpdated: '30 min ago',
    views: '1.8K',
    queries: '956',
  },
  {
    id: 3,
    name: 'events',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    schema: 'PUBLIC',
    platform: 'snowflake',
    description: 'Event tracking data from web and mobile applications',
    rowCount: '892M',
    columns: 24,
    quality: 92,
    tags: ['Events', 'Tracking'],
    owner: 'Data Engineering',
    lastUpdated: '5 min ago',
    views: '1.5K',
    queries: '823',
  },
  {
    id: 4,
    name: 'products',
    catalog: 'commerce_dw',
    database: 'commerce_core',
    schema: 'public',
    platform: 'postgresql',
    description: 'Product catalog with pricing and inventory information',
    rowCount: '156K',
    columns: 32,
    quality: 78,
    tags: ['Catalog', 'Inventory'],
    owner: 'Product Team',
    lastUpdated: '1 hour ago',
    views: '1.2K',
    queries: '654',
  },
  {
    id: 5,
    name: 'user_sessions',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    schema: 'PUBLIC',
    platform: 'snowflake',
    description: 'User session data for analytics and engagement tracking',
    rowCount: '234M',
    columns: 18,
    quality: 85,
    tags: ['Sessions', 'Analytics'],
    owner: 'Analytics Team',
    lastUpdated: '15 min ago',
    views: '987',
    queries: '432',
  },
  {
    id: 6,
    name: 'customers',
    catalog: 'crm_database',
    database: 'public',
    schema: 'crm',
    platform: 'postgresql',
    description: 'Customer profiles and contact information',
    rowCount: '2.1M',
    columns: 22,
    quality: 91,
    tags: ['CRM', 'PII', 'Core'],
    owner: 'CRM Team',
    lastUpdated: '3 hours ago',
    views: '876',
    queries: '321',
  },
  {
    id: 7,
    name: 'transactions',
    catalog: 'commerce_dw',
    database: 'commerce_core',
    schema: 'finance',
    platform: 'bigquery',
    description: 'Financial transactions and payment records',
    rowCount: '78.5M',
    columns: 35,
    quality: 94,
    tags: ['Finance', 'PII', 'Sensitive'],
    owner: 'Finance Team',
    lastUpdated: '45 min ago',
    views: '654',
    queries: '287',
  },
  {
    id: 8,
    name: 'ml_features',
    catalog: 'ml_features',
    database: 'FEATURES_V2',
    schema: 'PUBLIC',
    platform: 'snowflake',
    description: 'Machine learning feature store for model training',
    rowCount: '45.8M',
    columns: 128,
    quality: 82,
    tags: ['ML', 'Features'],
    owner: 'ML Platform',
    lastUpdated: '6 hours ago',
    views: '432',
    queries: '189',
  },
];

const catalogOptions = ['All Catalogs', 'analytics_prod', 'commerce_dw', 'crm_database', 'ml_features'];
const platformOptions = ['All Platforms', 'Snowflake', 'BigQuery', 'PostgreSQL'];

const Tables = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState('All Catalogs');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [sortBy, setSortBy] = useState('name');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCatalog = selectedCatalog === 'All Catalogs' || table.catalog === selectedCatalog;
    const matchesPlatform = selectedPlatform === 'All Platforms' || 
      table.platform.toLowerCase() === selectedPlatform.toLowerCase();
    return matchesSearch && matchesCatalog && matchesPlatform;
  });

  return (
    <Layout title="Tables" subtitle="Browse and manage all data tables">
      <div className="space-y-6 animate-fade-in">
        {/* 필터 바 */}
        <Card className="!p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 검색 */}
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables..."
                className="input-field pl-10"
              />
            </div>

            {/* 카탈로그 필터 */}
            <div className="relative">
              <select
                value={selectedCatalog}
                onChange={(e) => setSelectedCatalog(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-brand-500"
              >
                {catalogOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* 플랫폼 필터 */}
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-brand-500"
              >
                {platformOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* 액션 버튼 */}
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Table
            </button>
          </div>
        </Card>

        {/* 결과 요약 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white font-semibold">{filteredTables.length}</span> tables
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="updated">Recently Updated</option>
              <option value="popular">Most Popular</option>
              <option value="quality">Quality Score</option>
            </select>
          </div>
        </div>

        {/* 테이블 리스트 */}
        <Card className="!p-0 overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Table</th>
                <th>Location</th>
                <th>Platform</th>
                <th>Rows</th>
                <th>Quality</th>
                <th>Tags</th>
                <th>Updated</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table, idx) => (
                <>
                  <tr 
                    key={table.id}
                    className={`cursor-pointer animate-slide-up delay-${(idx % 5 + 1) * 100}`}
                    onClick={() => toggleRow(table.id)}
                  >
                    <td>
                      <button className="p-1 text-slate-500 hover:text-slate-300">
                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedRows.includes(table.id) ? 'rotate-90' : ''}`} />
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand-500/20">
                          <Table2 className="w-5 h-5 text-brand-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white hover:text-brand-400 transition-colors">
                            {table.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">
                            {table.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm text-slate-300">{table.catalog}</p>
                        <p className="text-xs text-slate-500">
                          {table.database}.{table.schema}
                        </p>
                      </div>
                    </td>
                    <td>
                      <PlatformBadge platform={table.platform} />
                    </td>
                    <td className="font-mono text-sm text-slate-400">
                      {table.rowCount}
                    </td>
                    <td>
                      <QualityBadge score={table.quality} />
                    </td>
                    <td>
                      <TagList tags={table.tags} max={2} />
                    </td>
                    <td className="text-sm text-slate-500">
                      {table.lastUpdated}
                    </td>
                    <td>
                      <button 
                        className="p-1 text-slate-500 hover:text-slate-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  {/* 확장된 상세 정보 */}
                  {expandedRows.includes(table.id) && (
                    <tr key={`${table.id}-expanded`}>
                      <td colSpan={9} className="!p-0 bg-slate-800/30">
                        <div className="p-6 grid grid-cols-4 gap-6">
                          {/* 통계 */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Statistics</h4>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500 flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                Views (7d)
                              </span>
                              <span className="text-slate-300">{table.views}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Queries (7d)
                              </span>
                              <span className="text-slate-300">{table.queries}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Columns</span>
                              <span className="text-slate-300">{table.columns}</span>
                            </div>
                          </div>

                          {/* 소유자 */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Owner</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs text-white font-medium">
                                {table.owner.charAt(0)}
                              </div>
                              <span className="text-sm text-slate-300">{table.owner}</span>
                            </div>
                          </div>

                          {/* 태그 */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {table.tags.map(tag => (
                                <Badge key={tag} variant="cyan">{tag}</Badge>
                              ))}
                            </div>
                          </div>

                          {/* 액션 */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Actions</h4>
                            <div className="flex flex-wrap gap-2">
                              <button className="btn-secondary text-sm py-1.5">
                                View Details
                              </button>
                              <button className="btn-ghost text-sm py-1.5">
                                Query Data
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </Card>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing 1-{filteredTables.length} of {filteredTables.length} tables
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-50" disabled>
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  page === 1
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tables;
