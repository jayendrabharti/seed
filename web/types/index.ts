import { type AppRouterOutputType } from '@seed/api/types';
import { type AppRouter } from '@seed/api/types';

declare global {
  type TrpcAppRouterOutputType = AppRouterOutputType;
  type TrpcAppRouter = AppRouter;
}
