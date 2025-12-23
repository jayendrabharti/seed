'use client';
import PageTitle from '@/components/main/PageTitle';
import ProductsTable from '@/components/inventory/ProductsTable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLinkIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { useCategories } from '@/providers/CategoriesProvider';
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { clientTrpc } from '@seed/api/client';
import { useBusiness } from '@/providers/BusinessProvider';

export default function InventoryPage() {
  const { activeBusiness } = useBusiness();
  const { categories } = useCategories();
  const { data: itemsCount } = clientTrpc.inventory.getProductCount.useQuery({
    businessId: activeBusiness?.id ?? '',
  });

  const inventoryData: {
    name: string;
    value: number | string | React.ReactNode;
    link?: string;
  }[] = [
    {
      name: 'Items',
      value: itemsCount ?? <Spinner className="size-10" />,
    },
    {
      name: 'Categories',
      value: categories?.length ?? <Spinner className="size-10" />,
      link: '/inventory/categories',
    },
  ];

  return (
    <>
      <div className="flex flex-row items-center justify-between px-3">
        <PageTitle />
        <Link href="/inventory/add_item">
          <Button>
            <PlusIcon />
            Add Item
          </Button>
        </Link>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3 lg:grid-cols-4">
        {inventoryData.map((data, index) => (
          <Card key={index} className="mb-4 flex-1">
            <CardContent>
              <CardTitle>{data.name}</CardTitle>
              <CardDescription className="flex w-full flex-row text-2xl font-extrabold">
                {data.value}
                {data.link && (
                  <Link className="ml-auto" href={data.link}>
                    <Button variant={'outline'}>
                      <ExternalLinkIcon />
                    </Button>
                  </Link>
                )}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProductsTable />
    </>
  );
}
