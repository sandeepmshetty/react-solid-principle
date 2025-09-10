import { ServiceProvider } from '@/providers/service-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enterprise React TypeScript - SOLID Principles',
  description:
    'A comprehensive workspace demonstrating SOLID principles, clean architecture, and enterprise-grade development standards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ServiceProvider>
          <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
            <header className='border-b bg-white shadow-lg backdrop-blur-sm'>
              <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                  <div className='flex items-center'>
                    <h1 className='text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                      Enterprise React TypeScript
                    </h1>
                  </div>
                  <nav className='flex space-x-8'>
                    <Link
                      href='/'
                      className='rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
                    >
                      Dashboard
                    </Link>
                    <Link
                      href='/users'
                      className='rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
                    >
                      Users
                    </Link>
                    <Link
                      href='/architecture'
                      className='rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
                    >
                      Architecture
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
              {children}
            </main>
          </div>
        </ServiceProvider>
      </body>
    </html>
  );
}
