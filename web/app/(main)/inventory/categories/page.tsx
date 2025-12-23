'use client';
import AddCategory from '@/components/inventory/category/AddCategory';
import PageTitle from '@/components/main/PageTitle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useCategories } from '@/providers/CategoriesProvider';
import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories();

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
          <div
            key={category.id}
            className="border-border flex flex-1 items-center justify-between gap-2 rounded-md border p-4 text-lg font-medium"
          >
            <span>
              {index + 1}. {category.name}
            </span>
            <Link href={`/inventory?categoryId=${category.id}`}>
              <Button variant={'outline'} className="">
                <ExternalLinkIcon />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
