import { Loader2Icon, Trash2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DeleteDialogButton({
  onDelete,
  className = '',
}: {
  onDelete: () => Promise<void>;
  className?: string;
}) {
  const [deleting, startDeleting] = useTransition();

  const handleDelete = async () => {
    startDeleting(async () => {
      await onDelete();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'} className={className}>
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Delete Business</DialogTitle>
        </DialogHeader>
        <span>{'Are you sure you want to delete this business?'}</span>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant={'destructive'} onClick={handleDelete}>
            {deleting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Trash2Icon />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
