import { 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Database,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';
import type { ValidationStatus } from '../../types';

const validationReports = [
  {
    id: '1',
    dataset: 'ImageNet-Subset',
    version: 'v2.1.0',
    status: 'PASS' as ValidationStatus,
    createdAt: '2 hours ago',
    checks: [
      { name: 'Schema Validation', status: 'PASS' as ValidationStatus },
      { name: 'Null Check', status: 'PASS' as ValidationStatus },
      { name: 'Distribution Check', status: 'PASS' as ValidationStatus },
      { name: 'Duplicate Check', status: 'PASS' as ValidationStatus },
    ],
  },
  {
    id: '2',
    dataset: 'Customer Support Conversations',
    version: 'v1.5.2',
    status: 'WARN' as ValidationStatus,
    createdAt: '1 day ago',
    checks: [
      { name: 'Schema Validation', status: 'PASS' as ValidationStatus },
      { name: 'Null Check', status: 'WARN' as ValidationStatus, message: '2% null values in sentiment column' },
      { name: 'Distribution Check', status: 'PASS' as ValidationStatus },
      { name: 'Duplicate Check', status: 'PASS' as ValidationStatus },
    ],
  },
  {
    id: '3',
    dataset: 'Speech Commands',
    version: 'v3.0.0',
    status: 'FAIL' as ValidationStatus,
    createdAt: '3 days ago',
    checks: [
      { name: 'Schema Validation', status: 'PASS' as ValidationStatus },
      { name: 'Audio Format Check', status: 'FAIL' as ValidationStatus, message: '15 files with invalid format' },
      { name: 'Duration Check', status: 'WARN' as ValidationStatus, message: '5 files exceed max duration' },
      { name: 'Duplicate Check', status: 'PASS' as ValidationStatus },
    ],
  },
];

const statusConfig = {
  PASS: { icon: <CheckCircle size={16} />, className: 'bg-emerald-500/10 text-emerald-400' },
  WARN: { icon: <AlertTriangle size={16} />, className: 'bg-amber-500/10 text-amber-400' },
  FAIL: { icon: <XCircle size={16} />, className: 'bg-red-500/10 text-red-400' },
};

export function Validation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Data Validation</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor data quality checks</p>
        </div>
        <Button leftIcon={<RefreshCw size={14} />}>Run Validation</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Passed', value: '45', icon: <CheckCircle size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Warnings', value: '8', icon: <AlertTriangle size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Failed', value: '2', icon: <XCircle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className={cn('text-2xl font-semibold', stat.color)}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search validation reports..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Status</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {validationReports.map((report) => {
          const status = statusConfig[report.status];
          return (
            <Card key={report.id}>
              <CardContent>
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('p-2 rounded-lg', status.className)}>
                    {status.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{report.dataset}</h3>
                      <span className="px-1.5 py-0.5 text-xs font-mono bg-muted text-muted-foreground rounded">
                        {report.version}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} />
                      {report.createdAt}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" leftIcon={<FileText size={12} />}>
                    Full Report
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {report.checks.map((check) => {
                    const checkStatus = statusConfig[check.status];
                    return (
                      <div key={check.name} className={cn('p-3 rounded-md', checkStatus.className.split(' ')[0])}>
                        <div className="flex items-center gap-2 mb-1">
                          {checkStatus.icon}
                          <span className="text-xs font-medium text-foreground">{check.name}</span>
                        </div>
                        {check.message && (
                          <p className="text-xs text-muted-foreground mt-1">{check.message}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
