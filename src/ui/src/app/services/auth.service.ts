import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserClaims } from '../models/user-claims';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly oidc = inject(OidcSecurityService);

  checkAuth() {
    return this.oidc.checkAuth();
  }

  get user(): Observable<UserClaims | undefined> {
    return this.oidc.getUserData().pipe(
      switchMap(u => {
        if (!u) {
          return of(undefined);
        }
        return this.oidc.getPayloadFromAccessToken().pipe(
          map(at => ({...u, isAdmin: at && at.permissions && at.permissions.includes("api:admin")} as UserClaims))
        )
      })
    );
  }

  login() {
    return this.oidc.authorize();
  }

  logout() {
    return this.oidc.logoff();
  }
}
