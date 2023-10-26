import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css'],
})
export class CreateUpdateComponent implements OnInit {


  constructor(
  private dialogRef: MatDialogRef<CreateUpdateComponent>,
  @Inject(MAT_DIALOG_DATA) public data: CategoryDto,
  private validatorService: ValidatorService,
  private categoryService: CategoryService,
  private fb: FormBuilder
) {}

public myForm: FormGroup = this.fb.group({
  name: ['', [Validators.required]],
  description: ['', [Validators.required]],
});


  ngOnInit(): void {
   this.myForm.patchValue(this.data);
  }

  get currentCategory(): CategoryDto {
    return this.myForm.value as CategoryDto;
  }

  async saveCategory(): Promise<void> {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    try {
      if (!this.data) {
        await firstValueFrom(
          this.categoryService.saveCategory(this.currentCategory)
        );
      } else {
        await firstValueFrom(
          this.categoryService.updateCategory(
            this.currentCategory,
            this.data.id!
          )
        );
      }
    } catch (e: HttpErrorResponse | any) {
      this.validatorService.showSnackBarForError(e);
    } finally {
      this.myForm.reset();
      this.dialogRef.close();
    }
  }

  isValidateField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myForm, field);
  }
}
