import { prisma } from '@seed/database';
import { protectedProcedure } from '../trpc/procedures';
import * as z from 'zod';
import { TRPCError } from '@trpc/server';
import { productSchema } from '@seed/schemas';

export const addProduct = protectedProcedure
  .input(productSchema)
  .mutation(async ({ input }) => {
    try {
      const newProduct = await prisma.product.create({
        data: input,
      });
      return newProduct;
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      console.log('\nAdd product error: ', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add product',
        cause: error,
      });
    }
  });

export const getProductCount = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
      isActive: z.boolean().optional().default(true),
    }),
  )
  .query(async ({ input }) => {
    try {
      const count = await prisma.product.count({
        where: {
          businessId: input.businessId,
          isActive: input.isActive,
        },
      });
      return count;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get product count',
      });
    }
  });

export const getProducts = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
      pageSize: z.number().min(1).max(100).optional().default(10),
      pageNumber: z.number().min(1).optional().default(1),
      order: z.enum(['asc', 'desc']).optional().default('asc'),
      orderBy: z
        .enum(['createdAt', 'name', 'currentStockLevel', 'sellingPrice'])
        .optional()
        .default('createdAt'),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      isActive: z.boolean().optional(),
      stockStatus: z
        .enum(['all', 'inStock', 'lowStock', 'outOfStock'])
        .optional(),
    }),
  )
  .query(
    async ({
      input: {
        businessId,
        pageSize,
        pageNumber,
        order,
        orderBy,
        search,
        categoryId,
        isActive,
        stockStatus,
      },
    }) => {
      try {
        const where: any = { businessId };

        // Search filter
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { barcode: { contains: search, mode: 'insensitive' } },
          ];
        }

        // Category filter
        if (categoryId) {
          where.categoryId = categoryId;
        }

        // Active status filter
        if (isActive !== undefined) {
          where.isActive = isActive;
        }

        // Stock status filter
        if (stockStatus && stockStatus !== 'all') {
          if (stockStatus === 'outOfStock') {
            where.currentStockLevel = { lte: 0 };
          } else if (stockStatus === 'lowStock') {
            where.AND = [
              { currentStockLevel: { gt: 0 } },
              {
                OR: [
                  { reorderLevel: { not: null } },
                  { minStockLevel: { not: null } },
                ],
              },
            ];
            // This is a simplified check - actual low stock logic would compare with reorderLevel/minStockLevel
          } else if (stockStatus === 'inStock') {
            where.currentStockLevel = { gt: 0 };
          }
        }

        const [products, totalCount] = await prisma.$transaction([
          prisma.product.findMany({
            where,
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            orderBy: [{ [orderBy]: order }, { id: 'asc' }],
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }),
          prisma.product.count({ where }),
        ]);
        return { products, totalCount };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch products',
          cause: error,
        });
      }
    },
  );

export const getProductById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      return product;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch product',
      });
    }
  });

export const updateProduct = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      data: productSchema.partial(),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: input.id },
        data: input.data,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return updatedProduct;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update product',
      });
    }
  });

export const deleteProduct = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    try {
      await prisma.product.delete({
        where: { id: input.id },
      });
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete product',
      });
    }
  });

export const bulkDeleteProducts = protectedProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .mutation(async ({ input }) => {
    try {
      await prisma.product.deleteMany({
        where: { id: { in: input.ids } },
      });
      return { success: true, count: input.ids.length };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete products',
      });
    }
  });
