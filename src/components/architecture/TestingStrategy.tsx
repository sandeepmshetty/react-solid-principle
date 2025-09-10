import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface TestingStrategy {
  name: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  items: string[];
}

/**
 * Testing strategy showcase component
 * Follows Single Responsibility Principle - only displays testing strategy info
 */
export function TestingStrategy(): JSX.Element {
  const strategies: TestingStrategy[] = [
    {
      name: 'Unit Tests',
      description: 'Isolated component testing',
      color: 'text-green-700',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      items: [
        'Domain entity logic',
        'Command/Query handlers',
        'Service layer methods',
        'Mock dependencies',
      ],
    },
    {
      name: 'Integration Tests',
      description: 'Component interaction testing',
      color: 'text-blue-700',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      items: [
        'Repository implementations',
        'Event bus functionality',
        'IoC container resolution',
        'End-to-end workflows',
      ],
    },
    {
      name: 'Contract Tests',
      description: 'Interface compliance testing',
      color: 'text-purple-700',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      items: [
        'Repository contracts',
        'Command handler interfaces',
        'Event handler contracts',
        'API compatibility',
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>🧪 Testing Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {strategies.map(strategy => (
            <div
              key={strategy.name}
              className={`rounded-lg border ${strategy.borderColor} ${strategy.bgColor} p-4`}
            >
              <h3 className={`mb-3 text-lg font-bold ${strategy.color}`}>
                {strategy.name}
              </h3>
              <p
                className={`mb-3 text-sm ${strategy.color.replace('700', '600')}`}
              >
                {strategy.description}
              </p>
              <ul className={`text-sm ${strategy.color} space-y-1`}>
                {strategy.items.map(item => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
