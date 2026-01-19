import { useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  Database,
  Table2,
  Layers,
  Filter,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RefreshCw,
  ChevronDown,
  Info
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge } from '../components/common/Badge';

// 더미 데이터 - 라인리지 노드
const lineageNodes = {
  sources: [
    { id: 's1', name: 'raw_events', type: 'table', platform: 'kafka', catalog: 'streaming' },
    { id: 's2', name: 'raw_users', type: 'table', platform: 'postgresql', catalog: 'app_db' },
    { id: 's3', name: 'raw_orders', type: 'table', platform: 'mysql', catalog: 'ecommerce' },
  ],
  transforms: [
    { id: 't1', name: 'stg_events', type: 'table', platform: 'snowflake', catalog: 'staging' },
    { id: 't2', name: 'stg_users', type: 'table', platform: 'snowflake', catalog: 'staging' },
    { id: 't3', name: 'stg_orders', type: 'table', platform: 'snowflake', catalog: 'staging' },
  ],
  targets: [
    { id: 'd1', name: 'dim_users', type: 'table', platform: 'snowflake', catalog: 'analytics_prod' },
    { id: 'd2', name: 'fact_orders', type: 'table', platform: 'snowflake', catalog: 'analytics_prod' },
    { id: 'd3', name: 'dim_products', type: 'table', platform: 'snowflake', catalog: 'analytics_prod' },
  ],
  downstream: [
    { id: 'r1', name: 'user_dashboard', type: 'dashboard', platform: 'looker', catalog: 'reports' },
    { id: 'r2', name: 'sales_report', type: 'dashboard', platform: 'tableau', catalog: 'reports' },
    { id: 'r3', name: 'ml_features', type: 'dataset', platform: 'databricks', catalog: 'ml_platform' },
  ],
};

// 더미 데이터 - 최근 임팩트 분석
const recentImpacts = [
  {
    id: 1,
    sourceTable: 'raw_users',
    changeType: 'Schema Change',
    impactedTables: 12,
    impactedDashboards: 3,
    severity: 'high',
    date: '2 hours ago',
  },
  {
    id: 2,
    sourceTable: 'raw_orders',
    changeType: 'Column Added',
    impactedTables: 8,
    impactedDashboards: 2,
    severity: 'low',
    date: '1 day ago',
  },
  {
    id: 3,
    sourceTable: 'dim_products',
    changeType: 'Data Quality Issue',
    impactedTables: 5,
    impactedDashboards: 4,
    severity: 'medium',
    date: '2 days ago',
  },
];

// 더미 데이터 - 통계
const lineageStats = [
  { label: 'Total Tables', value: '1,284', icon: Table2 },
  { label: 'Data Pipelines', value: '156', icon: GitBranch },
  { label: 'Dashboards', value: '89', icon: Layers },
  { label: 'Connected Sources', value: '24', icon: Database },
];

const Lineage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const NodeCard = ({ node, column }: { node: typeof lineageNodes.sources[0], column: 'source' | 'transform' | 'target' | 'downstream' }) => {
    const isSelected = selectedNode === node.id;
    const columnColors = {
      source: 'border-emerald-500/50 hover:border-emerald-500',
      transform: 'border-amber-500/50 hover:border-amber-500',
      target: 'border-brand-500/50 hover:border-brand-500',
      downstream: 'border-violet-500/50 hover:border-violet-500',
    };

    return (
      <div
        onClick={() => setSelectedNode(isSelected ? null : node.id)}
        className={`p-3 rounded-lg bg-slate-800/50 border-2 cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-brand-500 border-brand-500' : columnColors[column]
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {node.type === 'table' ? (
            <Table2 className="w-4 h-4 text-slate-400" />
          ) : node.type === 'dashboard' ? (
            <Layers className="w-4 h-4 text-slate-400" />
          ) : (
            <Database className="w-4 h-4 text-slate-400" />
          )}
          <span className="font-medium text-white text-sm truncate">{node.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <PlatformBadge platform={node.platform} />
          <span className="text-xs text-slate-500">{node.catalog}</span>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Lineage" subtitle="Explore data dependencies and impact analysis">
      <div className="space-y-6 animate-fade-in">
        {/* 상단 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {lineageStats.map((stat, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <stat.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 라인리지 그래프 */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* 툴바 */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tables..."
                      className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-48"
                    />
                  </div>
                  <button className="btn-ghost flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4" />
                    Filter
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-slate-400 w-12 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                    className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-slate-700" />
                  <button className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 라인리지 시각화 영역 */}
              <div className="flex-1 overflow-auto py-6" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                <div className="flex items-start justify-between gap-4 min-w-[900px] px-4">
                  {/* Sources */}
                  <div className="flex-1">
                    <div className="text-center mb-4">
                      <Badge variant="emerald">Sources</Badge>
                    </div>
                    <div className="space-y-3">
                      {lineageNodes.sources.map((node) => (
                        <NodeCard key={node.id} node={node} column="source" />
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center pt-16">
                    <ArrowRight className="w-8 h-8 text-slate-600" />
                  </div>

                  {/* Transforms */}
                  <div className="flex-1">
                    <div className="text-center mb-4">
                      <Badge variant="amber">Staging</Badge>
                    </div>
                    <div className="space-y-3">
                      {lineageNodes.transforms.map((node) => (
                        <NodeCard key={node.id} node={node} column="transform" />
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center pt-16">
                    <ArrowRight className="w-8 h-8 text-slate-600" />
                  </div>

                  {/* Targets */}
                  <div className="flex-1">
                    <div className="text-center mb-4">
                      <Badge variant="cyan">Analytics</Badge>
                    </div>
                    <div className="space-y-3">
                      {lineageNodes.targets.map((node) => (
                        <NodeCard key={node.id} node={node} column="target" />
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center pt-16">
                    <ArrowRight className="w-8 h-8 text-slate-600" />
                  </div>

                  {/* Downstream */}
                  <div className="flex-1">
                    <div className="text-center mb-4">
                      <Badge variant="violet">Consumers</Badge>
                    </div>
                    <div className="space-y-3">
                      {lineageNodes.downstream.map((node) => (
                        <NodeCard key={node.id} node={node} column="downstream" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 범례 */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-700/50 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-slate-400">Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-slate-400">Staging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-brand-500" />
                  <span className="text-slate-400">Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-violet-500" />
                  <span className="text-slate-400">Consumer</span>
                </div>
              </div>
            </Card>
          </div>

          {/* 사이드바 - 임팩트 분석 */}
          <div className="space-y-6">
            {/* 선택된 노드 정보 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-brand-400" />
                <h3 className="font-semibold text-white">Node Details</h3>
              </div>
              {selectedNode ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-sm text-slate-400">Selected Table</p>
                    <p className="font-medium text-white mt-1">
                      {[...lineageNodes.sources, ...lineageNodes.transforms, ...lineageNodes.targets, ...lineageNodes.downstream]
                        .find(n => n.id === selectedNode)?.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-500">Upstream</p>
                      <p className="text-lg font-bold text-white">3</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-500">Downstream</p>
                      <p className="text-lg font-bold text-white">5</p>
                    </div>
                  </div>
                  <button className="btn-primary w-full text-sm">View Full Lineage</button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  Click on a node to see details
                </p>
              )}
            </Card>

            {/* 최근 임팩트 분석 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Recent Impacts</h3>
              </div>
              <div className="space-y-3">
                {recentImpacts.map((impact) => (
                  <div
                    key={impact.id}
                    className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-white text-sm">{impact.sourceTable}</p>
                        <p className="text-xs text-slate-500">{impact.changeType}</p>
                      </div>
                      <Badge variant={
                        impact.severity === 'high' ? 'rose' :
                        impact.severity === 'medium' ? 'amber' : 'emerald'
                      }>
                        {impact.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{impact.impactedTables} tables</span>
                      <span>{impact.impactedDashboards} dashboards</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{impact.date}</p>
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

export default Lineage;
