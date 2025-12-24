import { Prisma } from '@seed/database';
import { TRPCError } from '@trpc/server';

export function handlePrismaError(error: unknown): {
  code: TRPCError['code'];
  status: number;
  message: string;
  prismaCode?: string;
  isDuplicateError?: boolean;
} {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          prismaCode: error.code,
          code: 'CONFLICT',
          status: 409,
          message: `Duplicate value for ${error.meta?.target || error.meta?.modelName}`,
          isDuplicateError: true,
        };

      case 'P2025':
        return {
          prismaCode: error.code,
          code: 'NOT_FOUND',
          status: 404,
          message: 'Record not found',
        };

      case 'P2003':
        return {
          prismaCode: error.code,
          code: 'BAD_REQUEST',
          status: 400,
          message: 'Invalid relation reference',
        };

      default:
        return {
          prismaCode: error.code,
          code: 'INTERNAL_SERVER_ERROR',
          status: 400,
          message: 'Database error',
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      prismaCode: 'P4000',
      code: 'BAD_REQUEST',
      status: 422,
      message: 'Invalid input data',
    };
  }

  return {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'Internal server error',
  };
}
