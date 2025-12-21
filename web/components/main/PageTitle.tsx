'use client';

import { usePathname } from 'next/navigation';
import RevealHero from '../animations/RevealHero';
import { getTitleFromSlug } from '@/utils';

export default function PageTitle() {
  const pathname = usePathname();
  const pageTitle = getTitleFromSlug(pathname.split('/').pop() || '');

  return (
    <RevealHero className="text-foreground text-3xl font-extrabold">
      {pageTitle}
    </RevealHero>
  );
}
