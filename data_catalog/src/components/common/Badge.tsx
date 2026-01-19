interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = ({ 
  children, 
  variant = 'slate', 
  size = 'sm',
  dot = false 
}: BadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`badge badge-${variant} ${sizeClasses[size]}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          variant === 'cyan' ? 'bg-cyan-400' :
          variant === 'emerald' ? 'bg-emerald-400' :
          variant === 'amber' ? 'bg-amber-400' :
          variant === 'rose' ? 'bg-rose-400' :
          variant === 'violet' ? 'bg-violet-400' :
          'bg-slate-400'
        }`} />
      )}
      {children}
    </span>
  );
};

interface TagListProps {
  tags: string[];
  max?: number;
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
}

export const TagList = ({ tags, max = 3, variant = 'cyan' }: TagListProps) => {
  const displayTags = tags.slice(0, max);
  const remaining = tags.length - max;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag, idx) => (
        <Badge key={idx} variant={variant}>{tag}</Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="slate">+{remaining}</Badge>
      )}
    </div>
  );
};

interface QualityBadgeProps {
  score: number;
}

export const QualityBadge = ({ score }: QualityBadgeProps) => {
  const getVariant = () => {
    if (score >= 90) return 'emerald';
    if (score >= 70) return 'amber';
    return 'rose';
  };

  return (
    <Badge variant={getVariant()} dot>
      Quality {score}%
    </Badge>
  );
};

interface PlatformBadgeProps {
  platform: 'snowflake' | 'bigquery' | 'postgresql' | 'mysql' | 'redshift' | 'databricks' | string;
}

export const PlatformBadge = ({ platform }: PlatformBadgeProps) => {
  const getConfig = () => {
    switch (platform.toLowerCase()) {
      case 'snowflake':
        return { label: 'Snowflake', variant: 'cyan' as const };
      case 'bigquery':
        return { label: 'BigQuery', variant: 'violet' as const };
      case 'postgresql':
        return { label: 'PostgreSQL', variant: 'emerald' as const };
      case 'mysql':
        return { label: 'MySQL', variant: 'amber' as const };
      case 'redshift':
        return { label: 'Redshift', variant: 'rose' as const };
      case 'databricks':
        return { label: 'Databricks', variant: 'rose' as const };
      default:
        return { label: platform, variant: 'slate' as const };
    }
  };

  const config = getConfig();
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
