import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCContext } from '../trpc/context';
import { authRoutes } from './auth';
import { t } from '../trpc';
import { businessRoutes } from './business';
import { inventoryRoutes } from './inventory';
import { categoryRoutes } from './category';
import { s3Routes } from './s3';

export const appRouter = t.router({
  auth: authRoutes,
  business: businessRoutes,
  inventory: inventoryRoutes,
  category: categoryRoutes,
  s3: s3Routes,
});

export const trpcExpress = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext,
});

export type AppRouter = typeof appRouter;

export type AppRouterOutputType = inferRouterOutputs<AppRouter>;

export type AppRouterInputType = inferRouterInputs<AppRouter>;
