'use client';

import { BusinessMemberships, useBusiness } from '@/providers/BusinessProvider';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { Loader2Icon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';
import { formatTimestamp } from '@/utils';
import { Badge } from '../ui/badge';
import DeleteDialogButton from './DeleteDialogButton';

export default function BusinessCard({
  businessMembership,
}: {
  businessMembership: BusinessMemberships;
}) {
  const {
    currentBusinessMembership,
    switchBusinessMembershipId,
    renameBusiness,
    deleteBusiness,
  } = useBusiness();

  const [upadating, startUpdating] = useTransition();
  const [switching, startSwitching] = useTransition();

  const deleteThisBusiness = async () => {
    await deleteBusiness({ id: businessMembership.business.id });
  };

  const updateThisBusiness = async () => {
    startUpdating(async () => {
      const newName = prompt(
        `Enter new name for ${businessMembership.business.name}.`,
      );
      if (!newName) return;
      await renameBusiness({ id: businessMembership.business.id, newName });
    });
  };

  const switchingBusiness = async () => {
    startSwitching(async () => {
      await switchBusinessMembershipId({ id: businessMembership.id });
    });
  };

  return (
    <div className="bg-card border-border flex flex-col rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex w-full flex-row items-center space-x-1">
        <span className="mb-2 text-lg font-semibold">
          {businessMembership.business.name}
        </span>
        <Button
          variant={'outline'}
          size={'icon'}
          className="ml-auto"
          onClick={updateThisBusiness}
        >
          {upadating ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <PencilIcon />
          )}
        </Button>
        <DeleteDialogButton onDelete={deleteThisBusiness} />
      </div>
      <Separator className="my-1" />
      <span className="text-xs text-zinc-400">
        Created: {formatTimestamp(businessMembership.business.createdAt)}
      </span>
      <span className="text-xs text-zinc-400">
        Updated: {formatTimestamp(businessMembership.business.updatedAt)}
      </span>
      <Separator className="mt-1" />
      <div className="mt-2 flex w-full flex-row items-center justify-end">
        {currentBusinessMembership?.id == businessMembership.id ? (
          <Badge>Current</Badge>
        ) : (
          <Button
            variant={'outline'}
            className="w-full"
            onClick={switchingBusiness}
          >
            {switching && <Loader2Icon className="animate-spin" />}
            Set Current Business
          </Button>
        )}
      </div>
    </div>
  );
}
