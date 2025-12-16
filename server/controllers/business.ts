import { prisma } from '@seed/database';
import { protectedProcedure } from '../trpc/procedures';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';

export const getBusinesses = protectedProcedure.query(
  async ({ ctx: { userId } }) => {
    const businesses = await prisma.business.findMany({
      where: { ownerId: userId },
    });

    if (businesses.length > 0) return businesses;

    const newBusiness = await prisma.business.create({
      data: {
        name: 'My Business',
        ownerId: userId,
      },
    });

    return [newBusiness];
  },
);

export const createNewBusiness = protectedProcedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .mutation(async ({ input: { name }, ctx: { userId } }) => {
    const existingBusiness = await prisma.business.findFirst({
      where: { name, ownerId: userId },
    });

    if (existingBusiness) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Business name already in use.',
      });
    }

    const newBusiness = await prisma.business.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    return newBusiness;
  });

export const deleteBusiness = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input: { id }, ctx: { userId } }) => {
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business || business.ownerId !== userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Business not found.',
      });
    }

    await prisma.business.delete({
      where: { id },
    });

    return { business };
  });

export const renameBusiness = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      newName: z.string(),
    }),
  )
  .mutation(async ({ input: { id, newName }, ctx: { userId } }) => {
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business || business.ownerId !== userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Business not found.',
      });
    }

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: { name: newName },
    });

    return { business: updatedBusiness };
  });
