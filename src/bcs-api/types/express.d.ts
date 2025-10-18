// types/express.d.ts
import * as jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      auth?: jwt.JwtPayload & {
        // your custom claims
        "https://bcs-api/email": string;
        "https://bcs-api/roles"?: string[];
        permissions?: string[]
      };
    }
  }
}