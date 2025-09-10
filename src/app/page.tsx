'use client';

import { FeatureGrid, GettingStarted, HeroSection } from '@/components/home';

export default function HomePage(): JSX.Element {
  return (
    <div className='space-y-12'>
      <HeroSection />
      <FeatureGrid />
      <GettingStarted />
    </div>
  );
}
