import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import { Request, Response } from 'express';
import { prisma } from '@seed/database';
import type { UserModel } from '@seed/database/generated/models';
import dotenv from 'dotenv';

dotenv.config();

// --- Secrets and Keys ---
export const refreshSecret: jwt.Secret = process.env.REFRESH_TOKEN_SECRET!;

export const accessSecret: jwt.Secret = process.env.ACCESS_TOKEN_SECRET!;

export const googleClientId = process.env.GOOGLE_CLIENT_ID!;

export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;

// --- Expiry Durations ---
export const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY ?? '15m';

export const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY ?? '7d';

// --- Environment ---
const isProduction = process.env.NODE_ENV === 'production';

// --- Cookie Configurations ---
export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  maxAge: ms(accessTokenExpiry as StringValue),
};

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  maxAge: ms(refreshTokenExpiry as StringValue),
};

export const clientBaseUrl = process.env.FRONTEND_URL!;

// --- Test User Configuration ---
export const testMail = process.env.TEST_MAIL ?? null;
export const testOtp = process.env.TEST_OTP ?? null;
export const testUser =
  testMail && testOtp ? { email: testMail, otp: testOtp } : null;

export function getExpiryDate(timeString: string) {
  const milliseconds = ms(timeString as StringValue);
  return new Date(Date.now() + milliseconds);
}

export const generateTokens = async (
  req: Request,
  res: Response,
  user: UserModel,
) => {
  const clientRefreshToken =
    req.cookies['refresh-token'] ||
    req.headers.authorization?.replace('Bearer ', '');

  if (clientRefreshToken) {
    try {
      jwt.verify(clientRefreshToken, refreshSecret);

      // Valid token found - revoke it since user is requesting new tokens
      const existingToken = await prisma.refreshToken.findUnique({
        where: { token: clientRefreshToken },
      });

      if (existingToken && !existingToken.isRevoked) {
        await prisma.refreshToken.update({
          where: { token: clientRefreshToken },
          data: { isRevoked: true },
        });
      }
    } catch (error) {
      // Invalid or expired token - attempt to revoke in database if it exists
      try {
        const existingToken = await prisma.refreshToken.findUnique({
          where: { token: clientRefreshToken },
        });

        if (existingToken && !existingToken.isRevoked) {
          await prisma.refreshToken.update({
            where: { token: clientRefreshToken },
            data: { isRevoked: true },
          });
        }
      } catch (dbError) {
        // Silently ignore database errors
      }
    }
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    } as AccessTokenPayload,
    accessSecret,
    {
      expiresIn: accessTokenExpiry as StringValue,
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      createdAt: new Date().toISOString(),
    } as RefreshTokenPayload,
    refreshSecret,
    {
      expiresIn: refreshTokenExpiry as StringValue,
    },
  );

  const clientInfo = {
    userAgent: req?.headers?.['user-agent'] ?? 'N/A',
    host: req?.headers?.['host'] ?? 'N/A',
    ip:
      (req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress) ??
      'N/A',
  };

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getExpiryDate(refreshTokenExpiry),
      clientInfo,
    },
  });

  res
    .cookie('access-token', accessToken, accessTokenCookieOptions)
    .cookie('refresh-token', refreshToken, refreshTokenCookieOptions);

  return { accessToken, refreshToken };
};
