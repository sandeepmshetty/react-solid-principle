import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface DesignPattern {
  name: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

/**
 * Enterprise design patterns showcase component
 * Follows Single Responsibility Principle - only displays design patterns info
 */
export function DesignPatterns(): JSX.Element {
  const architecturalPatterns: DesignPattern[] = [
    {
      name: 'CQRS (Command Query Responsibility Segregation)',
      description:
        'Separate read and write operations for optimal performance and scalability',
      color: 'text-blue-700',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Domain-Driven Design',
      description:
        'Business logic encapsulated in domain entities with clear boundaries',
      color: 'text-green-700',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Event Sourcing',
      description:
        'Domain events capture state changes for audit trails and eventual consistency',
      color: 'text-purple-700',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const implementationPatterns: DesignPattern[] = [
    {
      name: 'Repository Pattern',
      description:
        'Abstract data access with clean interfaces and multiple implementations',
      color: 'text-yellow-700',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Result Pattern',
      description:
        'Type-safe error handling without exceptions for better control flow',
      color: 'text-red-700',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Specification Pattern',
      description:
        'Encapsulate business rules in reusable, composable specifications',
      color: 'text-indigo-700',
      borderColor: 'border-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  const renderPatterns = (patterns: DesignPattern[], title: string) => (
    <div>
      <h3 className='mb-4 text-lg font-bold text-gray-800'>{title}</h3>
      <div className='space-y-4'>
        {patterns.map(pattern => (
          <div
            key={pattern.name}
            className={`rounded border-l-4 ${pattern.borderColor} ${pattern.bgColor} p-3`}
          >
            <h4 className={`font-semibold ${pattern.color}`}>{pattern.name}</h4>
            <p className={`text-sm ${pattern.color.replace('700', '600')}`}>
              {pattern.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Enterprise Design Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {renderPatterns(architecturalPatterns, 'Architectural Patterns')}
          {renderPatterns(implementationPatterns, 'Implementation Patterns')}
        </div>
      </CardContent>
    </Card>
  );
}
