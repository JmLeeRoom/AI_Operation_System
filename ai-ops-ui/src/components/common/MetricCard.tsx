import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div className={cn('p-4 rounded-lg bg-card border border-border', className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
        {icon && (
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      
      {(trend || subtitle) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && trendValue && (
            <span className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend === 'up' && 'text-emerald-400',
              trend === 'down' && 'text-red-400',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              {trend === 'up' && <TrendingUp size={12} />}
              {trend === 'down' && <TrendingDown size={12} />}
              {trend === 'neutral' && <Minus size={12} />}
              {trendValue}
            </span>
          )}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
