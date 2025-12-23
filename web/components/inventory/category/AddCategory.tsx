'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useBusiness } from '@/providers/BusinessProvider';
import { clientTrpc } from '@seed/api/client';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AddCategory({
  className = '',
}: {
  className?: string;
}) {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const utils = clientTrpc.useUtils();
  const { activeBusiness } = useBusiness();

  const createCategoryMutation = clientTrpc.category.createCategory.useMutation(
    {
      onSuccess: (newCategory: any) => {
        toast.success('Category created successfully!');
        utils.category.getCategoriesByBusinessId.invalidate();
        setIsCreatingCategory(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create category');
      },
    },
  );

  const handleCreateCategory = () => {
    if (!activeBusiness?.id) {
      toast.error('No active business selected');
      return;
    }

    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    createCategoryMutation.mutate({
      name: newCategoryName,
      businessId: activeBusiness.id,
      description: newCategoryDescription || undefined,
    });
  };

  return (
    <Dialog open={isCreatingCategory} onOpenChange={setIsCreatingCategory}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsCreatingCategory(true)}
          className={className}
        >
          <PlusIcon />
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category for your products
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category Name *</label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Enter category description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreatingCategory(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCategory}
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending && <Spinner />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
