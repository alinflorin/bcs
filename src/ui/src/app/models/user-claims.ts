export interface UserClaims {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  nickname?: string;
  picture?: string;
}
