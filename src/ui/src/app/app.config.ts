import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authConfig } from './auth.config';
import { AbstractSecurityStorage, authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { config } from './config';
import { LocalStorageOidcStorageService } from './services/local-storage-oidc-storage.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideRouter(routes), provideAuth(authConfig),
    { provide: AbstractSecurityStorage, useClass: LocalStorageOidcStorageService },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      fallbackLang: config.defaultLanguage,
      lang: config.defaultLanguage
    }),
    importProvidersFrom(MatSnackBarModule)
  ]
};
