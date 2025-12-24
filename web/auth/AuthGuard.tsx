'use client';

import Unauthenticated from '@/components/auth/Unauthenticated';
import { Spinner } from '@/components/ui/spinner';
import { SessionContextType, useSession } from '@/providers/SessionProvider';
import { LoaderCircleIcon } from 'lucide-react';

export default function AuthGuard({
  children,
  fallback = Unauthenticated,
  title,
  description,
}: {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ title?: string; description?: string }>;
  title?: string;
  description?: string;
}) {
  const { user, status }: SessionContextType = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
        <Spinner className="size-14" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user || status !== 'authenticated') {
    const Fallback = fallback;
    return <Fallback title={title} description={description} />;
  }

  return <>{children}</>;
}
