import AddProductForm from '@/components/inventory/products/AddProductForm';
import PageTitle from '@/components/main/PageTitle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default function AddItemPage() {
  return (
    <>
      <div className="flex flex-row items-center gap-1 px-3">
        <Link href="/inventory">
          <Button variant={'ghost'}>
            <ArrowLeftIcon className="size-6" />
          </Button>
        </Link>
        <PageTitle />
      </div>
      <Separator />
      <AddProductForm />
    </>
  );
}
