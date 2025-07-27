import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { About } from './routes/about/about';
import { NotFound } from './routes/not-found/not-found';

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
    path: '**',
    pathMatch: 'full',
    component: NotFound
  }
];
