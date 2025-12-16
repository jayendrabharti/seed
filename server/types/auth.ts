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
