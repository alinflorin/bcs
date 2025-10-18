import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const jwtHandler = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.OIDC_JWKS_URI || `https://dev-kpiuw0wghy7ta8x8.us.auth0.com/.well-known/jwks.json`,
    }),
    audience: process.env.OIDC_AUDIENCE || "https://bcs-api/",
    issuer: process.env.OIDC_ISSUER || `https://dev-kpiuw0wghy7ta8x8.us.auth0.com/`,
    algorithms: ["RS256"],
  });

export default jwtHandler;