import { AppRouter } from '@seed/server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { cookies } from 'next/headers';
import SuperJSON from 'superjson';

export const serverTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api',
      async headers() {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) return {};

        return {
          authorization: `Bearer ${accessToken}`,
        };
      },
      transformer: SuperJSON,
    }),
  ],
});
