// Single Responsibility Principle (SRP) - Card components each have single responsibility

import { clsx } from 'clsx';
import { type ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div
      className={clsx(
        'rounded-lg border bg-white text-gray-900 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps): JSX.Element {
  return (
    <div className={clsx('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps): JSX.Element {
  return (
    <h3
      className={clsx(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardProps): JSX.Element {
  return <div className={clsx('p-6 pt-0', className)}>{children}</div>;
}
