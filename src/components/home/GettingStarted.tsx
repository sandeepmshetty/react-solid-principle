interface CommandSection {
  title: string;
  commands: { description: string; command: string }[];
}

const commandSections: CommandSection[] = [
  {
    title: 'Development Commands',
    commands: [
      { description: 'Start development server', command: 'npm run dev' },
      { description: 'Build for production', command: 'npm run build' },
      { description: 'Run tests', command: 'npm run test' },
      { description: 'Run linting', command: 'npm run lint' },
    ],
  },
  {
    title: 'Quality Commands',
    commands: [
      { description: 'TypeScript check', command: 'npm run type-check' },
      { description: 'Code complexity', command: 'npm run complexity' },
      { description: 'Bundle analysis', command: 'npm run analyze' },
      { description: 'Security audit', command: 'npm run audit' },
    ],
  },
];

export function GettingStarted(): JSX.Element {
  return (
    <div className='rounded-lg bg-blue-50 p-6'>
      <h2 className='mb-4 text-2xl font-bold text-blue-900'>
        Getting Started
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {commandSections.map((section) => (
          <div key={section.title}>
            <h3 className='mb-2 font-semibold text-blue-800'>
              {section.title}
            </h3>
            <div className='rounded bg-blue-100 p-3 font-mono text-sm'>
              {section.commands.map((cmd) => (
                <div key={cmd.command}>
                  {cmd.command} # {cmd.description}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
