import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return toSignal(authService.user)()?.isAdmin === true;
};
