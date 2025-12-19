'use client';

import { clientTrpc } from '@seed/api/client';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { toast } from 'sonner';
import { TRPCClientErrorLike } from '@seed/api';

type User = TrpcAppRouterOutputType['auth']['getUser'];

export interface SessionContextType {
  user: User | undefined;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isAuthenticated: boolean;
  error: TRPCClientErrorLike<TrpcAppRouter> | null;
  refreshSession: () => Promise<void>;
  logOut: (redirect?: boolean) => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: undefined,
  status: 'loading',
  isAuthenticated: false,
  error: null,
  refreshSession: async () => {},
  logOut: async () => {},
});

export default function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = clientTrpc.auth.getUser.useQuery(undefined, {
    retry: (failureCount, error) => {
      // Don't retry on UNAUTHORIZED errors - these are expected when user is not logged in
      if (error.data?.code === 'UNAUTHORIZED') {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const trpcUtils = clientTrpc.useUtils();

  const user = useMemo(() => {
    if (!userData) return null;

    return {
      ...userData,
      picture: userData.picture
        ? `${userData.picture}?ua=${userData.updatedAt.getTime()}`
        : null,
    };
  }, [userData]);

  const status: SessionContextType['status'] = useMemo(() => {
    if (isLoading) return 'loading';
    return user ? 'authenticated' : 'unauthenticated';
  }, [user, isLoading]);

  const logoutMutation = clientTrpc.auth.logout.useMutation();

  const logOut = useCallback(
    async (redirect: boolean = false) => {
      try {
        await logoutMutation.mutateAsync();
        toast.success('Signed out successfully');
        // await refetch();
        await trpcUtils.auth.getUser.reset();

        if (redirect) {
          router.push('/login');
        }
      } catch (error) {
        toast.error('Error signing out');
      }
    },
    [logoutMutation, router, trpcUtils.auth.getUser],
  );

  const refreshSession = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const contextValue: SessionContextType = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated' && user !== undefined,
      error,
      refreshSession,
      logOut,
    }),
    [user, status, error, refreshSession, logOut],
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
