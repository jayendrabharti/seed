import { AppRouter } from '@seed/server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';

export const staticTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api',
      transformer: SuperJSON,
    }),
  ],
});
