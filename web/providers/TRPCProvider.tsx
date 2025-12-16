'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TRPCProvider as TRPCClientProvider } from '@seed/api/provider';
import { AlertCircleIcon, RefreshCcw } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

export function TRPCProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [serverOK, setServerOK] = useState<boolean>(true);
  const [checking, startChecking] = useTransition();

  const checkServer = async () => {
    startChecking(async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/health',
        );
        if (response.ok) {
          setServerOK(true);
        } else {
          setServerOK(false);
        }
      } catch (error) {
        setServerOK(false);
      }
    });
  };

  useEffect(() => {
    checkServer();
  }, []);

  if (!serverOK)
    return (
      <main className="flex h-screen w-full items-center justify-center">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <AlertCircleIcon className="text-destructive h-12 w-12" />
            <div>
              <span className="text-destructive text-2xl font-bold">
                Server not working
              </span>
              <p className="text-muted-foreground">Contact the developer.</p>
            </div>
            <Button onClick={checkServer}>
              <RefreshCcw className={checking ? 'animate-spin' : ''} />
              {checking ? 'Retrying...' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      </main>
    );

  return <TRPCClientProvider>{children}</TRPCClientProvider>;
}
