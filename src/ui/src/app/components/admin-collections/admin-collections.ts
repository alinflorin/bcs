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
  ],
  templateUrl: './admin-collections.html',
  styleUrl: './admin-collections.scss',
})
export class AdminCollections implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  collections = signal<VectorCollectionDto[] | undefined>(undefined);

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
  }

  addCollection() {
    this.adminService
      .createVectorCollection(
        { name: this.form.value.name! } as CreateVectorCollectionDto,
        this.form.value.files!
      )
      .subscribe({
        next: () => {
          this.toastService.show(
            this.translateService.instant(
              'ui.components.admin-collections.collectionAdded'
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
                'ui.components.admin-collections.errorAddingCollection'
              ),
              'error'
            );
          }
        },
      });
  }
}
