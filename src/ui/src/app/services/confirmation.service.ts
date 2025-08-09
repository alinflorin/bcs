import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Confirmation } from '../components/confirmation/confirmation';
import { ConfirmationDialogData } from '../models/confirmation-dialog-data';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private readonly matDialog = inject(MatDialog);

  confirm(title: string | undefined = undefined, message: string | undefined = undefined) {
    const ref = this.matDialog.open(Confirmation, {
      data: {
        message: message,
        title: title
      } as ConfirmationDialogData
    });
    return ref.afterClosed().pipe(
      map(x => x === true)
    );
  }
}
