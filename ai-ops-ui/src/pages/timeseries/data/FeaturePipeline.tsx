import { 
  GitBranch,
  Plus,
  Play,
  Save,
  Trash2,
  Settings,
  ArrowRight,
  Box,
  Clock,
  Calendar,
  TrendingUp,
  Hash,
  Percent,
  Filter,
  Database,
  RefreshCw,
  Eye,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export function FeaturePipeline() {
  const [selectedPipeline, setSelectedPipeline] = useState('stock-features-v2');

  const pipelines = [
    { id: 'stock-features-v2', name: 'Stock Features v2', status: 'active', nodes: 12 },
    { id: 'sensor-features-v1', name: 'Sensor Features v1', status: 'active', nodes: 8 },
    { id: 'demand-features-v1', name: 'Demand Features v1', status: 'draft', nodes: 6 },
  ];

  const nodeTypes = [
    { type: 'select', name: 'Select', icon: Filter, description: '컬럼 선택' },
    { type: 'cast', name: 'Cast', icon: Hash, description: '타입 변환' },
    { type: 'impute', name: 'Impute', icon: Box, description: '결측치 대체' },
    { type: 'scale', name: 'Scale', icon: Percent, description: '스케일링' },
    { type: 'lag', name: 'Lag', icon: Clock, description: '시차 피처' },
    { type: 'rolling', name: 'Rolling', icon: TrendingUp, description: '롤링 통계' },
    { type: 'calendar', name: 'Calendar', icon: Calendar, description: '캘린더 피처' },
    { type: 'encode', name: 'Encode', icon: GitBranch, description: '범주형 인코딩' },
  ];

  const pipelineNodes = [
    { id: 1, type: 'select', name: 'Select Columns', config: { columns: ['close', 'volume', 'high', 'low'] } },
    { id: 2, type: 'impute', name: 'Fill Missing', config: { method: 'forward_fill' } },
    { id: 3, type: 'lag', name: 'Price Lags', config: { columns: ['close'], lags: [1, 5, 10, 20] } },
    { id: 4, type: 'rolling', name: 'Moving Averages', config: { columns: ['close'], windows: [5, 10, 20], aggregations: ['mean', 'std'] } },
    { id: 5, type: 'calendar', name: 'Calendar Features', config: { features: ['dayofweek', 'month', 'quarter', 'is_month_end'] } },
    { id: 6, type: 'scale', name: 'StandardScaler', config: { method: 'standard', columns: 'numeric' } },
  ];

  const previewData = [
    { feature: 'close', original: 71500, transformed: 0.82 },
    { feature: 'close_lag_1', original: 71200, transformed: 0.78 },
    { feature: 'close_lag_5', original: 70800, transformed: 0.72 },
    { feature: 'close_ma_5', original: 71100, transformed: 0.77 },
    { feature: 'close_ma_20', original: 70500, transformed: 0.68 },
    { feature: 'dayofweek', original: 4, transformed: 4 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            Feature Engineering
          </h1>
          <p className="text-slate-400 mt-1">피처 파이프라인 빌더 - Lag, Rolling, Calendar 등</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="btn-secondary">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="btn-primary">
            <Play className="w-4 h-4" />
            Run Pipeline
          </button>
        </div>
      </div>

      {/* 파이프라인 선택 */}
      <div className="flex items-center gap-4">
        <select
          value={selectedPipeline}
          onChange={(e) => setSelectedPipeline(e.target.value)}
          className="input-field py-2 max-w-xs"
        >
          {pipelines.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button className="btn-ghost">
          <Plus className="w-4 h-4" />
          New Pipeline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 노드 팔레트 */}
        <div className="lg:col-span-1 glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Transform Nodes</h3>
          <div className="space-y-2">
            {nodeTypes.map((node) => (
              <div
                key={node.type}
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 cursor-grab transition-colors"
              >
                <div className="flex items-center gap-2">
                  <node.icon className="w-4 h-4 text-violet-400" />
                  <span className="text-slate-200 text-sm">{node.name}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{node.description}</p>
              </div>
            ))}
          </div>

          {/* Leakage Warning */}
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400 font-medium">⚠️ Leakage Guard</p>
            <p className="text-xs text-slate-400 mt-1">
              미래 데이터 사용 방지 체크 활성화됨
            </p>
          </div>
        </div>

        {/* 파이프라인 캔버스 */}
        <div className="lg:col-span-2 glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Pipeline Canvas</h3>
            <span className="text-xs text-slate-500">{pipelineNodes.length} nodes</span>
          </div>
          
          {/* 파이프라인 노드 시각화 */}
          <div className="space-y-3">
            {/* 입력 노드 */}
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/50">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 font-medium">Input: Stock Prices (KOSPI)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">v2.3 • 2.5M rows • 45 columns</p>
            </div>

            {/* 변환 노드들 */}
            {pipelineNodes.map((node, idx) => {
              const nodeType = nodeTypes.find(n => n.type === node.type);
              return (
                <div key={node.id} className="relative">
                  <div className="absolute left-1/2 -top-2 w-0.5 h-2 bg-slate-600" />
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {nodeType && <nodeType.icon className="w-4 h-4 text-violet-400" />}
                        <span className="text-slate-200 text-sm">{node.name}</span>
                        <span className="badge badge-slate text-xs">{node.type}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-slate-700">
                          <Settings className="w-3 h-3 text-slate-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-700">
                          <Trash2 className="w-3 h-3 text-rose-400" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 font-mono">
                      {JSON.stringify(node.config).substring(0, 60)}...
                    </div>
                  </div>
                  {idx < pipelineNodes.length - 1 && (
                    <div className="absolute left-1/2 -bottom-2 w-0.5 h-2 bg-slate-600" />
                  )}
                </div>
              );
            })}

            {/* 출력 노드 */}
            <div className="relative">
              <div className="absolute left-1/2 -top-2 w-0.5 h-2 bg-slate-600" />
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/50">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Output: Feature Set</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">32 features generated</p>
              </div>
            </div>
          </div>
        </div>

        {/* 프리뷰 */}
        <div className="lg:col-span-1 glass-card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Sample Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-700">
              <span>Feature</span>
              <div className="flex gap-4">
                <span>Original</span>
                <span>Transformed</span>
              </div>
            </div>
            {previewData.map((item) => (
              <div key={item.feature} className="flex items-center justify-between text-sm">
                <span className="font-mono text-violet-400 text-xs">{item.feature}</span>
                <div className="flex gap-4 text-xs">
                  <span className="text-slate-400 font-mono w-16 text-right">{item.original}</span>
                  <span className="text-emerald-400 font-mono w-12 text-right">{item.transformed}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Feature Set Version</p>
            <button className="w-full btn-secondary text-xs py-2">
              <Save className="w-3 h-3" />
              Create Version
            </button>
          </div>
        </div>
      </div>

      {/* 설정 패널 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Node Configuration: Rolling Averages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Columns</label>
            <input
              type="text"
              value="close, volume"
              className="input-field"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Window Sizes</label>
            <input
              type="text"
              value="5, 10, 20, 60"
              className="input-field"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Aggregations</label>
            <div className="flex flex-wrap gap-2">
              {['mean', 'std', 'min', 'max'].map((agg) => (
                <span 
                  key={agg}
                  className={`badge cursor-pointer ${
                    ['mean', 'std'].includes(agg) ? 'badge-violet' : 'badge-slate'
                  }`}
                >
                  {agg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
