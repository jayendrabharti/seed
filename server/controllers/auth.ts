import { prisma } from '@seed/database';
import z from 'zod';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import sendMail from '../helpers/sendMail';
import {
  accessTokenCookieOptions,
  accessTokenExpiry,
  generateTokens,
  getExpiryDate,
  refreshSecret,
  refreshTokenCookieOptions,
  refreshTokenExpiry,
  testUser,
} from '../helpers/auth';
import { oAuth2Client } from '../helpers/googleClient';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { protectedProcedure, publicProcedure } from '../trpc/procedures';

export const getUser = protectedProcedure.query(async ({ ctx }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: ctx.userId,
    },
  });
  return user;
});

export const updateUser = protectedProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ input: { name }, ctx }) => {
    const updatedUser = await prisma.user.update({
      where: { id: ctx.userId },
      data: { name },
    });
    return updatedUser;
  });

export const emailLogin = publicProcedure
  .input(
    z.object({
      email: z.email(),
    }),
  )
  .mutation(async ({ input: { email } }) => {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      user = await prisma.user.create({
        data: {
          email,
        },
      });

    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
        cause: 'Failed to create user',
      });

    // Check for recent OTP request (rate limiting)
    const recentOtp = await prisma.otp.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000), // Within last minute
        },
      },
    });

    if (recentOtp) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Please wait before requesting another OTP',
      });
    }

    // Delete expired OTPs and old unverified ones
    await prisma.otp.deleteMany({
      where: {
        email,
        OR: [{ expiresAt: { lt: new Date() } }, { verifiedAt: { not: null } }],
      },
    });

    let otp;
    if (testUser && testUser.email === email) {
      otp = testUser.otp;
    } else {
      otp = crypto.randomInt(100000, 1000000).toString(); // 6-digit OTP
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    if (!(testUser && testUser.email === email)) {
      await sendMail({
        to: email,
        subject: 'Your OTP Code',
        content: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      });
    }

    return { otpExpiresAt: expiresAt, message: `OTP sent to ${email}` };
  });

export const emailVerify = publicProcedure
  .input(
    z.object({
      email: z.email(),
      otp: z.string().length(6),
    }),
  )
  .mutation(async ({ input: { email, otp }, ctx: { req, res } }) => {
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        verifiedAt: null, // Only get unverified OTPs
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent one
      },
    });

    if (!otpRecord) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No OTP found for this email',
      });
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'OTP has expired',
      });
    }

    // Check max attempts (prevent brute force)
    if (otpRecord.attempts >= 5) {
      await prisma.otp.delete({ where: { id: otpRecord.id } });
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Invalid OTP. ${4 - otpRecord.attempts} attempts remaining.`,
      });
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { email } });

    const { accessToken, refreshToken } = await generateTokens(req, res, user!);

    return {
      accessToken,
      refreshToken,
      email,
      message: 'OTP verified successfully',
      success: true,
    };
  });

export const googleAuthUrl = publicProcedure
  .input(
    z.object({
      type: z.enum(['get', 'redirect']).optional().default('get'),
    }),
  )
  .query(async ({ input: { type }, ctx: { req, res } }) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
    });
    if (type === 'redirect') {
      return res.redirect(authorizeUrl);
    }
    return { url: authorizeUrl };
  });

export const googleAuthCallback = publicProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input: { code }, ctx: { req, res } }) => {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const { access_token, id_token } = tokens;

    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const { email, name, picture } = data as {
      email: string;
      name: string;
      picture: string;
    };

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, picture },
      });
    }

    // 🔐 sets httpOnly cookies
    await generateTokens(req, res, user);

    return { success: true };
  });

export const logout = protectedProcedure.mutation(
  async ({ ctx: { req, res } }) => {
    const clientRefreshToken =
      req.cookies?.refreshToken || req.headers['refresh-token'];

    if (clientRefreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: clientRefreshToken,
        },
      });
    }

    res
      .clearCookie('access-token', accessTokenCookieOptions)
      .clearCookie('refresh-token', refreshTokenCookieOptions);

    return { message: 'User logged out successfully', success: true };
  },
);

export const refreshUserToken = publicProcedure.query(
  async ({ ctx: { req, res } }) => {
    const clientRefreshToken =
      req.cookies?.refreshToken || req.headers['refresh-token'];
    if (!clientRefreshToken) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized request',
      });
    }

    let userId: string;
    try {
      const payload = jwt.verify(
        clientRefreshToken,
        refreshSecret,
      ) as RefreshTokenPayload;
      userId = payload.userId;
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired refresh token',
        cause: error,
      });
    }

    const dbRefreshToken = await prisma.refreshToken.findUnique({
      where: { userId: userId, token: clientRefreshToken },
      include: { user: true },
    });

    if (!dbRefreshToken?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }

    const { accessToken, refreshToken } = await generateTokens(
      req,
      res,
      dbRefreshToken.user,
    );

    return {
      accessToken,
      refreshToken,
    };
  },
);

export const getNewAccessToken = publicProcedure.query(
  async ({ ctx: { req, res } }) => {
    const clientRefreshToken =
      req.cookies?.refreshToken || req.headers['refresh-token'];

    if (!clientRefreshToken) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized request',
      });
    }

    let userId: string;
    try {
      const payload = jwt.verify(
        clientRefreshToken,
        refreshSecret,
      ) as RefreshTokenPayload;
      userId = payload.userId;
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired refresh token',
        cause: error,
      });
    }

    const dbRefreshToken = await prisma.refreshToken.findUnique({
      where: { userId: userId, token: clientRefreshToken },
      include: { user: true },
    });

    if (!dbRefreshToken?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }

    const { accessToken, refreshToken } = await generateTokens(
      req,
      res,
      dbRefreshToken.user,
    );

    return {
      accessToken,
      accessTokenExpiresAt: getExpiryDate(accessTokenExpiry),
      refreshToken,
      refreshTokenExpiresAt: getExpiryDate(refreshTokenExpiry),
    };
  },
);
