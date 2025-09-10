import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ArchitectureLayer {
  name: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  sections: {
    title: string;
    items: string[];
  }[];
  path: string;
}

/**
 * Architecture layers visualization component
 * Follows Single Responsibility Principle - only displays architecture layers
 */
export function ArchitectureLayers(): JSX.Element {
  const layers: ArchitectureLayer[] = [
    {
      name: 'Domain Layer',
      description: 'Pure business logic, isolated from infrastructure concerns',
      color: 'text-blue-800',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      sections: [
        {
          title: 'Entities',
          items: [
            'UserEntity - Core user business object',
            'Value Objects - Email, UserId',
            'Domain Events - UserCreated, UserDeactivated',
          ],
        },
        {
          title: 'Repository Interfaces',
          items: [
            'IUserRepository - Data access contract',
            'IUserReader - Query interface',
            'IUserWriter - Command interface',
          ],
        },
      ],
      path: 'src/domain/user/',
    },
    {
      name: 'Application Layer',
      description: 'Orchestrates business workflows and use cases',
      color: 'text-green-800',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      sections: [
        {
          title: 'CQRS Commands',
          items: [
            'CreateUserCommand - User creation',
            'DeactivateUserCommand - User deactivation',
            'Command Handlers - Business logic execution',
          ],
        },
        {
          title: 'CQRS Queries',
          items: [
            'GetUsersQuery - User listing',
            'GetUserByIdQuery - Single user retrieval',
            'Read Models - Optimized for queries',
          ],
        },
      ],
      path: 'src/application/',
    },
    {
      name: 'Infrastructure Layer',
      description: 'Concrete implementations and external concerns',
      color: 'text-purple-800',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      sections: [
        {
          title: 'Persistence',
          items: [
            'HttpUserRepository',
            'InMemoryUserRepository',
            'Data mappers',
          ],
        },
        {
          title: 'Event System',
          items: [
            'EventBus implementation',
            'Event handlers',
            'Retry mechanisms',
          ],
        },
        {
          title: 'Cross-cutting',
          items: ['Logging services', 'HTTP clients', 'IoC Container'],
        },
      ],
      path: 'src/infrastructure/',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏗️ Architecture Layers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {layers.map(layer => (
            <div
              key={layer.name}
              className={`rounded-lg border-2 ${layer.borderColor} ${layer.bgColor} p-4`}
            >
              <h3 className={`mb-3 text-xl font-bold ${layer.color}`}>
                {layer.name}
              </h3>
              <p className={`mb-4 ${layer.color.replace('800', '700')}`}>
                {layer.description}
              </p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {layer.sections.map(section => (
                  <div key={section.title}>
                    <h4
                      className={`font-semibold ${layer.color.replace('800', '600')}`}
                    >
                      {section.title}
                    </h4>
                    <ul
                      className={`text-sm ${layer.color.replace('800', '600')} space-y-1`}
                    >
                      {section.items.map(item => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div
                className={`mt-4 text-xs ${layer.color.replace('800', '500')}`}
              >
                📁 {layer.path}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
