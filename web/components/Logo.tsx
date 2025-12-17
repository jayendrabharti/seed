'use client';
import { cn } from '@/lib/utils';
import { appName } from '@/utils/data';
import Link from 'next/link';
import { anurati } from '@/utils/fonts';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href={'/'}
      className={cn(
        'text-foreground text-xl font-bold',
        anurati.className,
        className,
      )}
    >
      {appName}
    </Link>
  );
}
