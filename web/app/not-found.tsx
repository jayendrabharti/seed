import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BanIcon, HomeIcon, LayoutDashboardIcon } from 'lucide-react';

export default async function NotFound() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center space-y-5">
      <BanIcon className="text-destructive size-20 font-bold" />
      <div className="flex flex-col items-center">
        <span className="text-destructive text-4xl font-extrabold">
          Not found
        </span>
        <span className="text-muted-foreground">This page does not exist.</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant={'outline'} className="active:scale-90">
          <HomeIcon className="size-4" />
          <Link href={'/'} prefetch={true}>
            Homepage
          </Link>
        </Button>
        <Button variant={'outline'} className="active:scale-90">
          <LayoutDashboardIcon className="size-4" />
          <Link href={'/dashboard'} prefetch={true}>
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
