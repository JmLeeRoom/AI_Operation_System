import { useState } from 'react';
import { 
  Table2, 
  ArrowLeft,
  Edit2,
  Star,
  ExternalLink,
  Copy,
  MoreHorizontal,
  GitBranch,
  Clock,
  Eye,
  Activity,
  Shield,
  Tag,
  Users,
  FileText,
  ChevronRight,
  Database,
  Columns,
  History,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge, QualityBadge, TagList } from '../components/common/Badge';
import { SimpleTableRow } from '../components/common/Table';

// 더미 데이터
const tableData = {
  name: 'users',
  catalog: 'analytics_prod',
  database: 'ANALYTICS',
  schema: 'PUBLIC',
  platform: 'snowflake',
  description: 'Core user table containing all registered user information including profile data, preferences, and account status. This is the primary source of truth for user-related data across the organization.',
  qualityScore: 95,
  lastUpdated: '2024-01-15 14:30:22 UTC',
  rowCount: '12.4M',
  sizeBytes: '2.1 GB',
  tags: ['PII', 'Core', 'Production', 'GDPR'],
  owners: [
    { name: 'Data Platform Team', type: 'team', avatar: 'DP' },
    { name: 'Alice Kim', type: 'user', avatar: 'AK' },
  ],
  stats: {
    views: '2.4K',
    queries: '1.2K',
    downstream: 45,
    upstream: 3,
  },
};

const columns = [
  { name: 'user_id', type: 'VARCHAR(36)', nullable: false, pk: true, description: 'Unique identifier for the user (UUID)', tags: ['PII'], sample: 'a1b2c3d4-e5f6...' },
  { name: 'email', type: 'VARCHAR(255)', nullable: false, pk: false, description: 'User email address', tags: ['PII', 'Contact'], sample: 'user@example.com' },
  { name: 'name', type: 'VARCHAR(100)', nullable: true, pk: false, description: 'Full name of the user', tags: ['PII'], sample: 'John Doe' },
  { name: 'created_at', type: 'TIMESTAMP_NTZ', nullable: false, pk: false, description: 'Timestamp when user account was created', tags: [], sample: '2024-01-01 00:00:00' },
  { name: 'updated_at', type: 'TIMESTAMP_NTZ', nullable: false, pk: false, description: 'Timestamp of last profile update', tags: [], sample: '2024-01-15 12:30:00' },
  { name: 'status', type: 'VARCHAR(20)', nullable: false, pk: false, description: 'Account status: active, suspended, deleted', tags: [], sample: 'active' },
  { name: 'tier', type: 'VARCHAR(20)', nullable: true, pk: false, description: 'Subscription tier: free, pro, enterprise', tags: ['Business'], sample: 'pro' },
  { name: 'country_code', type: 'VARCHAR(2)', nullable: true, pk: false, description: 'ISO 3166-1 alpha-2 country code', tags: ['Geo'], sample: 'US' },
  { name: 'preferences', type: 'VARIANT', nullable: true, pk: false, description: 'JSON object containing user preferences', tags: [], sample: '{"theme": "dark"}' },
  { name: 'last_login_at', type: 'TIMESTAMP_NTZ', nullable: true, pk: false, description: 'Timestamp of last successful login', tags: [], sample: '2024-01-15 10:00:00' },
];

const lineageData = {
  upstream: [
    { name: 'raw_users', type: 'table', platform: 'snowflake' },
    { name: 'user_events', type: 'table', platform: 'snowflake' },
    { name: 'crm_contacts', type: 'table', platform: 'postgresql' },
  ],
  downstream: [
    { name: 'user_metrics', type: 'table', platform: 'snowflake' },
    { name: 'daily_active_users', type: 'table', platform: 'snowflake' },
    { name: 'user_segments', type: 'table', platform: 'bigquery' },
    { name: 'revenue_report', type: 'dashboard', platform: 'looker' },
  ],
};

const recentQueries = [
  { query: 'SELECT COUNT(*) FROM users WHERE status = \'active\'', user: 'alice@company.com', time: '5 min ago' },
  { query: 'SELECT tier, COUNT(*) FROM users GROUP BY tier', user: 'bob@company.com', time: '15 min ago' },
  { query: 'SELECT * FROM users WHERE created_at > CURRENT_DATE - 7', user: 'charlie@company.com', time: '1 hour ago' },
];

const tabs = [
  { id: 'columns', label: 'Columns', icon: Columns, count: columns.length },
  { id: 'lineage', label: 'Lineage', icon: GitBranch },
  { id: 'queries', label: 'Queries', icon: History },
  { id: 'documentation', label: 'Documentation', icon: BookOpen },
  { id: 'discussion', label: 'Discussion', icon: MessageSquare, count: 3 },
];

const TableDetail = () => {
  const [activeTab, setActiveTab] = useState('columns');
  const [isStarred, setIsStarred] = useState(false);

  return (
    <Layout title="Table Details" subtitle={`${tableData.catalog} / ${tableData.database} / ${tableData.name}`}>
      <div className="space-y-6 animate-fade-in">
        {/* 브레드크럼 & 액션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{tableData.catalog}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{tableData.database}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{tableData.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsStarred(!isStarred)}
              className={`p-2 rounded-lg transition-colors ${
                isStarred 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-amber-400' : ''}`} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
              <ExternalLink className="w-5 h-5" />
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메인 정보 카드 */}
        <Card className="relative overflow-hidden">
          <div className="flex items-start gap-6">
            {/* 아이콘 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-brand-500/30">
              <Table2 className="w-10 h-10 text-brand-400" />
            </div>
            
            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{tableData.name}</h1>
                <PlatformBadge platform={tableData.platform} />
                <QualityBadge score={tableData.qualityScore} />
              </div>
              
              <p className="text-slate-400 mb-4 max-w-3xl">
                {tableData.description}
              </p>

              {/* 태그 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <TagList tags={tableData.tags} variant="cyan" max={4} />
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <div className="flex -space-x-2">
                    {tableData.owners.map((owner, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs text-white font-medium border-2 border-slate-900"
                        title={owner.name}
                      >
                        {owner.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <Eye className="w-4 h-4" />
                </div>
                <p className="text-lg font-semibold text-white">{tableData.stats.views}</p>
                <p className="text-xs text-slate-500">Views</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-lg font-semibold text-white">{tableData.stats.queries}</p>
                <p className="text-xs text-slate-500">Queries</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                  <GitBranch className="w-4 h-4" />
                </div>
                <p className="text-lg font-semibold text-white">{tableData.stats.downstream}</p>
                <p className="text-xs text-slate-500">Downstream</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  <GitBranch className="w-4 h-4 rotate-180" />
                </div>
                <p className="text-lg font-semibold text-white">{tableData.stats.upstream}</p>
                <p className="text-xs text-slate-500">Upstream</p>
              </div>
            </div>
          </div>

          {/* 데코레이션 */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-brand-500/10 to-transparent blur-3xl" />
        </Card>

        {/* 메타정보 & 탭 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 메타정보 */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Metadata
              </h3>
              <div className="space-y-0">
                <SimpleTableRow label="Catalog" value={tableData.catalog} />
                <SimpleTableRow label="Database" value={tableData.database} />
                <SimpleTableRow label="Schema" value={tableData.schema} />
                <SimpleTableRow label="Rows" value={tableData.rowCount} />
                <SimpleTableRow label="Size" value={tableData.sizeBytes} />
                <SimpleTableRow label="Updated" value="2 hours ago" />
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                Data Quality
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Overall Score</span>
                  <span className="text-sm font-semibold text-emerald-400">{tableData.qualityScore}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    style={{ width: `${tableData.qualityScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-sm font-medium text-white">100%</p>
                    <p className="text-xs text-slate-500">Completeness</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-sm font-medium text-white">98%</p>
                    <p className="text-xs text-slate-500">Freshness</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-sm font-medium text-white">95%</p>
                    <p className="text-xs text-slate-500">Accuracy</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-sm font-medium text-white">92%</p>
                    <p className="text-xs text-slate-500">Uniqueness</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-1 mb-4 p-1 bg-slate-800/30 rounded-xl border border-slate-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count && (
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      activeTab === tab.id
                        ? 'bg-slate-600 text-slate-200'
                        : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 탭 컨텐츠 */}
            {activeTab === 'columns' && (
              <Card className="!p-0 overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '200px' }}>Column Name</th>
                      <th style={{ width: '150px' }}>Type</th>
                      <th style={{ width: '80px' }}>Nullable</th>
                      <th>Description</th>
                      <th style={{ width: '120px' }}>Tags</th>
                      <th style={{ width: '150px' }}>Sample</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((col, idx) => (
                      <tr key={idx} className="group">
                        <td>
                          <div className="flex items-center gap-2">
                            {col.pk && (
                              <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded">
                                PK
                              </span>
                            )}
                            <span className="font-mono text-brand-400">{col.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="font-mono text-xs text-slate-400">{col.type}</span>
                        </td>
                        <td>
                          <span className={`text-xs ${col.nullable ? 'text-slate-500' : 'text-rose-400'}`}>
                            {col.nullable ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="text-slate-400">{col.description}</td>
                        <td>
                          <div className="flex gap-1">
                            {col.tags.map((tag) => (
                              <Badge key={tag} variant="violet">{tag}</Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-500 truncate max-w-[100px]">
                              {col.sample}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-all">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {activeTab === 'lineage' && (
              <Card>
                <div className="space-y-6">
                  {/* 라인리지 시각화 (간단한 버전) */}
                  <div className="flex items-center justify-center gap-4 py-8">
                    {/* 업스트림 */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase text-center mb-3">Upstream</p>
                      {lineageData.upstream.map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 cursor-pointer transition-colors"
                        >
                          <Database className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.platform}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 화살표 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-brand-500" />
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>

                    {/* 현재 테이블 */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border-2 border-brand-500/50">
                      <div className="flex items-center gap-3">
                        <Table2 className="w-6 h-6 text-brand-400" />
                        <div>
                          <p className="font-semibold text-white">{tableData.name}</p>
                          <p className="text-xs text-slate-400">{tableData.catalog}</p>
                        </div>
                      </div>
                    </div>

                    {/* 화살표 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-brand-500 to-emerald-500" />
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>

                    {/* 다운스트림 */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase text-center mb-3">Downstream</p>
                      {lineageData.downstream.slice(0, 3).map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-colors"
                        >
                          <Database className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.platform}</p>
                          </div>
                        </div>
                      ))}
                      {lineageData.downstream.length > 3 && (
                        <button className="w-full p-2 text-sm text-brand-400 hover:bg-slate-800/50 rounded-lg transition-colors">
                          +{lineageData.downstream.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 라인리지 통계 */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-700/50">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">{lineageData.upstream.length}</p>
                      <p className="text-sm text-slate-500">Upstream Sources</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{lineageData.downstream.length}</p>
                      <p className="text-sm text-slate-500">Downstream Dependencies</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-400">2</p>
                      <p className="text-sm text-slate-500">Pipelines</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-400">3</p>
                      <p className="text-sm text-slate-500">Dashboards</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'queries' && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Recent Queries</h3>
                  <button className="text-sm text-brand-400 hover:text-brand-300">View All</button>
                </div>
                <div className="space-y-3">
                  {recentQueries.map((query, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs text-white">
                            {query.user.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-400">{query.user}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{query.time}</span>
                          <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-all">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                        {query.query}
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'documentation' && (
              <Card>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
                  <div className="space-y-4 text-slate-400">
                    <p>
                      The <code className="text-brand-400">users</code> table is the primary source of truth for all user-related data in our system. It contains information about registered users including their profile data, preferences, and account status.
                    </p>
                    <h4 className="text-white font-medium">Usage Guidelines</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Always filter by <code className="text-brand-400">status = 'active'</code> for production queries</li>
                      <li>Use <code className="text-brand-400">user_id</code> for joining with other tables</li>
                      <li>The <code className="text-brand-400">preferences</code> column contains JSON data</li>
                    </ul>
                    <h4 className="text-white font-medium">Data Retention</h4>
                    <p>
                      User data is retained for 7 years after account deletion for compliance purposes. Soft-deleted records have <code className="text-brand-400">status = 'deleted'</code>.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'discussion' && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Discussions</h3>
                  <button className="btn-secondary text-sm">New Discussion</button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Should we add an index on email column?', author: 'Alice Kim', replies: 5, time: '2 days ago' },
                    { title: 'Question about preferences JSON schema', author: 'Bob Park', replies: 3, time: '1 week ago' },
                    { title: 'Data quality issue with country_code', author: 'Charlie Lee', replies: 8, time: '2 weeks ago' },
                  ].map((discussion, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-white hover:text-brand-400 transition-colors">
                            {discussion.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            Started by {discussion.author} · {discussion.time}
                          </p>
                        </div>
                        <Badge variant="slate">{discussion.replies} replies</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TableDetail;
