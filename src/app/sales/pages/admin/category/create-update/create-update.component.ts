import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { firstValueFrom } from 'rxjs';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {
  public droppedFile: File | undefined;
  public imageChanged = false;
  public isDragOver = false;
  public droppedImage: SafeUrl | null = null;
  constructor(
    private dialogRef: MatDialogRef<CreateUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDto,
    private validatorService: ValidatorService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required],[this.validatorService.cantBeNameValidator( value => this.categoryService.existsNameCategory(value))]],
    description: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.data) {
      this.myForm.get('name')?.clearAsyncValidators();
      this.myForm.patchValue(this.data);
      this.droppedImage = this.data.showPhoto!;
    }
  }

  get currentCategory(): CategoryDto {
    return this.myForm.value as CategoryDto;
  }

  async saveCategory(): Promise<void> {
    /**
     * POR AHORA ESTOY VALIDANDO AQUI QUE NO HAY UNA FOTO PERO SI EXISTE EN LA BD
     */
    if (!this.imageChanged) {
      this.validatorService.validateSnackBar(
        'Debe seleccionar la imagen nuevamente porfavor!'
      );
      return;
    }
    if (this.imageChanged) {
      try {
        if (!this.data) {
          await firstValueFrom(
            this.categoryService.saveCategoryWithImage(
              this.currentCategory,
              this.droppedFile!
            )
          );
          await Swal.fire('success', 'Categoria agregada con exito', 'success');
        } else {
          await firstValueFrom(
            this.categoryService.updateCategory(
              this.currentCategory,
              this.data.id!,
              this.droppedFile!
            )
          );
          await Swal.fire(
            'success',
            'Categoria actualizada con exito',
            'success'
          );
        }
      } catch (e: HttpErrorResponse | any) {
        this.validatorService.showSnackBarForError(e);
      } finally {
        this.myForm.reset();
        this.dialogRef.close();
      }
    } else {
      if (this.myForm.invalid) {
        this.myForm.markAllAsTouched();
        return;
      }
    }
  }

  onDragOver(event: DragEvent, isOver: boolean) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = isOver;
  }

  onDragLeave(event: DragEvent) {
    this.onDragOver(event, false);
  }

  onDropOrSelect(event: DragEvent | Event) {
    event.preventDefault();
    event.stopPropagation();

    const input =
      (event as DragEvent).dataTransfer ||
      ((event as Event).target as HTMLInputElement);
    if (input) {
      const files = input.files;
      if (files!.length > 0) {
        let file = files![0];
        if (this.validatorService.isImageFile(file)) {
          if (this.validatorService.isFileSizeValid(file, 10)) {
            this.droppedFile = file;
            this.handleImageFile(this.droppedFile);
            console.log(this.droppedFile);
          } else {
            this.validatorService.validateSnackBar(
              'File size exceeds the limit (10 MB)'
            );
          }
        } else {
          this.validatorService.validateSnackBar('File not allowed');
        }
      }
    }
  }
  handleImageFile(file: File) {
    this.droppedImage = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file)
    );
    this.cdr.detectChanges();
    this.imageChanged = true;
  }

  onFieldValitatorRequiredLength(field: string): string | null {
    return this.validatorService.isValidFieldLength(this.myForm, field);
  }

  isValidateField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myForm, field);
  }
}
