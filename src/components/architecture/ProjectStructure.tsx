import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

/**
 * Project structure showcase component
 * Follows Single Responsibility Principle - only displays project structure
 */
export function ProjectStructure(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📁 Project Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400'>
          <div>src/</div>
          <div>├── app/</div>
          <div>│ ├── layout.tsx</div>
          <div>│ ├── page.tsx</div>
          <div>│ ├── globals.css</div>
          <div>│ ├── users/</div>
          <div>│ │ └── page.tsx</div>
          <div>│ └── architecture/</div>
          <div>│ └── page.tsx</div>
          <div>├── domain/</div>
          <div>│ ├── index.ts</div>
          <div>│ └── user/</div>
          <div>│ ├── index.ts</div>
          <div>│ ├── entities.ts</div>
          <div>│ ├── events.ts</div>
          <div>│ └── repository.ts</div>
          <div>├── application/</div>
          <div>│ ├── index.ts</div>
          <div>│ ├── cqrs.ts</div>
          <div>│ ├── buses.ts</div>
          <div>│ ├── commands/</div>
          <div>│ │ └── user.commands.ts</div>
          <div>│ ├── queries/</div>
          <div>│ │ └── user.queries.ts</div>
          <div>│ └── services/</div>
          <div>│ └── user.application-service.ts</div>
          <div>├── infrastructure/</div>
          <div>│ ├── index.ts</div>
          <div>│ ├── container/</div>
          <div>│ │ └── container.ts</div>
          <div>│ ├── events/</div>
          <div>│ │ └── event-bus.ts</div>
          <div>│ ├── http/</div>
          <div>│ │ └── interfaces.ts</div>
          <div>│ ├── logging/</div>
          <div>│ │ └── interfaces.ts</div>
          <div>│ └── persistence/</div>
          <div>│ └── user.repository.ts</div>
          <div>├── components/</div>
          <div>│ ├── ui/</div>
          <div>│ │ ├── index.tsx</div>
          <div>│ │ ├── button.tsx</div>
          <div>│ │ └── ErrorDisplay.tsx</div>
          <div>│ ├── users/</div>
          <div>│ │ ├── UserForm.tsx</div>
          <div>│ │ ├── UserList.tsx</div>
          <div>│ │ ├── ArchitectureInfo.tsx</div>
          <div>│ │ └── SOLIDPrinciplesDemo.tsx</div>
          <div>│ └── architecture/</div>
          <div>│ ├── ArchitectureLayers.tsx</div>
          <div>│ ├── DesignPatterns.tsx</div>
          <div>│ ├── DependencyInjectionContainer.tsx</div>
          <div>│ ├── ProjectStructure.tsx</div>
          <div>│ ├── SOLIDImplementation.tsx</div>
          <div>│ └── TestingStrategy.tsx</div>
          <div>├── hooks/</div>
          <div>│ ├── index.ts</div>
          <div>│ └── useUserManagement.ts</div>
          <div>├── services/</div>
          <div>│ ├── container.ts</div>
          <div>│ ├── http-client.ts</div>
          <div>│ ├── interfaces.ts</div>
          <div>│ ├── logger.ts</div>
          <div>│ ├── user.service.ts</div>
          <div>│ └── __tests__/</div>
          <div>│ └── logger.test.ts</div>
          <div>├── providers/</div>
          <div>│ └── service-provider.tsx</div>
          <div>├── contexts/</div>
          <div>│ └── index.ts</div>
          <div>└── types/</div>
          <div> └── index.ts</div>
        </div>
      </CardContent>
    </Card>
  );
}
