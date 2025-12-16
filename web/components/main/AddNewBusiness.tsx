'use client';
import { LoaderCircleIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useBusiness } from '@/providers/BusinessProvider';
import { cn } from '@/lib/utils';
import { clientTrpc } from '@seed/api/client';

export default function AddNewBusiness({
  className = '',
}: {
  className?: string;
}) {
  const { switchBusinessId, refetch } = useBusiness();
  const [open, setOpen] = useState<boolean>(false);
  const [newBusinessName, setNewBusinessName] = useState<string>('');
  const [adding, startAdding] = useTransition();
  const createNewBusinessMutation =
    clientTrpc.business.createNewBusiness.useMutation();

  const handleAddNewBusiness = async () => {
    startAdding(async () => {
      if (!newBusinessName) {
        toast.error('You must enter a Business.', {
          style: { background: '#ef4444', color: '#fff' },
        });
        return;
      }

      try {
        const newBusiness = await createNewBusinessMutation.mutateAsync({
          name: newBusinessName,
        });

        await refetch();

        await switchBusinessId({ id: newBusiness.id });

        toast.success(`Created Business: ${newBusiness.name}`);

        setOpen(false);
        setNewBusinessName('');
      } catch (error: any) {
        toast.error('Failed to create business.', {
          description: error.message || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn('w-full', className)}>
          <PlusIcon className="h-4 w-4" />
          Add new business
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Business</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            id="name"
            defaultValue=""
            placeholder="Enter New Business Name"
            onChange={(e) => setNewBusinessName(e.target.value)}
            className=""
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'destructive'}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddNewBusiness}>
            {adding ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
            {adding ? 'Creating Business...' : 'Create Business'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
