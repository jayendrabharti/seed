import type { UserModel } from '@seed/database/generated/models';

declare global {
  interface AccessTokenPayload {
    id: string;
    email: string;
    phone: string | null;
    name: string | null;
    picture: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface RefreshTokenPayload {
    userId: string;
    createdAt: string;
  }
}

export {};
