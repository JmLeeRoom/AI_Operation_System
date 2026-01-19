import { 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Image,
  ArrowRight,
  Wand2,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export function LabelQA() {
  const [selectedDataset, setSelectedDataset] = useState('Street Scene Detection v2.3');

  const qaScore = {
    overall: 94.2,
    categories: [
      { name: 'Missing Labels', score: 98, issues: 45, severity: 'warning' },
      { name: 'Overlapping BBoxes', score: 96, issues: 89, severity: 'info' },
      { name: 'Out of Bounds', score: 99, issues: 12, severity: 'warning' },
      { name: 'Small Area', score: 92, issues: 234, severity: 'info' },
      { name: 'Class Mismatch', score: 88, issues: 156, severity: 'critical' },
      { name: 'Aspect Ratio', score: 95, issues: 78, severity: 'info' },
    ]
  };

  const issues = [
    {
      id: 1,
      type: 'Class Mismatch',
      severity: 'critical',
      filename: 'street_00234.jpg',
      description: 'Label "Truck" should be "Bus" based on visual inspection',
      suggestion: 'Change class from Truck to Bus',
      bbox: { x: 120, y: 80, w: 200, h: 150 }
    },
    {
      id: 2,
      type: 'Missing Labels',
      severity: 'warning',
      filename: 'street_00567.jpg',
      description: 'Unlabeled person detected in bottom-right corner',
      suggestion: 'Add Person bbox at (1450, 890, 80, 180)',
      bbox: null
    },
    {
      id: 3,
      type: 'Overlapping BBoxes',
      severity: 'info',
      filename: 'street_00891.jpg',
      description: 'Two bboxes overlap by 85% (possible duplicate)',
      suggestion: 'Merge or remove duplicate annotation',
      bbox: { x: 340, y: 200, w: 120, h: 90 }
    },
    {
      id: 4,
      type: 'Small Area',
      severity: 'info',
      filename: 'street_01234.jpg',
      description: 'BBox area is 24px² (below 100px² threshold)',
      suggestion: 'Review or remove small annotation',
      bbox: { x: 890, y: 450, w: 6, h: 4 }
    },
    {
      id: 5,
      type: 'Out of Bounds',
      severity: 'warning',
      filename: 'street_01567.jpg',
      description: 'BBox extends 15px outside image boundary',
      suggestion: 'Clip bbox to image bounds',
      bbox: { x: 1910, y: 100, w: 50, h: 80 }
    },
  ];

  const labelerStats = [
    { name: 'Labeler A', annotations: 12500, accuracy: 96.2, bias: 'None detected' },
    { name: 'Labeler B', annotations: 10800, accuracy: 94.8, bias: 'Favors "Car" class (+8%)' },
    { name: 'Labeler C', annotations: 8900, accuracy: 92.1, bias: 'Underrepresents "Bicycle" (-12%)' },
  ];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' };
      case 'warning': return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
      default: return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Label Quality Assurance</h1>
          <p className="text-slate-400 mt-1">라벨 품질 검사 및 자동 수정 제안</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="input-field w-64"
          >
            <option>Street Scene Detection v2.3</option>
            <option>Factory Defect Segmentation v1.8</option>
            <option>Pose Estimation Dataset v3.1</option>
          </select>
          <button className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Re-run QA
          </button>
          <button className="btn-primary">
            <Wand2 className="w-4 h-4" />
            Auto Fix All
          </button>
        </div>
      </div>

      {/* QA 스코어 개요 */}
      <div className="grid grid-cols-4 gap-6">
        {/* 전체 스코어 */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56 * qaScore.overall / 100} ${2 * Math.PI * 56}`}
                className="text-emerald-400"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{qaScore.overall}%</span>
              <span className="text-xs text-slate-400">QA Score</span>
            </div>
          </div>
        </div>

        {/* 카테고리별 스코어 */}
        <div className="col-span-3 glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quality Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            {qaScore.categories.map((cat) => {
              const style = getSeverityStyle(cat.severity);
              return (
                <div key={cat.name} className={`p-3 rounded-lg border ${style.border} ${style.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">{cat.name}</span>
                    <span className={`text-lg font-bold ${style.text}`}>{cat.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        cat.score >= 95 ? 'bg-emerald-500' : 
                        cat.score >= 90 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{cat.issues} issues found</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 이슈 리스트 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Issues</h3>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <select className="input-field text-sm py-1.5 w-32">
                <option>All Severity</option>
                <option>Critical</option>
                <option>Warning</option>
                <option>Info</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {issues.map((issue) => {
              const style = getSeverityStyle(issue.severity);
              return (
                <div 
                  key={issue.id}
                  className={`p-4 rounded-lg border ${style.border} hover:bg-slate-800/30 cursor-pointer transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    {/* 썸네일 */}
                    <div className="w-20 h-20 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <Image className="w-8 h-8 text-slate-600" />
                      {issue.bbox && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-8 h-6 border-2 ${style.border} rounded`} />
                        </div>
                      )}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${style.bg} ${style.text} border ${style.border} capitalize`}>
                          {issue.severity}
                        </span>
                        <span className="badge badge-slate">{issue.type}</span>
                      </div>
                      <p className="text-sm text-slate-200 mb-1">{issue.description}</p>
                      <p className="text-xs text-slate-500">{issue.filename}</p>
                    </div>

                    {/* 액션 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="btn-ghost text-sm py-1.5">
                        <Wand2 className="w-3.5 h-3.5" />
                        Fix
                      </button>
                      <button className="btn-ghost text-sm py-1.5">
                        View
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 제안 */}
                  <div className="mt-3 p-2 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-400">
                      <span className="text-brand-400 font-medium">Suggestion:</span> {issue.suggestion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 라벨러 통계 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Labeler Statistics</h3>
          <p className="text-sm text-slate-400 mb-4">라벨러별 편향 분석</p>
          
          <div className="space-y-4">
            {labelerStats.map((labeler) => (
              <div key={labeler.name} className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-200">{labeler.name}</span>
                  <span className={`text-sm font-medium ${
                    labeler.accuracy >= 95 ? 'text-emerald-400' : 
                    labeler.accuracy >= 90 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {labeler.accuracy}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{labeler.annotations.toLocaleString()} annotations</span>
                </div>
                <div className={`text-xs p-2 rounded ${
                  labeler.bias === 'None detected' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {labeler.bias}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full btn-ghost mt-4 justify-center">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
