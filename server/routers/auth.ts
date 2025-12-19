import {
  cleanupTokens,
  emailLogin,
  emailVerify,
  getActiveSessions,
  getNewAccessToken,
  getUser,
  getUserProfileUploadUrl,
  googleAuthCallback,
  googleAuthUrl,
  logout,
  revokeAllSessions,
  revokeSessionById,
  setProfilePicture,
  updateUser,
} from '../controllers/auth';
import { t } from '../trpc';

export const authRoutes = t.router({
  getUser,
  updateUser,

  getUserProfileUploadUrl,
  setProfilePicture,

  emailLogin,
  emailVerify,

  googleAuthUrl,
  googleAuthCallback,

  // Session management
  getActiveSessions,
  revokeSessionById,
  revokeAllSessions,
  cleanupTokens,
  getNewAccessToken,
  logout,
});
