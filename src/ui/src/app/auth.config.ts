import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
            authority: 'https://alinflorin.eu.auth0.com',
            redirectUrl: window.location.origin + '/callback',
            postLogoutRedirectUri: window.location.origin,
            clientId: 'ZykKITiL8eKwjhHwVCRqnNUtM3RkXTQ4',
            scope: 'openid profile offline_access email api:all',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            customParamsAuthRequest: {
              audience: 'https://bcs-api', // API Identifier from Auth0
            },
            secureRoutes: ['/api/'],
        }
}
