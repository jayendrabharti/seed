import { protectedProcedure } from '../trpc/procedures';
import * as z from 'zod';
import { createUploadUrl } from '../helpers/aws/s3Upload';

export const s3Routes = {
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string(),
        isPublic: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      // Generate a unique key, e.g., with timestamp or uuid
      const ext = input.fileName.split('.').pop();
      const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      return createUploadUrl({
        key,
        contentType: input.contentType,
        isPublic: input.isPublic,
      });
    }),
};
