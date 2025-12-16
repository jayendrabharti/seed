export interface AccessTokenPayload {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  picture: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenPayload {
  userId: string;
  createdAt: string;
}
