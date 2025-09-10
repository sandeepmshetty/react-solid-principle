// Single Responsibility Principle (SRP) - useAsyncState only manages async operation state

import { useCallback, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAsyncState<T>(
  initialData: T | null = null
): [AsyncState<T>, (promise: Promise<T>) => Promise<void>] {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await promise;
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  }, []);

  return [state, execute];
}
