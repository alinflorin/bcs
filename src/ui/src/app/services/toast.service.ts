import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string, type: 'info' | 'warn' | 'success' | 'error' = 'info') {
    return this.snackBar.open(message, '🗙', {
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      politeness: 'assertive',
      panelClass: 'toast-' + type,
      duration: config.toastTimeoutMs
    });
  }
}
