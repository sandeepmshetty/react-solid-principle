interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

/**
 * Reusable error display component
 * Follows Single Responsibility Principle - only handles error display
 */
export function ErrorDisplay({
  error,
  onDismiss,
}: ErrorDisplayProps): JSX.Element | null {
  if (!error) return null;

  return (
    <div className='rounded-md bg-red-50 p-4'>
      <div className='flex items-center justify-between'>
        <p className='text-red-800'>{error}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className='ml-4 text-red-600 hover:text-red-800'
            aria-label='Dismiss error'
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
