'use client';

import { ArchitectureLayers } from '@/components/architecture/ArchitectureLayers';
import { DependencyInjectionContainer } from '@/components/architecture/DependencyInjectionContainer';
import { DesignPatterns } from '@/components/architecture/DesignPatterns';
import { ProjectStructure } from '@/components/architecture/ProjectStructure';
import { SOLIDImplementation } from '@/components/architecture/SOLIDImplementation';
import { TestingStrategy } from '@/components/architecture/TestingStrategy';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';

/**
 * Architecture page component - follows Single Responsibility Principle
 * Responsibility: Orchestrate architecture documentation components
 */
export default function ArchitecturePage(): JSX.Element {
  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold text-gray-900'>
          Enterprise Architecture
        </h1>
        <p className='mx-auto max-w-3xl text-xl text-gray-600'>
          Comprehensive overview of our modular, SOLID-compliant architecture
          implementing Domain-Driven Design, CQRS, Event Sourcing, and
          enterprise patterns.
        </p>
      </div>

      <ArchitectureLayers />
      <SOLIDImplementation />
      <DesignPatterns />
      <DependencyInjectionContainer />
      <TestingStrategy />
      <ProjectStructure />
    </div>
  );
}
