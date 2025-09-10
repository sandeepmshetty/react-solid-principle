export function HeroSection(): JSX.Element {
  return (
    <div className='text-center'>
      <div className='mb-6'>
        <h1 className='mb-4 text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent'>
          Enterprise React TypeScript Workspace
        </h1>
        <div className='mx-auto h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full'></div>
      </div>
      <p className='mx-auto max-w-3xl text-xl text-gray-700 leading-relaxed'>
        A comprehensive demonstration of SOLID principles, clean architecture,
        advanced code quality tools, and enterprise-grade development
        standards.
      </p>
    </div>
  );
}
