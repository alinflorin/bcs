import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { About } from './routes/about/about';
import { NotFound } from './routes/not-found/not-found';
import { OauthCallback } from './routes/oauth-callback/oauth-callback';
import { Settings } from './routes/settings/settings';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { Admin } from './routes/admin/admin';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'callback',
    component: OauthCallback
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [autoLoginPartialRoutesGuard]
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [autoLoginPartialRoutesGuard, adminGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFound
  }
];
