import { prisma } from '@seed/database';
import { protectedProcedure } from '../trpc/procedures';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';

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
      });
      return categories;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch categories',
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
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create category',
      });
    }
  });
