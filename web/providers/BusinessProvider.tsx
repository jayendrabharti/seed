'use client';
import { createContext, Fragment, useContext, useMemo } from 'react';
import Loading from '@/app/loading';
import useLocalState from '@/hooks/useLocalState';
import { clientTrpc } from '@seed/api/client';
import { AppRouter, AppRouterOutputType } from '@seed/api/types';
import { TRPCClientErrorLike } from '@seed/api';
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

export type BusinessMemberships =
  AppRouterOutputType['business']['getBusinessesMemberships'][number];

type BusinessContextType = {
  activeBusiness: BusinessMemberships['business'] | undefined;
  businessMembershipId: string | null;
  businessMemberships: BusinessMemberships[] | undefined;
  currentBusinessMembership: BusinessMemberships | undefined;
  switchBusinessMembershipId: (args: { id: string }) => Promise<void>;
  error: TRPCClientErrorLike<AppRouter> | null;
  refetch: () => Promise<void>;
  renameBusiness: (args: { id: string; newName: string }) => Promise<void>;
  deleteBusiness: (args: { id: string }) => Promise<void>;
};

const BusinessContext = createContext<BusinessContextType>({
  businessMembershipId: null,
  activeBusiness: undefined,
  switchBusinessMembershipId: async () => {},
  currentBusinessMembership: undefined,
  businessMemberships: [],
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
  const [localBusinessMembershipId, setBusinessMembershipId] = useLocalState<
    string | null
  >('businessMembershipId', null);

  const {
    data: businessMemberships,
    isLoading,
    error,
    refetch,
  } = clientTrpc.business.getBusinessesMemberships.useQuery();

  const businessMembershipId = useMemo(() => {
    if (
      localBusinessMembershipId &&
      businessMemberships?.some((biz) => biz.id === localBusinessMembershipId)
    ) {
      return localBusinessMembershipId;
    }
    return businessMemberships?.[0]?.id ?? null;
  }, [localBusinessMembershipId, businessMemberships]);

  const renameMutation = clientTrpc.business.renameBusiness.useMutation();

  const deleteMutation = clientTrpc.business.deleteBusiness.useMutation();

  const switchBusinessMembershipId = async ({ id }: { id: string }) =>
    setBusinessMembershipId(id);

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

  const currentBusinessMembership = useMemo(
    () =>
      businessMemberships?.find((biz) => biz.id === businessMembershipId) ??
      businessMemberships?.[0],
    [businessMemberships, businessMembershipId],
  );

  const activeBusiness = useMemo(
    () => currentBusinessMembership?.business,
    [currentBusinessMembership],
  );

  if (isLoading || !businessMemberships) return <Loading />;

  return (
    <BusinessContext.Provider
      value={{
        activeBusiness,
        businessMembershipId,
        switchBusinessMembershipId,
        businessMemberships,
        currentBusinessMembership,
        error,
        refetch: handleRefetch,
        renameBusiness,
        deleteBusiness,
      }}
    >
      <Fragment key={businessMembershipId}>{children}</Fragment>
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
