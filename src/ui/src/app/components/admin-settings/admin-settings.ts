import { Component, effect, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../services/admin.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../services/toast.service';
import { SettingsDto } from '../../dto/settings.dto';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDto } from '../../dto/error.dto';
import { setErrorDtoInFormValidation } from '../../helpers/form-validation.helper';

@Component({
  selector: 'app-admin-settings',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.scss',
})
export class AdminSettings {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  settings = toSignal(this.adminService.getSettings());
  formLoaded = false;

  form = new FormGroup({
    systemPrompt: new FormControl<string>('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      const settingsValue = this.settings();
      if (!settingsValue) {
        return;
      }
      if (!this.formLoaded) {
        this.form.setValue(settingsValue);
        this.formLoaded = true;
        return;
      }
    });
  }

  save() {
    this.adminService.saveSettings(this.form.value as SettingsDto).subscribe({
      next: () => {
        this.toastService.show(
          this.translateService.instant(
            'ui.components.admin-settings.settingsSaved'
          ),
          'success'
        );
      },
      error: (e) => {
        if (e instanceof HttpErrorResponse) {
          const errors: ErrorDto = e.error;
          setErrorDtoInFormValidation(this.form, errors);
        } else {
          this.toastService.show(
            this.translateService.instant(
              'ui.components.admin-settings.errorSavingSettings'
            ),
            'error'
          );
        }
      },
    });
  }
}
