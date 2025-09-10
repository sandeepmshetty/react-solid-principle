import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

/**
 * Architecture information display component
 * Follows Single Responsibility Principle - only displays architecture info
 */
export function ArchitectureInfo(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🏗️ Architecture in Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
          <div>
            <h4 className='font-semibold text-blue-600'>Domain Layer</h4>
            <p className='text-gray-600'>
              UserEntity, Domain Events, Repository Interfaces
            </p>
          </div>
          <div>
            <h4 className='font-semibold text-green-600'>Application Layer</h4>
            <p className='text-gray-600'>
              CQRS Commands/Queries, Application Services
            </p>
          </div>
          <div>
            <h4 className='font-semibold text-purple-600'>
              Infrastructure Layer
            </h4>
            <p className='text-gray-600'>
              Repository Implementations, Event Bus, IoC Container
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
