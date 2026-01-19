import { 
  Search, 
  Filter,
  GitBranch,
  Calendar,
  Database,
  User,
  Download,
  Eye,
  GitCompare
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const versions = [
  { 
    id: '1', 
    dataset: 'ImageNet-Subset', 
    version: 'v2.1.0', 
    createdAt: '2 days ago', 
    createdBy: 'JaeMyeong',
    size: '450 GB',
    rowCount: '1.2M',
    hash: 'sha256:a8f3e21...',
    changes: '+50K images, class rebalancing',
  },
  { 
    id: '2', 
    dataset: 'ImageNet-Subset', 
    version: 'v2.0.0', 
    createdAt: '1 week ago', 
    createdBy: 'CV Team',
    size: '420 GB',
    rowCount: '1.15M',
    hash: 'sha256:b9c4f32...',
    changes: 'Initial curated version',
  },
  { 
    id: '3', 
    dataset: 'Customer Support Conversations', 
    version: 'v1.5.2', 
    createdAt: '1 week ago', 
    createdBy: 'NLP Team',
    size: '12 GB',
    rowCount: '2.5M',
    hash: 'sha256:c7d5e43...',
    changes: 'Added sentiment labels',
  },
];

export function Versions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dataset Versions</h1>
          <p className="text-sm text-muted-foreground mt-1">Track dataset changes over time</p>
        </div>
        <Button variant="outline" leftIcon={<GitCompare size={14} />}>Compare Versions</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search versions..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Dataset</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Dataset</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Version</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Rows</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Changes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {versions.map((version) => (
                <tr key={version.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Database size={14} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{version.dataset}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded">
                      {version.version}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{version.size}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{version.rowCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="text-foreground">{version.createdAt}</p>
                      <p className="text-xs text-muted-foreground">by {version.createdBy}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{version.changes}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye size={12} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Download size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
