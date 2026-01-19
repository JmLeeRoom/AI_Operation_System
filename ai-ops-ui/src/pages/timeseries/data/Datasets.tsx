import { 
  Database, 
  Plus,
  Search,
  Filter,
  Clock,
  GitBranch,
  Calendar,
  BarChart2,
  FileText,
  ChevronRight,
  Tag,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export function Datasets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const datasets = [
    {
      id: 'stock-prices',
      name: 'Stock Prices (KOSPI)',
      description: '한국 주가 데이터 (일봉)',
      type: 'forecasting',
      versions: 12,
      latestVersion: 'v2.3',
      rows: '2.5M',
      columns: 45,
      timeRange: '2010-01-01 ~ 2024-01-19',
      granularity: 'daily',
      entities: 850,
      lastUpdated: '2024-01-19',
    },
    {
      id: 'sensor-readings',
      name: 'Industrial Sensors',
      description: '제조 설비 센서 데이터',
      type: 'anomaly',
      versions: 8,
      latestVersion: 'v1.8',
      rows: '125M',
      columns: 128,
      timeRange: '2023-01-01 ~ 2024-01-19',
      granularity: '1min',
      entities: 45,
      lastUpdated: '2024-01-19',
    },
    {
      id: 'demand-forecast',
      name: 'Retail Demand',
      description: '소매 판매 수요 예측 데이터',
      type: 'forecasting',
      versions: 5,
      latestVersion: 'v1.5',
      rows: '8.2M',
      columns: 32,
      timeRange: '2021-01-01 ~ 2024-01-19',
      granularity: 'hourly',
      entities: 1200,
      lastUpdated: '2024-01-18',
    },
    {
      id: 'server-logs',
      name: 'Server Logs',
      description: '서버 로그 이상 탐지용',
      type: 'anomaly',
      versions: 3,
      latestVersion: 'v1.3',
      rows: '45M',
      columns: 24,
      timeRange: '2023-06-01 ~ 2024-01-19',
      granularity: '5min',
      entities: 120,
      lastUpdated: '2024-01-19',
    },
    {
      id: 'energy-consumption',
      name: 'Energy Consumption',
      description: '전력 소비량 예측 데이터',
      type: 'forecasting',
      versions: 7,
      latestVersion: 'v2.1',
      rows: '15M',
      columns: 18,
      timeRange: '2019-01-01 ~ 2024-01-19',
      granularity: '15min',
      entities: 500,
      lastUpdated: '2024-01-17',
    },
  ];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            Datasets
          </h1>
          <p className="text-slate-400 mt-1">시계열 데이터셋 버전 및 시간 분할 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Dataset
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Datasets</span>
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{datasets.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Versions</span>
            <GitBranch className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{datasets.reduce((acc, d) => acc + d.versions, 0)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Forecasting</span>
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{datasets.filter(d => d.type === 'forecasting').length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Anomaly Detection</span>
            <BarChart2 className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{datasets.filter(d => d.type === 'anomaly').length}</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {[
            { value: 'all', label: 'All' },
            { value: 'forecasting', label: 'Forecasting' },
            { value: 'anomaly', label: 'Anomaly' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                filterType === option.value
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 데이터셋 테이블 */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dataset</th>
              <th>Type</th>
              <th>Time Range</th>
              <th>Granularity</th>
              <th>Rows</th>
              <th>Entities</th>
              <th>Version</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDatasets.map((dataset) => (
              <tr key={dataset.id} className="hover:bg-slate-800/50 cursor-pointer">
                <td>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      dataset.type === 'forecasting' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                    }`}>
                      {dataset.type === 'forecasting' ? (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <BarChart2 className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{dataset.name}</p>
                      <p className="text-xs text-slate-500">{dataset.description}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    dataset.type === 'forecasting' ? 'badge-emerald' : 'badge-amber'
                  }`}>
                    {dataset.type}
                  </span>
                </td>
                <td>
                  <span className="text-slate-300 text-sm font-mono">{dataset.timeRange}</span>
                </td>
                <td>
                  <span className="text-slate-400">{dataset.granularity}</span>
                </td>
                <td className="font-mono text-slate-300">{dataset.rows}</td>
                <td className="font-mono text-slate-300">{dataset.entities}</td>
                <td>
                  <span className="badge badge-cyan">{dataset.latestVersion}</span>
                </td>
                <td className="text-slate-400 text-sm">{dataset.lastUpdated}</td>
                <td>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
