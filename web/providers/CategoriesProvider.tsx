'use client';
import { createContext, useContext, ReactNode } from 'react';
import { AppRouterOutputType } from '../../server';
import { clientTrpc } from '@seed/api/client';
import { useBusiness } from './BusinessProvider';

export type Category =
  AppRouterOutputType['category']['getCategoriesByBusinessId'][number];

type CategoriesContextType = {
  categories: Category[] | undefined;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { currentBusinessMembership } = useBusiness();
  const businessId = currentBusinessMembership?.business.id;

  const {
    data: categories,
    isLoading,
    refetch,
  } = clientTrpc.category.getCategoriesByBusinessId.useQuery(
    businessId ? { businessId } : ({} as { businessId: string }),
  );

  const refresh = async () => {
    await refetch();
  };

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, refresh }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
