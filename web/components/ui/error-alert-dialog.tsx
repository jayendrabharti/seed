'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle, AlertCircleIcon, Wallet } from 'lucide-react';
import Link from 'next/link';

interface ErrorAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
  errorCode?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function ErrorAlertDialog({
  open,
  onOpenChange,
  title,
  message,
  errorCode,
  action,
}: ErrorAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircleIcon className="text-destructive h-6 w-6" />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-base">
            {message}
          </AlertDialogDescription>
          {errorCode && (
            <p className="text-muted-foreground pt-2 text-xs">
              Error Code: {errorCode}
            </p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          {action && (
            <>
              {action.href ? (
                <Link href={action.href}>
                  <AlertDialogAction className="w-full">
                    {action.label}
                  </AlertDialogAction>
                </Link>
              ) : (
                <AlertDialogAction onClick={action.onClick}>
                  {action.label}
                </AlertDialogAction>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
