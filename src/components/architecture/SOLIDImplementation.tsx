import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface SOLIDPrinciple {
  name: string;
  color: string;
  borderColor: string;
  description: string;
  examples: string[];
}

/**
 * SOLID principles implementation showcase component
 * Follows Single Responsibility Principle - only displays SOLID implementation details
 */
export function SOLIDImplementation(): JSX.Element {
  const principles: SOLIDPrinciple[] = [
    {
      name: 'Single Responsibility',
      color: 'text-blue-600',
      borderColor: 'border-blue-200',
      description: 'Each class has one reason to change',
      examples: [
        'UserEntity: User business rules',
        'UserRepository: Data persistence',
        'CreateUserCommand: User creation logic',
        'Logger: Logging concerns only',
      ],
    },
    {
      name: 'Open/Closed',
      color: 'text-green-600',
      borderColor: 'border-green-200',
      description: 'Open for extension, closed for modification',
      examples: [
        'New repositories via interfaces',
        'Additional event handlers',
        'Extended command/query types',
        'Plugin-based architecture',
      ],
    },
    {
      name: 'Liskov Substitution',
      color: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      description: 'Subtypes must be substitutable',
      examples: [
        'All IUserRepository implementations',
        'Command handler polymorphism',
        'Event handler substitution',
        'Service implementations',
      ],
    },
    {
      name: 'Interface Segregation',
      color: 'text-red-600',
      borderColor: 'border-red-200',
      description: 'Clients depend only on what they use',
      examples: [
        'IUserReader vs IUserWriter',
        'Specific command interfaces',
        'Focused event contracts',
        'Minimal service contracts',
      ],
    },
    {
      name: 'Dependency Inversion',
      color: 'text-purple-600',
      borderColor: 'border-purple-200',
      description: 'Depend on abstractions, not concretions',
      examples: [
        'Application → Domain interfaces',
        'Infrastructure → Application abstractions',
        'IoC Container manages dependencies',
        'Runtime dependency injection',
      ],
    },
    {
      name: 'Bonus: Clean Architecture',
      color: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      description: 'Dependencies point inward',
      examples: [
        'Domain at the center',
        'Application surrounds Domain',
        'Infrastructure at the edges',
        'UI depends on Application',
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 SOLID Principles Implementation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {principles.map(principle => (
            <div
              key={principle.name}
              className={`rounded-lg border ${principle.borderColor} p-4`}
            >
              <h3 className={`mb-3 text-lg font-bold ${principle.color}`}>
                {principle.name}
              </h3>
              <p className='mb-3 text-sm text-gray-600'>
                {principle.description}
              </p>
              <ul className='space-y-1 text-sm text-gray-700'>
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
