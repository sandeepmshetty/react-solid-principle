'use client';

import { ServiceContext } from '@/contexts';
import { createDevelopmentContainer } from '@/services/container';
import { ReactNode, useMemo } from 'react';

export interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({
  children,
}: ServiceProviderProps): JSX.Element {
  // Create container on client side to avoid serialization issues
  const container = useMemo(() => createDevelopmentContainer(), []);

  return (
    <ServiceContext.Provider value={container}>
      {children}
    </ServiceContext.Provider>
  );
}
