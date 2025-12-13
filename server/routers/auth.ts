import {
  emailLogin,
  emailVerify,
  getNewAccessToken,
  getUser,
  googleAuthCallback,
  googleAuthUrl,
  logout,
  refreshUserToken,
  updateUser,
} from '../controllers/auth';
import { t } from '../trpc';

export const authRoutes = t.router({
  getUser,
  updateUser,
  logout,

  refreshUserToken,
  getNewAccessToken,

  emailLogin,
  emailVerify,

  googleAuthUrl,
  googleAuthCallback,
});
