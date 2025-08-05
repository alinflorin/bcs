export interface UserClaims {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  nickname?: string | undefined;
  picture?: string | undefined;
  isAdmin: boolean;
}
