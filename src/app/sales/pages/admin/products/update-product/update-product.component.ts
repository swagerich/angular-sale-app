import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import {
  catchError,
  EMPTY,
  of,
  Subscription,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { ProductDto } from 'src/app/sales/interfaces/productDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ProductService } from 'src/app/sales/services/product.service';
import { ValidatorService } from '../../../../../utils/service/validator.service';
import Swal from 'sweetalert2';
import { SharedDataServiceService } from 'src/app/sales/services/shared/shared-data-service.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private fb = inject(FormBuilder);

  public categories: CategoryDto[] = [];

  public activateRoute = inject(ActivatedRoute);

  public validatorService = inject(ValidatorService);

  public sharedDataService = inject(SharedDataServiceService);

  public subscription$ = new Subscription();

  public selectedFile: File | undefined;

  public imageUrl: string | undefined;

  public selectedFileName: string = '';

  public productId: number = 0;

  public myFormProduct: FormGroup = this.fb.group({
    id: 0,
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    active: [false, []],
    price: ['', [Validators.required, Validators.min(0)]],
    file: ['', [Validators.required]],
    category: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductById();
  }

  loadProductById(): void {
    this.subscription$ = this.activateRoute.params
      .pipe(
        switchMap((params: Params) =>
          this.productService.fetchProductById(params['pId'])
        ),
        tap((product) => {
          if (product.category) {
            const category = this.categories.find(
              (c) => c.id === product.category.id
            );
            if (category) {
              product.category = category;
            }
            this.selectedFileName = product.namePhoto!;
            this.productId = product.id!;
            this.myFormProduct.reset(product);
          } else {
            this.selectedFileName = product.namePhoto!;
            this.productId = product.id!;
            this.myFormProduct.reset(product);
          }
        }),
        switchMap((p: ProductDto) => {
          if (p.namePhoto === null) {
            return of();
          }
          return this.productService.fetchPhotoById(p.id!, p.namePhoto!);
        }),
        catchError((e: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(e);
          return EMPTY;
        })
      )
      .subscribe({
        next: (buffer: ArrayBuffer) => {
          const blob = new Blob([buffer], { type: 'image/jpg' || 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
          this.imageUrl = imageUrl;
        },
      });
  }

  loadCategories(): void {
    this.subscription$ = this.categoryService.fetchAllCategory().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (e: HttpErrorResponse) => {
        this.validatorService.showSnackBarForError(e);
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (this.validatorService.isImageFile(file)) {
      if (this.validatorService.isFileSizeValid(file, 10)) {
        this.imageUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      } else {
        this.validatorService.validateSnackBar('File size exceeds the limit (10 MB)');
      }
    } else {
      this.validatorService.validateSnackBar('File not allowed');
    }
    event.target.value = '';
  }

  updateProduct(): void {
    const product = { ...this.myFormProduct.value } as ProductDto;
    if (this.selectedFile) {
      if (this.myFormProduct.invalid) {
        this.myFormProduct.markAllAsTouched();
        return;
      }
      this.subscription$ = this.productService
        .updateProductPhotoById(product, this.productId, this.selectedFile!)
        .subscribe({
          next: () => {
            Swal.fire(
              'Updated!',
              'The data and image have been updated.',
              'success'
            );
          },
          error: (e: HttpErrorResponse) => {
            this.validatorService.showSnackBarForError(e);
          },
        });
    } else {
      this.myFormProduct.get('file')?.clearValidators();
      if (this.myFormProduct.get('category')?.invalid) {
        this.myFormProduct.get('category')?.markAsTouched();
        return;
      }
      this.productService.updateProductById(product, this.productId).subscribe({
        next: () => {
          Swal.fire('Updated!', 'The data has been updated.', 'success');
        },
        error: (e: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(e);
        },
      });
    }
  }

  isValidateField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myFormProduct, field);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
