import { Component, inject, OnInit, signal } from '@angular/core';
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
import { minFilesValidator } from '../../helpers/min-files.validator';
import { CreateVectorCollectionDto } from '../../dto/create-vector-collection.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDto } from '../../dto/error.dto';
import { setErrorDtoInFormValidation } from '../../helpers/form-validation.helper';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VectorCollectionDto } from '../../dto/vector-collection.dto';
import { MatFileUploadModule } from 'mat-file-upload';
import { ConfirmationService } from '../../services/confirmation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-collections',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatFileUploadModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-collections.html',
  styleUrl: './admin-collections.scss',
})
export class AdminCollections implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);

  collections = signal<VectorCollectionDto[] | undefined>(undefined);
  isLoading = signal(false);

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    files: new FormControl<File[]>([], [minFilesValidator(1)]),
  });

  ngOnInit(): void {
    this.adminService.getVectorCollections().subscribe((r) => {
      this.collections.set(r);
    });
  }

  deleteCollection(name: string) {
    this.confirmationService.confirm().subscribe((x) => {
      if (!x) {
        return;
      }
      this.adminService.deleteVectorCollection(name).subscribe({
        next: () => {
          this.toastService.show(
            this.translateService.instant(
              'ui.components.admin-collections.collectionDeleted'
            ),
            'success'
          );
          const newList = this.collections()!.filter((x) => x.name !== name);
          this.collections.set(newList);
          this.form.get('files')!.setValue([]);
          this.form.reset();
        },
        error: () => {
          this.toastService.show(
            this.translateService.instant(
              'ui.components.admin-collections.errorDeletingCollection'
            ),
            'error'
          );
        },
      });
    });
  }

  onSelectedFilesChanged(files: FileList) {
    this.form.get('files')!.markAsTouched();
    if (files == null) {
      this.form.get('files')!.setValue([]);
      return;
    }
    const filesArr: File[] = [];
    for (let i = 0; i < files.length; i++) {
      filesArr.push(files.item(i)!);
    }
    this.form.get('files')!.setValue(filesArr);
  }

  addCollection() {
    this.isLoading.set(true);
    this.adminService
      .createVectorCollection(
        { name: this.form.value.name! } as CreateVectorCollectionDto,
        this.form.value.files!
      )
      .subscribe({
        next: (c) => {
          this.isLoading.set(false);
          this.toastService.show(
            this.translateService.instant(
              'ui.components.admin-collections.collectionAdded'
            ),
            'success'
          );
          const newList = [...this.collections()!, c];
          this.collections.set(newList);
        },
        error: (e) => {
          this.isLoading.set(false);
          if (e instanceof HttpErrorResponse) {
            const errors: ErrorDto = e.error;
            setErrorDtoInFormValidation(this.form, errors);
          } else {
            this.toastService.show(
              this.translateService.instant(
                'ui.components.admin-collections.errorAddingCollection'
              ),
              'error'
            );
          }
        },
      });
  }
}
