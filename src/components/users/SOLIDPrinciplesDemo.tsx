import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface SOLIDPrinciple {
  title: string;
  color: string;
  description: string;
  examples: string[];
}

/**
 * SOLID principles demonstration component
 * Follows Single Responsibility Principle - only displays SOLID principles info
 */
export function SOLIDPrinciplesDemo(): JSX.Element {
  const principles: SOLIDPrinciple[] = [
    {
      title: 'Single Responsibility Principle',
      color: 'text-blue-600',
      description: 'Each service has one responsibility:',
      examples: [
        'UserApplicationService: Orchestrates use cases',
        'CreateUserCommand: Represents user creation',
        'UserRepository: Handles data persistence',
      ],
    },
    {
      title: 'Dependency Inversion Principle',
      color: 'text-green-600',
      description: 'High-level modules depend on abstractions:',
      examples: [
        'Application depends on Domain interfaces',
        'Infrastructure implements the interfaces',
        'IoC Container manages dependencies',
      ],
    },
    {
      title: 'Open/Closed Principle',
      color: 'text-purple-600',
      description: 'System is extensible without modification:',
      examples: [
        'New commands can be added easily',
        'New event handlers extend behavior',
        'Repository implementations are swappable',
      ],
    },
    {
      title: 'Interface Segregation Principle',
      color: 'text-yellow-600',
      description: 'Focused, specific interfaces:',
      examples: [
        'UserReader vs UserWriter separation',
        'Command vs Query interfaces',
        'Event-specific handlers',
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 SOLID Principles in This Page</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-6 text-sm md:grid-cols-2'>
          {principles.map(principle => (
            <div key={principle.title}>
              <h4 className={`font-semibold ${principle.color} mb-2`}>
                {principle.title}
              </h4>
              <p className='mb-2 text-gray-600'>{principle.description}</p>
              <ul className='space-y-1 text-gray-500'>
                {principle.examples.map(example => (
                  <li key={example}>• {example}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
