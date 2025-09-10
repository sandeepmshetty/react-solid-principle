// Open/Closed Principle (OCP) - LoadingButton extends Button functionality

import { Button, type ButtonProps } from './Button';
import { Spinner } from './Spinner';

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  ...props
}: LoadingButtonProps): JSX.Element {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Spinner className='mr-2 h-4 w-4' />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
