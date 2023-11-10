import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { ProductDto } from 'src/app/sales/interfaces/productDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ProductService } from 'src/app/sales/services/product.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private validatorService = inject(ValidatorService);

  public subscription$ = new Subscription();

  private fb = inject(FormBuilder);

  public categories: CategoryDto[] = [];

  public myFormProduct: FormGroup = this.fb.group({
    id: 0,
    name: ['', [Validators.required],[this.validatorService.cantBeNameValidator((value) => this.productService.existsNameProduct(value))]],
    description: ['', [Validators.required]],
    active: [false, []],
    price: ['', [Validators.required]],
    file: ['', [Validators.required]],
    category: ['', [Validators.required]],
  });

  public selectedFile: File | undefined;

  public imageUrl: string | undefined;

  ngOnInit(): void {
    this.loadCategories();
  }

  get currentProduct(): ProductDto {
    return this.myFormProduct.value as ProductDto;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (this.validatorService.isImageFile(file)) {
      if (this.validatorService.isFileSizeValid(file, 10)) {
        this.imageUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      } else {
        this.validatorService.validateSnackBar(
          'File size exceeds the limit (10 MB)'
        );
      }
    } else {
      this.validatorService.validateSnackBar('File not allowed');
    }
    event.target.value = '';
  }

  saveProduct(): void {
    if (this.myFormProduct.invalid || !this.selectedFile) {
      this.myFormProduct.markAllAsTouched();
      return;
    }
    this.productService
      .saveProductToPhoto(this.currentProduct, this.selectedFile!)
      .subscribe({
        next: (a) => {
          console.log(a);
        },
        error: (e: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(e);
        },
      });
  }

  loadCategories(): void {
    this.subscription$ = this.categoryService.fetchAllCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }

  isValidateField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myFormProduct, field);
  }
  
  onFieldValitatorRequiredLength(field: string): string | null {
    return this.validatorService.isValidFieldLength(this.myFormProduct, field);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
