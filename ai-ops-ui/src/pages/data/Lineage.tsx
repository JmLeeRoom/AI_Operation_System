import { 
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Database,
  GitBranch,
  Box,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const lineageNodes = [
  { id: '1', type: 'dataset', name: 'raw-images', x: 50, y: 100 },
  { id: '2', type: 'pipeline', name: 'data-preprocessing', x: 250, y: 100 },
  { id: '3', type: 'dataset', name: 'processed-images-v2.1', x: 450, y: 50 },
  { id: '4', type: 'pipeline', name: 'cv-training', x: 650, y: 50 },
  { id: '5', type: 'model', name: 'cv-detector-v2.3', x: 850, y: 50 },
  { id: '6', type: 'deployment', name: 'cv-classifier-prod', x: 1050, y: 50 },
  { id: '7', type: 'dataset', name: 'validation-set', x: 450, y: 150 },
  { id: '8', type: 'pipeline', name: 'model-evaluation', x: 650, y: 150 },
];

const nodeConfig = {
  dataset: { icon: <Database size={14} />, className: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  pipeline: { icon: <GitBranch size={14} />, className: 'bg-violet-500/10 border-violet-500/30 text-violet-400' },
  model: { icon: <Box size={14} />, className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  deployment: { icon: <Rocket size={14} />, className: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
};

export function Lineage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Data Lineage</h1>
          <p className="text-sm text-muted-foreground mt-1">Trace data flow across pipelines</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-64 h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <Card className="h-[calc(100vh-14rem)]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <div className="flex items-center gap-4">
            {Object.entries(nodeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={cn('w-5 h-5 rounded flex items-center justify-center border', config.className)}>
                  {config.icon}
                </div>
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><ZoomIn size={14} /></Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><ZoomOut size={14} /></Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Maximize2 size={14} /></Button>
          </div>
        </div>
        
        <CardContent className="h-full p-0 overflow-auto bg-muted/20">
          <div className="min-w-[1200px] min-h-full p-8 relative">
            {/* Edges */}
            <svg className="absolute inset-0 pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
                </marker>
              </defs>
              {/* Draw edges between nodes */}
              <line x1="130" y1="120" x2="240" y2="120" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="350" y1="105" x2="440" y2="70" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="350" y1="135" x2="440" y2="170" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="530" y1="70" x2="640" y2="70" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="750" y1="70" x2="840" y2="70" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="930" y1="70" x2="1040" y2="70" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="530" y1="170" x2="640" y2="170" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="750" y1="150" x2="840" y2="90" stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </svg>

            {/* Nodes */}
            {lineageNodes.map((node) => {
              const config = nodeConfig[node.type as keyof typeof nodeConfig];
              return (
                <div
                  key={node.id}
                  className={cn(
                    'absolute px-3 py-2 rounded-lg border cursor-pointer hover:scale-105 transition-transform',
                    config.className
                  )}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <span className="text-xs font-medium text-foreground whitespace-nowrap">{node.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
