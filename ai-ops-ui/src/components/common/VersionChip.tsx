import { cn } from '../../lib/utils';
import { GitCommit } from 'lucide-react';

interface VersionChipProps {
  version: string;
  hash?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function VersionChip({ version, hash, size = 'md', className }: VersionChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono rounded-md bg-secondary border border-border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className
      )}
    >
      <GitCommit size={size === 'sm' ? 12 : 14} className="text-primary" />
      <span className="text-foreground">{version}</span>
      {hash && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{hash.slice(0, 7)}</span>
        </>
      )}
    </span>
  );
}
