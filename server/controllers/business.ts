import { prisma } from '@seed/database';
import { protectedProcedure } from '../trpc/procedures';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';

export const getBusinessesMemberships = protectedProcedure.query(
  async ({ ctx: { userId } }) => {
    const businessMemberships = await prisma.businessMembership.findMany({
      where: { userId },
      include: { business: true },
    });

    if (businessMemberships.length > 0) return businessMemberships;

    const newBusinessMembership = await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: 'My Business',
          ownerId: userId,
        },
      });
      const membership = await tx.businessMembership.create({
        data: {
          businessId: business.id,
          userId: userId,
          role: 'OWNER',
        },
        include: { business: true },
      });
      return membership;
    });

    return [newBusinessMembership];
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

    const newBusinessMembership = await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name,
          ownerId: userId,
        },
      });
      const membership = await tx.businessMembership.create({
        data: {
          businessId: business.id,
          userId: userId,
          role: 'OWNER',
        },
      });
      return { ...membership, business };
    });

    return newBusinessMembership;
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
