import "oidc-client-ts";

declare module "oidc-client-ts" {
  // Extend IdTokenClaims globally
  interface IdTokenClaims {
    "https://bcs-api/email": string;
    "https://bcs-api/roles"?: string[];
  }
}
