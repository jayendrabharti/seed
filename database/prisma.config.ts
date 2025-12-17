import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenv.config();
dotenv.config({ path: '../server/.env' });
dotenv.config({ path: '../client/.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
