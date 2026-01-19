import { 
  Database, 
  GitBranch,
  Calendar,
  Clock,
  BarChart2,
  FileText,
  Download,
  RefreshCw,
  Table,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowLeft,
  TrendingUp,
  Hash,
  Columns
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function DatasetDetail() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVersion, setSelectedVersion] = useState('v2.3');

  const dataset = {
    id: 'stock-prices',
    name: 'Stock Prices (KOSPI)',
    description: '한국 주가 데이터 (일봉) - KOSPI 전종목',
    type: 'forecasting',
    versions: [
      { version: 'v2.3', date: '2024-01-19', rows: '2.5M', status: 'active' },
      { version: 'v2.2', date: '2024-01-12', rows: '2.4M', status: 'archived' },
      { version: 'v2.1', date: '2024-01-05', rows: '2.3M', status: 'archived' },
    ],
    stats: {
      rows: '2,534,128',
      columns: 45,
      entities: 850,
      timeRange: '2010-01-01 ~ 2024-01-19',
      granularity: 'daily',
      sizeGB: '4.2',
    }
  };

  const columns = [
    { name: 'timestamp', type: 'datetime', unit: '-', cardinality: 'continuous', missing: '0%', description: 'Trading date' },
    { name: 'stock_code', type: 'string', unit: '-', cardinality: '850', missing: '0%', description: 'Stock ticker' },
    { name: 'open', type: 'float64', unit: 'KRW', cardinality: 'continuous', missing: '0.01%', description: 'Open price' },
    { name: 'high', type: 'float64', unit: 'KRW', cardinality: 'continuous', missing: '0.01%', description: 'High price' },
    { name: 'low', type: 'float64', unit: 'KRW', cardinality: 'continuous', missing: '0.01%', description: 'Low price' },
    { name: 'close', type: 'float64', unit: 'KRW', cardinality: 'continuous', missing: '0%', description: 'Close price' },
    { name: 'volume', type: 'int64', unit: 'shares', cardinality: 'continuous', missing: '0%', description: 'Trading volume' },
    { name: 'market_cap', type: 'float64', unit: 'KRW (B)', cardinality: 'continuous', missing: '0.5%', description: 'Market capitalization' },
    { name: 'sector', type: 'string', unit: '-', cardinality: '18', missing: '0%', description: 'Industry sector' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'schema', label: 'Schema', icon: Table },
    { id: 'preview', label: 'Preview', icon: Activity },
    { id: 'versions', label: 'Versions', icon: GitBranch },
    { id: 'splits', label: 'Time Splits', icon: Calendar },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/timeseries/data/datasets" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">{dataset.name}</h1>
                <p className="text-slate-400">{dataset.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="input-field py-2"
          >
            {dataset.versions.map((v) => (
              <option key={v.version} value={v.version}>{v.version} ({v.date})</option>
            ))}
          </select>
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Rows</p>
          <p className="text-xl font-bold text-slate-100 font-mono">{dataset.stats.rows}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Columns</p>
          <p className="text-xl font-bold text-slate-100 font-mono">{dataset.stats.columns}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Entities</p>
          <p className="text-xl font-bold text-slate-100 font-mono">{dataset.stats.entities}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Granularity</p>
          <p className="text-xl font-bold text-emerald-400">{dataset.stats.granularity}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Time Range</p>
          <p className="text-sm font-medium text-slate-200">{dataset.stats.timeRange}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-xs mb-1">Size</p>
          <p className="text-xl font-bold text-slate-100 font-mono">{dataset.stats.sizeGB} GB</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 샘플 시계열 차트 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Sample Time Series</h3>
            <div className="h-64 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500">Feature time series visualization</p>
              </div>
            </div>
          </div>

          {/* 데이터 품질 요약 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Quality Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-200">Missing Values</span>
                </div>
                <span className="text-emerald-400 font-mono">0.02%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-200">Duplicates</span>
                </div>
                <span className="text-emerald-400 font-mono">0%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-200">Outliers</span>
                </div>
                <span className="text-amber-400 font-mono">0.8%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-200">Distribution Shift</span>
                </div>
                <span className="text-emerald-400 font-mono">PSI: 0.05</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Unit</th>
                <th>Cardinality</th>
                <th>Missing</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <span className="font-mono text-emerald-400">{col.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-slate">{col.type}</span>
                  </td>
                  <td className="text-slate-400">{col.unit}</td>
                  <td className="font-mono text-slate-300">{col.cardinality}</td>
                  <td className={col.missing !== '0%' && parseFloat(col.missing) > 0.1 ? 'text-amber-400' : 'text-emerald-400'}>
                    {col.missing}
                  </td>
                  <td className="text-slate-400 text-sm">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>timestamp</th>
                  <th>stock_code</th>
                  <th>open</th>
                  <th>high</th>
                  <th>low</th>
                  <th>close</th>
                  <th>volume</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ts: '2024-01-19', code: '005930', open: '71200', high: '71800', low: '70900', close: '71500', vol: '12,345,678' },
                  { ts: '2024-01-18', code: '005930', open: '70800', high: '71400', low: '70500', close: '71200', vol: '10,234,567' },
                  { ts: '2024-01-17', code: '005930', open: '71000', high: '71200', low: '70200', close: '70800', vol: '11,456,789' },
                  { ts: '2024-01-16', code: '005930', open: '70500', high: '71100', low: '70300', close: '71000', vol: '9,876,543' },
                  { ts: '2024-01-15', code: '005930', open: '70200', high: '70800', low: '69900', close: '70500', vol: '8,765,432' },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-slate-300">{row.ts}</td>
                    <td className="font-mono text-emerald-400">{row.code}</td>
                    <td className="font-mono text-slate-300">{row.open}</td>
                    <td className="font-mono text-slate-300">{row.high}</td>
                    <td className="font-mono text-slate-300">{row.low}</td>
                    <td className="font-mono text-slate-300">{row.close}</td>
                    <td className="font-mono text-slate-300">{row.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Version History
          </h3>
          <div className="space-y-3">
            {dataset.versions.map((v) => (
              <div 
                key={v.version}
                className={`p-4 rounded-lg border transition-colors ${
                  v.version === selectedVersion 
                    ? 'bg-emerald-500/10 border-emerald-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="badge badge-cyan">{v.version}</span>
                    <span className="text-slate-300">{v.date}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono">{v.rows} rows</span>
                  </div>
                  <span className={`badge ${v.status === 'active' ? 'badge-emerald' : 'badge-slate'}`}>
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'splits' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            Time-based Splits
          </h3>
          <div className="space-y-4">
            <div className="h-16 flex rounded-lg overflow-hidden">
              <div className="bg-emerald-500/30 flex-[60] flex items-center justify-center text-emerald-300 font-medium border-r border-slate-700">
                Train (60%)
              </div>
              <div className="bg-amber-500/30 flex-[20] flex items-center justify-center text-amber-300 font-medium border-r border-slate-700">
                Val (20%)
              </div>
              <div className="bg-violet-500/30 flex-[20] flex items-center justify-center text-violet-300 font-medium">
                Test (20%)
              </div>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>2010-01-01</span>
              <span>2018-06-01</span>
              <span>2021-12-01</span>
              <span>2024-01-19</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
