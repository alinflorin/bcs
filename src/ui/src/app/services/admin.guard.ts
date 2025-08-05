import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const oidcService = inject(OidcSecurityService);
  return oidcService.getPayloadFromAccessToken().pipe(
    map(p => {
      if (!p || !p.permissions) {
        return false;
      }
      const permissions: string[] = p.permissions;
      return permissions.includes("api:admin");
    })
  );
};
