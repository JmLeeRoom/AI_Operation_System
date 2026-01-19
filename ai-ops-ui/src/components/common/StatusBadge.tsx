import { cn } from '../../lib/utils';
import { Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, Pause, RotateCcw } from 'lucide-react';
import type { RunStatus, ModelStage } from '../../types';

type Status = RunStatus | ModelStage | string;

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  pulse?: boolean;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  // Run statuses
  QUEUED: { 
    label: 'Queued', 
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: <Clock size={12} />
  },
  RUNNING: { 
    label: 'Running', 
    className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    icon: <Loader2 size={12} className="animate-spin" />
  },
  SUCCEEDED: { 
    label: 'Succeeded', 
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: <CheckCircle2 size={12} />
  },
  FAILED: { 
    label: 'Failed', 
    className: 'bg-red-500/15 text-red-400 border-red-500/30',
    icon: <XCircle size={12} />
  },
  CANCELLED: { 
    label: 'Cancelled', 
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    icon: <XCircle size={12} />
  },
  CANCELED: { 
    label: 'Cancelled', 
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    icon: <XCircle size={12} />
  },
  SKIPPED: { 
    label: 'Skipped', 
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    icon: <Pause size={12} />
  },
  PAUSED: { 
    label: 'Paused', 
    className: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    icon: <Pause size={12} />
  },
  RETRYING: { 
    label: 'Retrying', 
    className: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    icon: <RotateCcw size={12} className="animate-spin" />
  },
  
  // Model stages
  dev: { 
    label: 'Development', 
    className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    icon: <Clock size={12} />
  },
  staging: { 
    label: 'Staging', 
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: <AlertTriangle size={12} />
  },
  production: { 
    label: 'Production', 
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: <CheckCircle2 size={12} />
  },
  archived: { 
    label: 'Archived', 
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    icon: <Clock size={12} />
  },
};

export function StatusBadge({ status, size = 'md', showIcon = true, pulse }: StatusBadgeProps) {
  const config = statusConfig[status] || { 
    label: status, 
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    icon: <Clock size={12} />
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium border transition-all',
      config.className,
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      pulse && (status === 'RUNNING' || status === 'RETRYING') && 'animate-pulse'
    )}>
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
