import {
  cleanupTokens,
  emailLogin,
  emailVerify,
  getActiveSessions,
  getNewAccessToken,
  getUser,
  googleAuthCallback,
  googleAuthUrl,
  logout,
  revokeAllSessions,
  revokeSessionById,
  updateUser,
} from '../controllers/auth';
import { t } from '../trpc';

export const authRoutes = t.router({
  getUser,
  updateUser,
  logout,

  getNewAccessToken,

  emailLogin,
  emailVerify,

  googleAuthUrl,
  googleAuthCallback,

  // Session management
  getActiveSessions,
  revokeSessionById,
  revokeAllSessions,
  cleanupTokens,
});
