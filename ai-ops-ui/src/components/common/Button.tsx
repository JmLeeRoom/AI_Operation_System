import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
  secondary: 'bg-secondary text-foreground hover:bg-secondary/80 border border-border',
  outline: 'border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/50',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/20',
  gradient: 'bg-gradient-to-r from-primary via-violet-500 to-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 bg-[length:200%_100%] animate-gradient',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
};

export function Button({
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className,
  glow,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none overflow-hidden',
        variantStyles[variant],
        sizeStyles[size],
        glow && 'btn-glow',
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
