import { AppRouter } from '@seed/server';
import { createTRPCReact } from '@trpc/react-query';

export const clientTrpc = createTRPCReact<AppRouter>();
