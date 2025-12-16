import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCContext } from '../trpc/context';
import { authRoutes } from './auth';
import { t } from '../trpc';
import { businessRoutes } from './business';

export const appRouter = t.router({
  auth: authRoutes,
  business: businessRoutes,
});

export const trpcExpress = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext,
});

export type AppRouter = typeof appRouter;

export type AppRouterOutputType = inferRouterOutputs<AppRouter>;

export type AppRouterInputType = inferRouterInputs<AppRouter>;
