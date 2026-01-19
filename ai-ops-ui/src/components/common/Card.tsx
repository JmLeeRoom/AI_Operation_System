import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
  glow?: boolean;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, hover, gradient, glow }: CardProps) {
  return (
    <div className={cn(
      'rounded-xl glass transition-all duration-300',
      hover && 'card-hover cursor-pointer',
      gradient && `stat-gradient-${gradient}`,
      glow && 'glow',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  );
}
