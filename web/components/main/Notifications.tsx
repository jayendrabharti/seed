'use client';
import { BellIcon, ExternalLinkIcon } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Notifications({ className }: { className?: string }) {
  const [unread, setUnread] = useState(0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={'outline'}
          size={'icon'}
          className={cn('group relative rounded-full', className)}
        >
          <BellIcon className="group-hover:animate-ping" />
          <BellIcon className="absolute" />
          <Badge
            className={cn(
              'absolute bottom-full left-full h-5 min-w-5 -translate-x-2/3 translate-y-2/3 rounded-full px-1 font-mono tabular-nums',
              unread ? 'visible' : 'hidden',
            )}
          >
            {unread}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications ({unread})</SheetTitle>
          <SheetDescription>
            All the notifications for the current business show up here.
          </SheetDescription>
          <Separator />
        </SheetHeader>

        <SheetFooter>
          <Link href={'/notifications'} prefetch={true}>
            <Button type="submit" className="w-full">
              All Notifications
              <ExternalLinkIcon />
            </Button>
          </Link>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
