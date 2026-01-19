import { cn } from '../../lib/utils';
import { Button } from './Button';
import { FolderOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} leftIcon={<Plus size={16} />}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
