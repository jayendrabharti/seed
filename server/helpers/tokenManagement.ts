import { prisma } from '@seed/database';

/**
 * Clean up expired and old revoked refresh tokens from the database
 * Should be run periodically (e.g., daily via a cron job)
 */
export async function cleanupExpiredTokens() {
  try {
    const now = new Date();

    // Delete expired tokens
    const expiredResult = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    // Delete revoked tokens older than 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const revokedResult = await prisma.refreshToken.deleteMany({
      where: {
        isRevoked: true,
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(
      `Token cleanup completed: ${expiredResult.count} expired tokens and ${revokedResult.count} old revoked tokens removed`,
    );

    return {
      expiredCount: expiredResult.count,
      revokedCount: revokedResult.count,
    };
  } catch (error) {
    console.error('Error cleaning up tokens:', error);
    throw error;
  }
}

/**
 * Revoke all refresh tokens for a specific user
 * Useful for security purposes (e.g., password reset, account compromise)
 */
export async function revokeAllUserTokens(userId: string) {
  try {
    const result = await prisma.refreshToken.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    console.log(`Revoked ${result.count} refresh tokens for user ${userId}`);

    return result.count;
  } catch (error) {
    console.error('Error revoking user tokens:', error);
    throw error;
  }
}

/**
 * Get active sessions for a user
 */
export async function getUserActiveSessions(userId: string) {
  try {
    const sessions = await prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        clientInfo: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions;
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    throw error;
  }
}

/**
 * Revoke a specific session by token ID
 */
export async function revokeSession(tokenId: string, userId: string) {
  try {
    const result = await prisma.refreshToken.updateMany({
      where: {
        id: tokenId,
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    return result.count > 0;
  } catch (error) {
    console.error('Error revoking session:', error);
    throw error;
  }
}
