import { initTRPC } from '@trpc/server';
import { createTRPCContext } from './context';
import SuperJSON from 'superjson';

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
});
