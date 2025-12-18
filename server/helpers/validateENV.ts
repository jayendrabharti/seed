import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z
    .string()
    .min(1, 'PORT is required')
    .regex(/^\d+$/, 'PORT must be a valid number'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Frontend
  FRONTEND_URL: z.url('FRONTEND_URL must be a valid URL'),

  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),

  // Token Expiry
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .regex(
      /^\d+[smhd]$/,
      'ACCESS_TOKEN_EXPIRY must be in format like "15m", "1h", "7d"',
    )
    .default('15m'),
  REFRESH_TOKEN_EXPIRY: z
    .string()
    .regex(
      /^\d+[smhd]$/,
      'REFRESH_TOKEN_EXPIRY must be in format like "15m", "1h", "7d"',
    )
    .default('7d'),

  // Database
  DATABASE_URL: z
    .url('DATABASE_URL must be a valid URL')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      'DATABASE_URL must start with "postgresql://" or "postgres://"',
    ),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // Email Configuration
  SMTP_USERNAME: z.string().min(1, 'SMTP_USERNAME is required'),
  SMTP_PASSWORD: z.string().min(1, 'SMTP_PASSWORD is required'),
  SMTP_PORT: z
    .string()
    .regex(/^\d+$/, 'SMTP_PORT must be a valid number')
    .default('587'),
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_MAIL: z.email('SMTP_MAIL must be a valid email'),

  // Optional Test Configuration
  TEST_MAIL: z.email('TEST_MAIL must be a valid email').optional(),
  TEST_OTP: z
    .string()
    .regex(/^\d+$/, 'TEST_OTP must contain only digits')
    .optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateENV():
  | { success: true; data: EnvConfig }
  | { success: false; error: string } {
  console.log('🔍 Validating environment variables...');

  try {
    const validatedEnv = envSchema.parse(process.env);
    console.log('✅ Environment validation passed!\n');
    return { success: true, data: validatedEnv };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues
        .map((err) => `   - ${err.path.join('.')}: ${err.message}`)
        .join('\n');
      return {
        success: false,
        error: `❌ Environment validation failed:\n${errorMessage}`,
      };
    }
    return {
      success: false,
      error: `❌ Unexpected error during validation: ${error}`,
    };
  }
}
