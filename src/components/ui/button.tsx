interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const cls = `btn-${variant}${className ? ` ${className}` : ''}`;
  return (
    <button className={cls} style={size === 'sm' ? { padding: '6px 16px', fontSize: '0.8rem' } : size === 'lg' ? { padding: '14px 32px', fontSize: '1rem' } : {}} {...props}>
      {children}
    </button>
  );
}
