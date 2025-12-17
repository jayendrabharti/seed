'use client';

import { clientTrpc } from '@seed/api/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  LoaderCircleIcon,
  TrashIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  ShieldAlertIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function SessionsPage() {
  const router = useRouter();
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);

  const {
    data: sessions,
    isLoading,
    refetch,
  } = clientTrpc.auth.getActiveSessions.useQuery();

  const revokeSessionMutation = clientTrpc.auth.revokeSessionById.useMutation({
    onSuccess: () => {
      toast.success('Session revoked successfully');
      refetch();
      setSessionToRevoke(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revoke session');
    },
  });

  const revokeAllMutation = clientTrpc.auth.revokeAllSessions.useMutation({
    onSuccess: () => {
      toast.success('All sessions revoked. Redirecting to login...');
      setShowRevokeAllDialog(false);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revoke all sessions');
    },
  });

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSessionMutation.mutateAsync({ sessionId });
  };

  const handleRevokeAll = async () => {
    await revokeAllMutation.mutateAsync();
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <MonitorIcon className="h-5 w-5" />;
    if (userAgent.toLowerCase().includes('mobile')) {
      return <SmartphoneIcon className="h-5 w-5" />;
    } else if (userAgent.toLowerCase().includes('tablet')) {
      return <TabletIcon className="h-5 w-5" />;
    }
    return <MonitorIcon className="h-5 w-5" />;
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown Browser';
    // Simple parsing - you can enhance this
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    if (userAgent.includes('Edge')) return 'Edge Browser';
    return 'Unknown Browser';
  };

  const getClientInfo = (clientInfo: any) => {
    if (!clientInfo || typeof clientInfo !== 'object') {
      return { userAgent: 'N/A', ip: 'N/A', host: 'N/A' };
    }
    return {
      userAgent: clientInfo.userAgent || 'N/A',
      ip: clientInfo.ip || 'N/A',
      host: clientInfo.host || 'N/A',
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/account">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Active Sessions</h1>
        <p className="text-muted-foreground">
          Manage devices and locations where you&apos;re currently logged in
        </p>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Sessions</CardTitle>
              <CardDescription>
                {sessions?.length || 0} active{' '}
                {sessions?.length === 1 ? 'session' : 'sessions'}
              </CardDescription>
            </div>
            {sessions && sessions.length > 1 && (
              <Button
                variant="destructive"
                onClick={() => setShowRevokeAllDialog(true)}
                disabled={revokeAllMutation.isPending}
              >
                {revokeAllMutation.isPending ? (
                  <>
                    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <ShieldAlertIcon className="mr-2 h-4 w-4" />
                    Revoke All Sessions
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sessions || sessions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No active sessions found</p>
            </div>
          ) : (
            sessions.map((session, index) => {
              const clientInfo = getClientInfo(session.clientInfo);
              return (
                <div key={session.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-muted rounded-lg p-3">
                        {getDeviceIcon(clientInfo.userAgent)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {getDeviceInfo(clientInfo.userAgent)}
                          </p>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {clientInfo.ip}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {clientInfo.host}
                        </p>
                        <div className="text-muted-foreground flex gap-4 text-xs">
                          <span>
                            Created:{' '}
                            {new Date(session.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>
                          <span>
                            Expires:{' '}
                            {new Date(session.expiresAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSessionToRevoke(session.id)}
                      disabled={revokeSessionMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <AlertTriangleIcon className="h-5 w-5" />
            Security Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            If you see a session you don&apos;t recognize, revoke it immediately
            and consider changing your password. Revoking all sessions will log
            you out from all devices.
          </p>
        </CardContent>
      </Card>

      {/* Revoke Single Session Dialog */}
      <AlertDialog
        open={!!sessionToRevoke}
        onOpenChange={(open) => !open && setSessionToRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately end this session. If it&apos;s your current
              session, you&apos;ll be logged out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeSessionMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                sessionToRevoke && handleRevokeSession(sessionToRevoke)
              }
              disabled={revokeSessionMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revokeSessionMutation.isPending ? (
                <>
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke Session'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke All Sessions Dialog */}
      <AlertDialog
        open={showRevokeAllDialog}
        onOpenChange={setShowRevokeAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke all sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end all active sessions and log you out from all
              devices. You&apos;ll need to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeAllMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeAll}
              disabled={revokeAllMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revokeAllMutation.isPending ? (
                <>
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke All Sessions'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
