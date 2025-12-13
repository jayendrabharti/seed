import { TRPCError } from '@trpc/server';
import { t } from './index';
import jwt from 'jsonwebtoken';
import { accessSecret } from '../helpers/auth';

export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.accessToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      ctx.accessToken,
      accessSecret,
    ) as AccessTokenPayload;
    return next({
      ctx: {
        userId: decoded.id,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
      cause: error,
    });
  }
});
