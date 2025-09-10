import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

/**
 * Dependency injection container showcase component
 * Follows Single Responsibility Principle - only displays DI container info
 */
export function DependencyInjectionContainer(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔌 Dependency Injection Container</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-3 text-lg font-bold text-gray-800'>
            Advanced IoC Container Features
          </h3>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h4 className='mb-2 font-semibold text-gray-700'>
                Lifecycle Management
              </h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• Singleton: Single instance per container</li>
                <li>• Transient: New instance per request</li>
                <li>• Factory: Custom creation logic</li>
                <li>• Environment-specific configurations</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-2 font-semibold text-gray-700'>
                Registration Types
              </h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• Interface to implementation binding</li>
                <li>• Factory function registration</li>
                <li>• Conditional registration by environment</li>
                <li>• Type-safe symbol-based keys</li>
              </ul>
            </div>
          </div>
          <div className='mt-4 rounded bg-white p-3 font-mono text-sm text-gray-700'>
            <div className='text-green-600'>{'//'} Example registration</div>
            <div>container.bindSingleton(TYPES.UserRepository, () =&gt;</div>
            <div>&nbsp;&nbsp;new HttpUserRepository(httpClient, logger)</div>
            <div>);</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
