import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createTRPCContext = ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const headerToken = req.headers.authorization?.replace('Bearer ', '');
  const cookieToken = req.cookies?.['access-token'] as string | undefined;

  const accessToken = headerToken || cookieToken;
  const authSource = headerToken ? 'header' : cookieToken ? 'cookie' : 'none';

  return {
    req,
    res,
    accessToken,
    authSource,
  };
};

export type ITRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
