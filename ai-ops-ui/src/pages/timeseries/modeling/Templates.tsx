import { 
  Layers,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  Table,
  Play,
  ChevronRight,
  Star,
  Clock,
  Zap,
  BarChart2
} from 'lucide-react';
import { useState } from 'react';

export function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const templates = [
    {
      id: 'xgboost-forecasting',
      name: 'XGBoost Forecasting',
      category: 'forecasting',
      description: '범용 시계열 예측 템플릿 (GBDT)',
      complexity: 'medium',
      stars: 4.8,
      uses: 156,
      features: ['Feature engineering 자동화', '하이퍼파라미터 튜닝', 'Walk-forward 검증'],
      baseline: true,
    },
    {
      id: 'lstm-forecasting',
      name: 'LSTM / Transformer',
      category: 'forecasting',
      description: '딥러닝 기반 시계열 예측',
      complexity: 'high',
      stars: 4.5,
      uses: 89,
      features: ['Sequence modeling', 'Attention mechanism', 'Multi-step prediction'],
      baseline: false,
    },
    {
      id: 'prophet',
      name: 'Prophet',
      category: 'forecasting',
      description: '계절성/트렌드 분해 예측',
      complexity: 'low',
      stars: 4.2,
      uses: 234,
      features: ['자동 계절성 탐지', '휴일 효과', '해석 가능성'],
      baseline: true,
    },
    {
      id: 'isolation-forest',
      name: 'Isolation Forest',
      category: 'anomaly',
      description: '비지도 이상탐지 (트리 기반)',
      complexity: 'low',
      stars: 4.6,
      uses: 178,
      features: ['비지도 학습', '빠른 추론', '해석 가능'],
      baseline: true,
    },
    {
      id: 'autoencoder-anomaly',
      name: 'AutoEncoder',
      category: 'anomaly',
      description: '재구성 오차 기반 이상탐지',
      complexity: 'medium',
      stars: 4.4,
      uses: 112,
      features: ['딥러닝 기반', '다변량 지원', 'Threshold 튜닝'],
      baseline: false,
    },
    {
      id: 'stl-rule',
      name: 'STL + Rule',
      category: 'anomaly',
      description: '통계적 분해 + 룰 기반',
      complexity: 'low',
      stars: 4.3,
      uses: 145,
      features: ['해석 가능', '빠른 배포', '도메인 룰 추가'],
      baseline: true,
    },
    {
      id: 'lightgbm-tabular',
      name: 'LightGBM Tabular',
      category: 'tabular',
      description: '범용 테이블 분류/회귀',
      complexity: 'medium',
      stars: 4.7,
      uses: 203,
      features: ['Categorical 자동 처리', '빠른 학습', 'Feature importance'],
      baseline: true,
    },
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'forecasting': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'tabular': return Table;
      default: return Layers;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'forecasting': return 'emerald';
      case 'anomaly': return 'amber';
      case 'tabular': return 'violet';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            Pipeline Templates
          </h1>
          <p className="text-slate-400 mt-1">Forecasting, Anomaly Detection, Tabular ML 템플릿</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Custom Template
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
          {['all', 'forecasting', 'anomaly', 'tabular'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = getCategoryIcon(template.category);
          const color = getCategoryColor(template.category);
          
          return (
            <div 
              key={template.id}
              className="glass-card p-5 hover:border-indigo-500/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                <div className="flex items-center gap-2">
                  {template.baseline && (
                    <span className="badge badge-cyan text-xs">Baseline</span>
                  )}
                  <span className={`badge badge-${color} text-xs`}>
                    {template.category}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-slate-100 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{template.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {template.stars}
                </span>
                <span className="text-slate-500">{template.uses} uses</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  template.complexity === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                  template.complexity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {template.complexity}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {template.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    {feature}
                  </div>
                ))}
              </div>

              <button className="w-full btn-secondary text-sm py-2 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                <Play className="w-4 h-4" />
                Use Template
              </button>
            </div>
          );
        })}
      </div>

      {/* DAG Preview */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Template DAG Preview: XGBoost Forecasting</h3>
        <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
          <div className="flex items-center gap-4">
            {['Ingest', 'Validate', 'Features', 'Train', 'Backtest', 'Register', 'Deploy', 'Monitor'].map((step, idx) => (
              <div key={step} className="flex items-center">
                <div className="px-3 py-2 rounded bg-indigo-500/20 border border-indigo-500/50 text-xs text-indigo-300">
                  {step}
                </div>
                {idx < 7 && <ChevronRight className="w-4 h-4 text-slate-600 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
