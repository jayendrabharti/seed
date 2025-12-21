import PageTitle from '@/components/main/PageTitle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
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
    </>
  );
}
