import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface FeatureCard {
  title: string;
  description: string;
  items: string[];
}

const featureCards: FeatureCard[] = [
  {
    title: '🏗️ SOLID Principles',
    description: 'Complete implementation of all SOLID principles with practical examples:',
    items: [
      'Single Responsibility Principle',
      'Open/Closed Principle',
      'Liskov Substitution Principle',
      'Interface Segregation Principle',
      'Dependency Inversion Principle',
    ],
  },
  {
    title: '🔧 Code Quality',
    description: 'Advanced tooling for maintaining high code standards:',
    items: [
      'TypeScript strict mode',
      'ESLint with custom rules',
      'Prettier code formatting',
      'Husky git hooks',
      'Automated testing',
    ],
  },
  {
    title: '🧪 Testing Framework',
    description: 'Comprehensive testing strategy with multiple approaches:',
    items: [
      'Unit tests with Jest',
      'Component testing',
      'Integration testing',
      'E2E testing with Playwright',
      'High coverage requirements',
    ],
  },
  {
    title: '📊 Monitoring & Analysis',
    description: 'Sophisticated tools for code analysis and monitoring:',
    items: [
      'Bundle analysis',
      'Performance monitoring',
      'Code complexity metrics',
      'Dependency analysis',
      'Security scanning',
    ],
  },
  {
    title: '⚡ Architecture Patterns',
    description: 'Enterprise-grade architectural patterns and practices:',
    items: [
      'Clean Architecture',
      'Dependency Injection',
      'Repository Pattern',
      'Strategy Pattern',
      'Observer Pattern',
    ],
  },
  {
    title: '🚀 Development Tools',
    description: 'Modern development tooling for enhanced productivity:',
    items: [
      'VS Code workspace config',
      'Debug configurations',
      'Task automation',
      'CI/CD pipeline templates',
      'Docker containerization',
    ],
  },
];

export function FeatureGrid(): JSX.Element {
  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
      {featureCards.map((feature) => (
        <Card key={feature.title}>
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600'>{feature.description}</p>
            <ul className='mt-2 space-y-1 text-sm text-gray-500'>
              {feature.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
