import { prisma } from '@seed/database';
import { protectedProcedure } from '../trpc/procedures';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';
import { handlePrismaError } from '../helpers/handlePrismaError';

export const getCategoriesByBusinessId = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
    }),
  )
  .query(async ({ input }) => {
    try {
      const categories = await prisma.category.findMany({
        where: {
          businessId: input.businessId,
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
      return categories;
    } catch (error: unknown) {
      const { code, message } = handlePrismaError(error);
      throw new TRPCError({
        code,
        message: message ?? 'Failed to fetch categories',
      });
    }
  });

export const createCategory = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      businessId: z.string(),
      description: z.string().max(255).optional(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const newCategory = await prisma.category.create({
        data: input,
      });
      return newCategory;
    } catch (error: unknown) {
      const { code, message, isDuplicateError } = handlePrismaError(error);
      throw new TRPCError({
        code,
        message: isDuplicateError
          ? 'This Category name is already taken'
          : message,
      });
    }
  });

export const deleteCategory = protectedProcedure
  .input(
    z.object({
      categoryId: z.string(),
      businessId: z.string(),
    }),
  )
  .mutation(async ({ input: { categoryId, businessId } }) => {
    try {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, businessId },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
      if (!category) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this category',
        });
      }
      if (category._count.products > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete category with associated products',
        });
      }

      await prisma.category.delete({
        where: { id: categoryId },
      });
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof TRPCError) {
        throw error;
      }

      const { code, message } = handlePrismaError(error);
      throw new TRPCError({
        code,
        message: message ?? 'Failed to delete category',
      });
    }
  });
