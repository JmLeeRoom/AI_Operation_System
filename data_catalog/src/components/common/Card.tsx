import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card = ({ children, className = '', hover = false, glow = false }: CardProps) => (
  <div className={`
    glass-card p-6
    ${hover ? 'hover-card' : ''}
    ${glow ? 'animate-glow' : ''}
    ${className}
  `}>
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
  iconColor?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon,
  iconColor = 'bg-brand-500/20 text-brand-400'
}: StatCardProps) => (
  <Card hover className="relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        {change && (
          <p className={`mt-2 text-sm font-medium ${
            changeType === 'positive' ? 'text-emerald-400' :
            changeType === 'negative' ? 'text-rose-400' :
            'text-slate-400'
          }`}>
            {changeType === 'positive' && '↑ '}
            {changeType === 'negative' && '↓ '}
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${iconColor}`}>
        {icon}
      </div>
    </div>
    {/* 데코레이션 */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/10 to-transparent blur-2xl" />
  </Card>
);

interface DataCardProps {
  title: string;
  subtitle?: string;
  badges?: { label: string; color: string }[];
  meta?: { label: string; value: string }[];
  onClick?: () => void;
}

export const DataCard = ({ title, subtitle, badges, meta, onClick }: DataCardProps) => (
  <Card hover className="cursor-pointer group" onClick={onClick}>
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white group-hover:text-brand-400 transition-colors truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, idx) => (
            <span key={idx} className={`badge badge-${badge.color}`}>
              {badge.label}
            </span>
          ))}
        </div>
      )}
      
      {meta && meta.length > 0 && (
        <div className="pt-3 border-t border-slate-700/50 grid grid-cols-2 gap-2">
          {meta.map((item, idx) => (
            <div key={idx} className="text-sm">
              <span className="text-slate-500">{item.label}: </span>
              <span className="text-slate-300">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </Card>
);
