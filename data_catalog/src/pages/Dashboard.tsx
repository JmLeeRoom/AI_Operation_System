import { 
  Database, 
  Table2, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Star,
  Eye,
  Activity,
  Zap
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card, StatCard, DataCard } from '../components/common/Card';
import { Badge, PlatformBadge, QualityBadge } from '../components/common/Badge';

// 더미 데이터
const stats = [
  { 
    title: 'Total Catalogs', 
    value: '24', 
    change: '+3 this month',
    changeType: 'positive' as const,
    icon: <Database className="w-6 h-6" />,
    iconColor: 'bg-brand-500/20 text-brand-400'
  },
  { 
    title: 'Total Tables', 
    value: '1,284', 
    change: '+127 this week',
    changeType: 'positive' as const,
    icon: <Table2 className="w-6 h-6" />,
    iconColor: 'bg-emerald-500/20 text-emerald-400'
  },
  { 
    title: 'Data Owners', 
    value: '48', 
    change: '12 teams',
    changeType: 'neutral' as const,
    icon: <Users className="w-6 h-6" />,
    iconColor: 'bg-violet-500/20 text-violet-400'
  },
  { 
    title: 'Queries Today', 
    value: '8.4K', 
    change: '+12% vs yesterday',
    changeType: 'positive' as const,
    icon: <TrendingUp className="w-6 h-6" />,
    iconColor: 'bg-amber-500/20 text-amber-400'
  },
];

const trendingTables = [
  {
    id: 1,
    name: 'users',
    catalog: 'analytics_prod',
    platform: 'snowflake',
    views: '2.4K',
    queries: '1.2K',
    quality: 95,
    owner: 'Data Platform',
    tags: ['PII', 'Core'],
  },
  {
    id: 2,
    name: 'orders',
    catalog: 'commerce_dw',
    platform: 'bigquery',
    views: '1.8K',
    queries: '956',
    quality: 88,
    owner: 'Commerce Team',
    tags: ['Revenue', 'Core'],
  },
  {
    id: 3,
    name: 'events',
    catalog: 'analytics_prod',
    platform: 'snowflake',
    views: '1.5K',
    queries: '823',
    quality: 92,
    owner: 'Data Platform',
    tags: ['Tracking', 'Event'],
  },
  {
    id: 4,
    name: 'products',
    catalog: 'commerce_dw',
    platform: 'postgresql',
    views: '1.2K',
    queries: '654',
    quality: 78,
    owner: 'Product Team',
    tags: ['Catalog', 'Core'],
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'Table created',
    target: 'user_sessions',
    user: 'Alice Kim',
    time: '2 min ago',
    type: 'create',
  },
  {
    id: 2,
    action: 'Tags updated',
    target: 'orders',
    user: 'Bob Park',
    time: '15 min ago',
    type: 'update',
  },
  {
    id: 3,
    action: 'Schema changed',
    target: 'products',
    user: 'Charlie Lee',
    time: '1 hour ago',
    type: 'schema',
  },
  {
    id: 4,
    action: 'Owner assigned',
    target: 'analytics_events',
    user: 'Diana Choi',
    time: '2 hours ago',
    type: 'owner',
  },
  {
    id: 5,
    action: 'Quality score updated',
    target: 'users',
    user: 'System',
    time: '3 hours ago',
    type: 'quality',
  },
];

const quickAccess = [
  { name: 'users', catalog: 'analytics_prod', starred: true },
  { name: 'orders', catalog: 'commerce_dw', starred: true },
  { name: 'events', catalog: 'analytics_prod', starred: false },
  { name: 'customers', catalog: 'crm_db', starred: true },
];

const Dashboard = () => {
  return (
    <Layout title="Dashboard" subtitle="Overview of your data assets">
      <div className="space-y-6 animate-fade-in">
        {/* 환영 배너 */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-brand-600/20 via-violet-600/20 to-purple-600/20 border-brand-500/30">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, JaeMyeong! 👋
              </h2>
              <p className="mt-2 text-slate-400 max-w-xl">
                Your data catalog contains 1,284 tables across 24 catalogs. 
                There are 15 new tables added this week.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button className="btn-primary flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Explore Data
                </button>
                <button className="btn-ghost">View Reports</button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-brand-500/30 to-violet-500/30 blur-3xl" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-500/10 to-transparent" />
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className={`animate-slide-up delay-${(idx + 1) * 100}`}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* 메인 컨텐츠 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 트렌딩 테이블 */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Trending Tables</h3>
                    <p className="text-sm text-slate-500">Most viewed this week</p>
                  </div>
                </div>
                <button className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  View all <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {trendingTables.map((table, idx) => (
                  <div 
                    key={table.id}
                    className={`p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 cursor-pointer transition-all duration-200 hover:-translate-x-1 animate-slide-up delay-${(idx + 1) * 100}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 text-slate-400 font-mono text-sm">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{table.name}</span>
                            <PlatformBadge platform={table.platform} />
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {table.catalog} · {table.owner}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{table.views}</span>
                          </div>
                          <p className="text-xs text-slate-600">views</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-sm">{table.queries}</span>
                          </div>
                          <p className="text-xs text-slate-600">queries</p>
                        </div>
                        <QualityBadge score={table.quality} />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {table.tags.map((tag) => (
                        <Badge key={tag} variant="cyan">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 사이드 패널 */}
          <div className="space-y-6">
            {/* 빠른 접근 */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Quick Access</h3>
                </div>
              </div>
              <div className="space-y-2">
                {quickAccess.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Table2 className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-brand-400 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.catalog}</p>
                      </div>
                    </div>
                    {item.starred && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* 최근 활동 */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <h3 className="font-semibold text-white">Recent Activity</h3>
                </div>
                <button className="text-xs text-brand-400 hover:text-brand-300">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 cursor-pointer transition-colors"
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      activity.type === 'create' ? 'bg-emerald-400' :
                      activity.type === 'update' ? 'bg-brand-400' :
                      activity.type === 'schema' ? 'bg-amber-400' :
                      activity.type === 'owner' ? 'bg-violet-400' :
                      'bg-slate-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300">
                        <span className="font-medium">{activity.action}</span>
                        {' on '}
                        <span className="text-brand-400">{activity.target}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activity.user} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
