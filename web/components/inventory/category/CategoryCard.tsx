import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Category } from '@/providers/CategoriesProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLinkIcon, PackageIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

export default function CategoryCard({
  className = '',
  category,
  handleDelete,
  sno,
}: {
  className?: string;
  category: Category;
  handleDelete?: () => Promise<void>;
  sno: number;
}) {
  const [isDeleting, startDeleting] = useTransition();

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'border-border flex w-60 flex-col items-center justify-between gap-2 rounded-md border p-4 text-lg font-medium',
          className,
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <span className="w-full text-left">
          {sno}. {category.name}
        </span>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            variant={'destructive'}
            onClick={() => startDeleting(async () => await handleDelete?.())}
          >
            {isDeleting ? <Spinner /> : <Trash2Icon />}
          </Button>
          <Link
            href={`/inventory?categoryId=${category.id}`}
            className="flex w-full"
          >
            <Button>
              <PackageIcon />
              {category._count.products}
              <ExternalLinkIcon />
            </Button>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
