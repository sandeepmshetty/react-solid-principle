// Simple UI components demonstrating SOLID principles

import { ReactNode } from 'react';

// ✅ SRP: Each component has a single responsibility
export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className || ''}`}
    >
      {children}
    </div>
  );
}

// Export ErrorDisplay component
export { ErrorDisplay } from './ErrorDisplay';

export function CardHeader({ children, className }: CardProps): JSX.Element {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps): JSX.Element {
  return (
    <h3
      className={`text-2xl font-bold leading-none tracking-tight text-gray-900 ${className || ''}`}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardProps): JSX.Element {
  return <div className={`p-6 pt-2 ${className || ''}`}>{children}</div>;
}

// ✅ SRP: Button component only handles button behavior
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps): JSX.Element {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
