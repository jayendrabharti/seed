'use client';
import { createContext, useContext, ReactNode } from 'react';
import { AppRouterOutputType } from '../../server';
import { clientTrpc } from '@seed/api/client';
import { useBusiness } from './BusinessProvider';

type Category =
  AppRouterOutputType['category']['getCategoriesByBusinessId'][number];

type CategoriesContextType = {
  categories: Category[] | null;
  isLoading: boolean;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { currentBusinessMembership } = useBusiness();
  const businessId = currentBusinessMembership?.business.id;

  const { data, isLoading } =
    clientTrpc.category.getCategoriesByBusinessId.useQuery(
      businessId ? { businessId } : ({} as { businessId: string }),
    );
  const categories = data ?? null;

  return (
    <CategoriesContext.Provider value={{ categories, isLoading }}>
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
