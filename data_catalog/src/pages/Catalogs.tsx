import { useState } from 'react';
import { 
  Database, 
  Plus, 
  Filter, 
  Grid3X3, 
  List,
  Search,
  MoreVertical,
  Table2,
  Users,
  Clock,
  ChevronRight,
  Snowflake,
  Cloud,
  Server
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge } from '../components/common/Badge';

// 더미 데이터
const catalogs = [
  {
    id: 1,
    name: 'analytics_prod',
    description: 'Production analytics data warehouse for business intelligence and reporting',
    platform: 'snowflake',
    tables: 342,
    owners: ['Data Platform', 'Analytics Team'],
    lastUpdated: '2 hours ago',
    status: 'healthy',
    tags: ['Production', 'Core', 'BI'],
    databases: ['ANALYTICS', 'STAGING', 'RAW'],
  },
  {
    id: 2,
    name: 'commerce_dw',
    description: 'E-commerce data warehouse containing orders, products, and customer data',
    platform: 'bigquery',
    tables: 186,
    owners: ['Commerce Team'],
    lastUpdated: '30 min ago',
    status: 'healthy',
    tags: ['Production', 'Commerce'],
    databases: ['commerce_core', 'commerce_analytics'],
  },
  {
    id: 3,
    name: 'crm_database',
    description: 'Customer relationship management data including contacts and interactions',
    platform: 'postgresql',
    tables: 94,
    owners: ['CRM Team', 'Sales Ops'],
    lastUpdated: '1 hour ago',
    status: 'warning',
    tags: ['Production', 'CRM', 'PII'],
    databases: ['public', 'reporting'],
  },
  {
    id: 4,
    name: 'ml_features',
    description: 'Machine learning feature store for model training and inference',
    platform: 'snowflake',
    tables: 128,
    owners: ['ML Platform'],
    lastUpdated: '4 hours ago',
    status: 'healthy',
    tags: ['ML', 'Features'],
    databases: ['FEATURES_V1', 'FEATURES_V2'],
  },
  {
    id: 5,
    name: 'event_streaming',
    description: 'Real-time event data from web and mobile applications',
    platform: 'databricks',
    tables: 256,
    owners: ['Data Engineering'],
    lastUpdated: '5 min ago',
    status: 'healthy',
    tags: ['Streaming', 'Events', 'Real-time'],
    databases: ['bronze', 'silver', 'gold'],
  },
  {
    id: 6,
    name: 'legacy_reports',
    description: 'Legacy reporting database (deprecated, migration in progress)',
    platform: 'mysql',
    tables: 78,
    owners: ['IT Operations'],
    lastUpdated: '2 days ago',
    status: 'deprecated',
    tags: ['Legacy', 'Deprecated'],
    databases: ['reports_2023', 'reports_archive'],
  },
];

const platformFilters = ['All', 'Snowflake', 'BigQuery', 'PostgreSQL', 'Databricks', 'MySQL'];

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'snowflake':
      return <Snowflake className="w-8 h-8 text-cyan-400" />;
    case 'bigquery':
      return <Cloud className="w-8 h-8 text-violet-400" />;
    default:
      return <Server className="w-8 h-8 text-slate-400" />;
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'healthy':
      return { color: 'bg-emerald-400', label: 'Healthy' };
    case 'warning':
      return { color: 'bg-amber-400', label: 'Warning' };
    case 'deprecated':
      return { color: 'bg-slate-500', label: 'Deprecated' };
    default:
      return { color: 'bg-slate-400', label: status };
  }
};

const Catalogs = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesPlatform = selectedPlatform === 'All' || 
      catalog.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const matchesSearch = catalog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      catalog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <Layout title="Catalogs" subtitle="Manage and explore your data catalogs">
      <div className="space-y-6 animate-fade-in">
        {/* 헤더 액션 바 */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search catalogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* 플랫폼 필터 */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
              {platformFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedPlatform(filter)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    selectedPlatform === filter
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* 뷰 모드 토글 */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* 필터 버튼 */}
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* 새 카탈로그 버튼 */}
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Catalog
            </button>
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-500/20">
                <Database className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{catalogs.length}</p>
                <p className="text-xs text-slate-500">Total Catalogs</p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Table2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1,284</p>
                <p className="text-xs text-slate-500">Total Tables</p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-slate-500">Owner Teams</p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">15 min</p>
                <p className="text-xs text-slate-500">Last Sync</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 카탈로그 그리드/리스트 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalogs.map((catalog, idx) => {
              const status = getStatusConfig(catalog.status);
              return (
                <Card 
                  key={catalog.id} 
                  hover 
                  className={`cursor-pointer group animate-slide-up delay-${(idx % 6 + 1) * 100}`}
                >
                  <div className="space-y-4">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                          {getPlatformIcon(catalog.platform)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                            {catalog.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <PlatformBadge platform={catalog.platform} />
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${status.color}`} />
                              <span className="text-xs text-slate-500">{status.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 설명 */}
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {catalog.description}
                    </p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5">
                      {catalog.tags.map((tag) => (
                        <Badge key={tag} variant="slate">{tag}</Badge>
                      ))}
                    </div>

                    {/* 통계 */}
                    <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Table2 className="w-4 h-4" />
                          <span className="text-sm">{catalog.tables} tables</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Database className="w-4 h-4" />
                          <span className="text-sm">{catalog.databases.length} dbs</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="!p-0 overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Catalog</th>
                  <th>Platform</th>
                  <th>Tables</th>
                  <th>Owners</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCatalogs.map((catalog) => {
                  const status = getStatusConfig(catalog.status);
                  return (
                    <tr key={catalog.id} className="cursor-pointer">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-800/50">
                            {getPlatformIcon(catalog.platform)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{catalog.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-xs">
                              {catalog.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <PlatformBadge platform={catalog.platform} />
                      </td>
                      <td>{catalog.tables}</td>
                      <td>
                        <div className="flex -space-x-2">
                          {catalog.owners.slice(0, 2).map((owner, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-xs text-white font-medium border-2 border-slate-900"
                              title={owner}
                            >
                              {owner.charAt(0)}
                            </div>
                          ))}
                          {catalog.owners.length > 2 && (
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 border-2 border-slate-900">
                              +{catalog.owners.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${status.color}`} />
                          <span className="text-sm">{status.label}</span>
                        </div>
                      </td>
                      <td className="text-slate-500">{catalog.lastUpdated}</td>
                      <td>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Catalogs;
