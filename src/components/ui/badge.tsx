interface BadgeProps {
  variant?: 'overdue' | 'warning' | 'success' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}
