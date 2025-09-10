// Single Responsibility Principle (SRP) - Input component only handles input rendering and validation

import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { forwardRef, useId } from 'react';

// ✅ SRP: Input variants for consistent styling
const inputVariants = cva(
  [
    'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm',
    'placeholder:text-gray-400 focus:outline-none focus:ring-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
        success: 'border-green-500 focus:ring-green-500 focus:border-green-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// ✅ SRP: Input component only handles input rendering and validation
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, className, id, variant, size, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    // ✅ DIP: Automatically determine variant based on error state
    const resolvedVariant = error ? 'error' : variant;

    return (
      <div className='space-y-2'>
        {label && (
          <label
            htmlFor={inputId}
            className='text-sm font-medium leading-none text-gray-700'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            inputVariants({ variant: resolvedVariant, size }),
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className='text-sm text-red-600'
            role='alert'
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className='text-sm text-gray-500'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
