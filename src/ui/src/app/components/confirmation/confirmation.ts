import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation',
  imports: [MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss'
})
export class Confirmation {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {

  }
}
