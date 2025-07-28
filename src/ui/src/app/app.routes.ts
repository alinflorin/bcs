import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { About } from './routes/about/about';
import { NotFound } from './routes/not-found/not-found';
import { OauthCallback } from './routes/oauth-callback/oauth-callback';
import { Settings } from './routes/settings/settings';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

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
    path: '**',
    pathMatch: 'full',
    component: NotFound
  }
];
