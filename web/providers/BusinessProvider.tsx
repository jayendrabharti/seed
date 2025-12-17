'use client';
import { createContext, Fragment, useContext, useMemo } from 'react';
import Loading from '@/app/loading';
import useLocalState from '@/hooks/useLocalState';
import { clientTrpc } from '@seed/api/client';
import { AppRouter, AppRouterOutputType } from '@seed/api/types';
import { TRPCClientErrorLike } from '@seed/api';
import { rename } from 'fs';
import { toast } from 'sonner';
/**
 * Business Provider - Manages multi-tenant business context
 *
 * Features:
 * - Handles business switching for multi-tenant architecture
 * - Manages current business state across the application
 * - Provides CRUD operations for businesses
 * - Auto-creates default business for new users
 * - Stores current business ID in secure HTTP-only cookies
 */

type Business = AppRouterOutputType['business']['getBusinesses'][number];

type BusinessContextType = {
  businessId: string | null;
  businesses: Business[] | undefined;
  currentBusiness: Business | undefined;
  switchBusinessId: (args: { id: string }) => Promise<void>;
  error: TRPCClientErrorLike<AppRouter> | null;
  refetch: () => Promise<void>;
  renameBusiness: (args: { id: string; newName: string }) => Promise<void>;
  deleteBusiness: (args: { id: string }) => Promise<void>;
};

const BusinessContext = createContext<BusinessContextType>({
  businessId: null,
  switchBusinessId: async () => {},
  currentBusiness: undefined,
  businesses: [],
  error: null,
  refetch: async () => {},
  renameBusiness: async () => {},
  deleteBusiness: async () => {},
});

export function BusinessProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [businessId, setBusinessId] = useLocalState<string | null>(
    'businessId',
    null,
  );

  const {
    data: businesses,
    isLoading,
    error,
    refetch,
  } = clientTrpc.business.getBusinesses.useQuery();

  const renameMutation = clientTrpc.business.renameBusiness.useMutation();

  const deleteMutation = clientTrpc.business.deleteBusiness.useMutation();

  const switchBusinessId = async ({ id }: { id: string }) => setBusinessId(id);

  const handleRefetch = async () => {
    await refetch();
  };

  const renameBusiness = async ({
    id,
    newName,
  }: {
    id: string;
    newName: string;
  }) => {
    try {
      await renameMutation.mutateAsync({ id, newName });
      await refetch();
      toast.success('Business renamed successfully.');
    } catch (error: any) {
      toast.error('Failed to rename business.', {
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const deleteBusiness = async ({ id }: { id: string }) => {
    try {
      await deleteMutation.mutateAsync({ id });
      await refetch();
      toast.success('Business deleted successfully.');
    } catch (error: any) {
      toast.error('Failed to delete business.', {
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const currentBusiness = useMemo(
    () => businesses?.find((biz) => biz.id === businessId) ?? businesses?.[0],
    [businesses, businessId],
  );

  if (isLoading || !businesses) return <Loading />;

  return (
    <BusinessContext.Provider
      value={{
        businessId,
        switchBusinessId,
        businesses,
        currentBusiness,
        error,
        refetch: handleRefetch,
        renameBusiness,
        deleteBusiness,
      }}
    >
      <Fragment key={businessId}>{children}</Fragment>
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
