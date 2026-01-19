import {
  TrendingUp,
  TrendingDown,
  Clock,
  Eye,
  Activity,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  Table2
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge, QualityBadge } from '../components/common/Badge';

// 더미 데이터 - 인기 테이블
const popularTables = [
  {
    id: 1,
    rank: 1,
    name: 'users',
    catalog: 'analytics_prod',
    platform: 'snowflake',
    views: '12.4K',
    queries: '8.2K',
    quality: 95,
    owner: 'Data Platform Team',
    tags: ['PII', 'Core', 'Verified'],
    trend: 'up',
    trendValue: '+23%',
  },
  {
    id: 2,
    rank: 2,
    name: 'orders',
    catalog: 'commerce_dw',
    platform: 'bigquery',
    views: '9.8K',
    queries: '6.1K',
    quality: 92,
    owner: 'Commerce Team',
    tags: ['Revenue', 'Core'],
    trend: 'up',
    trendValue: '+18%',
  },
  {
    id: 3,
    rank: 3,
    name: 'page_events',
    catalog: 'analytics_prod',
    platform: 'snowflake',
    views: '8.5K',
    queries: '5.4K',
    quality: 88,
    owner: 'Analytics Team',
    tags: ['Tracking', 'Event'],
    trend: 'down',
    trendValue: '-5%',
  },
  {
    id: 4,
    rank: 4,
    name: 'products',
    catalog: 'commerce_dw',
    platform: 'postgresql',
    views: '7.2K',
    queries: '4.8K',
    quality: 85,
    owner: 'Product Team',
    tags: ['Catalog'],
    trend: 'up',
    trendValue: '+12%',
  },
  {
    id: 5,
    rank: 5,
    name: 'customer_segments',
    catalog: 'crm_db',
    platform: 'redshift',
    views: '5.9K',
    queries: '3.2K',
    quality: 91,
    owner: 'CRM Team',
    tags: ['Segmentation', 'Marketing'],
    trend: 'up',
    trendValue: '+45%',
  },
  {
    id: 6,
    rank: 6,
    name: 'transactions',
    catalog: 'finance_dw',
    platform: 'bigquery',
    views: '4.8K',
    queries: '2.9K',
    quality: 94,
    owner: 'Finance Team',
    tags: ['Financial', 'Core'],
    trend: 'stable',
    trendValue: '0%',
  },
];

// 더미 데이터 - 최근 조회
const recentlyViewed = [
  {
    id: 1,
    name: 'daily_active_users',
    catalog: 'analytics_prod',
    platform: 'snowflake',
    viewedAt: '2 min ago',
    viewedBy: 'You',
  },
  {
    id: 2,
    name: 'order_items',
    catalog: 'commerce_dw',
    platform: 'bigquery',
    viewedAt: '15 min ago',
    viewedBy: 'You',
  },
  {
    id: 3,
    name: 'user_sessions',
    catalog: 'analytics_prod',
    platform: 'snowflake',
    viewedAt: '1 hour ago',
    viewedBy: 'You',
  },
  {
    id: 4,
    name: 'campaigns',
    catalog: 'marketing_db',
    platform: 'postgresql',
    viewedAt: '2 hours ago',
    viewedBy: 'You',
  },
  {
    id: 5,
    name: 'inventory',
    catalog: 'commerce_dw',
    platform: 'mysql',
    viewedAt: '3 hours ago',
    viewedBy: 'You',
  },
];

// 더미 데이터 - 급상승 테이블
const risingTables = [
  { name: 'ab_test_results', catalog: 'analytics_prod', increase: '+312%', reason: 'New experiment launched' },
  { name: 'holiday_sales', catalog: 'commerce_dw', increase: '+256%', reason: 'Seasonal analysis' },
  { name: 'fraud_detection', catalog: 'security_db', increase: '+189%', reason: 'Security audit' },
];

// 더미 데이터 - 시간대별 활동
const timelineData = [
  { time: '00:00', queries: 120 },
  { time: '04:00', queries: 85 },
  { time: '08:00', queries: 450 },
  { time: '12:00', queries: 680 },
  { time: '16:00', queries: 890 },
  { time: '20:00', queries: 340 },
  { time: 'Now', queries: 520 },
];

const Trending = () => {
  const maxQueries = Math.max(...timelineData.map(d => d.queries));

  return (
    <Layout title="Trending" subtitle="Discover popular and rising data assets">
      <div className="space-y-6 animate-fade-in">
        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-sm text-slate-500">Hot Tables Today</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">23</p>
                <p className="text-sm text-slate-500">Rising This Week</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-500/20">
                <Eye className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">45.2K</p>
                <p className="text-sm text-slate-500">Total Views Today</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <Activity className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">18.9K</p>
                <p className="text-sm text-slate-500">Queries Today</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 인기 테이블 */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Flame className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Most Popular Tables</h3>
                    <p className="text-sm text-slate-500">Top viewed this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost text-sm">This Week</button>
                  <button className="btn-ghost text-sm text-slate-500">This Month</button>
                </div>
              </div>

              <div className="space-y-3">
                {popularTables.map((table) => (
                  <div
                    key={table.id}
                    className="p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 cursor-pointer transition-all duration-200 hover:-translate-x-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${
                          table.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                          table.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                          table.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {table.rank}
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
                            <span className="text-sm font-medium">{table.views}</span>
                          </div>
                          <p className="text-xs text-slate-600">views</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-sm font-medium">{table.queries}</span>
                          </div>
                          <p className="text-xs text-slate-600">queries</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                          table.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                          table.trend === 'down' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {table.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> :
                           table.trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> :
                           <Activity className="w-4 h-4" />}
                          <span className="text-sm font-medium">{table.trendValue}</span>
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

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 급상승 테이블 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Rising Fast</h3>
              </div>
              <div className="space-y-3">
                {risingTables.map((table, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{table.name}</p>
                        <p className="text-xs text-slate-500">{table.catalog}</p>
                      </div>
                      <span className="text-emerald-400 font-bold">{table.increase}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{table.reason}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 최근 조회 */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <h3 className="font-semibold text-white">Recently Viewed</h3>
                </div>
              </div>
              <div className="space-y-2">
                {recentlyViewed.map((item) => (
                  <div
                    key={item.id}
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
                    <span className="text-xs text-slate-500">{item.viewedAt}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 활동 타임라인 (간단한 차트) */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-brand-400" />
                <h3 className="font-semibold text-white">Today's Activity</h3>
              </div>
              <div className="flex items-end justify-between h-24 gap-2">
                {timelineData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-full bg-brand-500/30 rounded-t hover:bg-brand-500/50 transition-colors"
                      style={{ height: `${(item.queries / maxQueries) * 100}%` }}
                    />
                    <span className="text-xs text-slate-500">{item.time}</span>
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

export default Trending;
