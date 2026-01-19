import { 
  Database, 
  Cloud,
  HardDrive,
  Radio,
  Plus,
  Search,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Link,
  Table,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { useState } from 'react';

export function Connections() {
  const [searchQuery, setSearchQuery] = useState('');

  const connectors = [
    {
      id: 'postgres-prod',
      name: 'Production PostgreSQL',
      type: 'database',
      icon: Database,
      status: 'connected',
      lastSync: '2024-01-19 14:30',
      tables: 45,
      rowCount: '12.5M',
      config: {
        host: 'prod-db.company.com:5432',
        database: 'timeseries_data',
      }
    },
    {
      id: 's3-data-lake',
      name: 'Data Lake (S3)',
      type: 's3',
      icon: Cloud,
      status: 'connected',
      lastSync: '2024-01-19 15:00',
      tables: 128,
      rowCount: '2.1B',
      config: {
        bucket: 's3://company-data-lake',
        region: 'ap-northeast-2',
      }
    },
    {
      id: 'kafka-stream',
      name: 'Kafka Realtime Stream',
      type: 'stream',
      icon: Radio,
      status: 'active',
      lastSync: 'Live',
      tables: 12,
      rowCount: '~50K/min',
      config: {
        broker: 'kafka.company.com:9092',
        topics: 'sensor_*, transaction_*',
      }
    },
    {
      id: 'local-parquet',
      name: 'Local Parquet Files',
      type: 'file',
      icon: HardDrive,
      status: 'idle',
      lastSync: '2024-01-18 09:00',
      tables: 8,
      rowCount: '850K',
      config: {
        path: '/data/historical/',
        format: 'parquet',
      }
    },
  ];

  const connectorTypes = [
    { type: 'database', name: 'Database', icon: Database, description: 'PostgreSQL, MySQL, ClickHouse, TimescaleDB' },
    { type: 's3', name: 'Cloud Storage', icon: Cloud, description: 'S3, GCS, Azure Blob, MinIO' },
    { type: 'stream', name: 'Streaming', icon: Radio, description: 'Kafka, Kinesis, Pulsar, MQTT' },
    { type: 'file', name: 'File System', icon: HardDrive, description: 'CSV, Parquet, JSON, Arrow' },
  ];

  const filteredConnectors = connectors.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            Data Connections
          </h1>
          <p className="text-slate-400 mt-1">DB, 클라우드 스토리지, 스트림 데이터 소스 연결 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Connection
        </button>
      </div>

      {/* 커넥터 타입 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {connectorTypes.map((type) => (
          <div 
            key={type.type}
            className="glass-card p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <type.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">{type.name}</p>
                <p className="text-xs text-slate-500">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* 연결 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredConnectors.map((connector) => (
          <div 
            key={connector.id}
            className="glass-card p-5 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  connector.type === 'database' ? 'bg-blue-500/20' :
                  connector.type === 's3' ? 'bg-emerald-500/20' :
                  connector.type === 'stream' ? 'bg-violet-500/20' :
                  'bg-amber-500/20'
                }`}>
                  <connector.icon className={`w-6 h-6 ${
                    connector.type === 'database' ? 'text-blue-400' :
                    connector.type === 's3' ? 'text-emerald-400' :
                    connector.type === 'stream' ? 'text-violet-400' :
                    'text-amber-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{connector.name}</h3>
                  <p className="text-sm text-slate-500">{connector.config.host || connector.config.bucket || connector.config.broker || connector.config.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${
                  connector.status === 'connected' ? 'badge-emerald' :
                  connector.status === 'active' ? 'badge-violet' :
                  'badge-slate'
                }`}>
                  {connector.status === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {connector.status === 'active' && <Radio className="w-3 h-3 mr-1" />}
                  {connector.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-2 rounded bg-slate-800/50">
                <p className="text-lg font-semibold text-slate-200">{connector.tables}</p>
                <p className="text-xs text-slate-500">Tables</p>
              </div>
              <div className="text-center p-2 rounded bg-slate-800/50">
                <p className="text-lg font-semibold text-slate-200">{connector.rowCount}</p>
                <p className="text-xs text-slate-500">Rows</p>
              </div>
              <div className="text-center p-2 rounded bg-slate-800/50">
                <p className="text-lg font-semibold text-slate-200 text-xs">{connector.lastSync}</p>
                <p className="text-xs text-slate-500">Last Sync</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                <Table className="w-3 h-3" />
                Browse Schema
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5 flex-1">
                <FileSpreadsheet className="w-3 h-3" />
                Preview Data
              </button>
              <button className="btn-ghost text-xs px-2 py-1.5">
                <Settings className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lineage 정보 */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-cyan-400" />
          Data Lineage Overview
        </h2>
        <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xs text-slate-400">Sources</p>
              <p className="text-lg font-semibold text-slate-200">4</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-600" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <Table className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400">Datasets</p>
              <p className="text-lg font-semibold text-slate-200">23</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-600" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-violet-500/20 flex items-center justify-center mx-auto mb-2">
                <RefreshCw className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-xs text-slate-400">Pipelines</p>
              <p className="text-lg font-semibold text-slate-200">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
