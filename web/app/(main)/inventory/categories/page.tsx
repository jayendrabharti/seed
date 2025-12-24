'use client';
import AddCategory from '@/components/inventory/category/AddCategory';
import CategoryCard from '@/components/inventory/category/CategoryCard';
import PageTitle from '@/components/main/PageTitle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useBusiness } from '@/providers/BusinessProvider';
import { useCategories } from '@/providers/CategoriesProvider';
import { TRPCClientError } from '@seed/api';
import { clientTrpc } from '@seed/api/client';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { categories, isLoading, refresh } = useCategories();
  const { activeBusiness } = useBusiness();

  const deleteCategoryMutation =
    clientTrpc.category.deleteCategory.useMutation();

  const handleDeleteCategory = async (categoryId: string) => {
    if (!activeBusiness) return;
    try {
      const { success } = await deleteCategoryMutation.mutateAsync({
        categoryId,
        businessId: activeBusiness.id,
      });

      if (success) {
        toast.success('Category deleted successfully');
        await refresh();
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error('Failed to delete category', {
          description: error.message,
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-row items-center gap-1 px-3">
        <Link href="/inventory">
          <Button variant={'ghost'}>
            <ArrowLeftIcon className="size-6" />
          </Button>
        </Link>
        <PageTitle />
        <AddCategory className="ml-auto" />
      </div>
      <Separator />
      {isLoading && <Spinner />}
      {!isLoading && categories && categories.length === 0 && (
        <p className="text-muted-foreground p-4 text-center">
          No categories found.
        </p>
      )}
      <div className="flex flex-row flex-wrap gap-4 p-4">
        {categories?.map((category, index) => (
          <CategoryCard
            key={category.id}
            sno={index + 1}
            category={category}
            handleDelete={async () => await handleDeleteCategory(category.id)}
          />
        ))}
      </div>
    </>
  );
}
