import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { of, Subscription, switchMap, tap } from 'rxjs';
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
          const category = this.categories.find((c) => c.id === product.category.id);
          if (category) {
            product.category = category;
          }
          this.selectedFileName = product.namePhoto!;
          this.productId = product.id!;
          this.myFormProduct.reset(product);
        }),
        switchMap((p: ProductDto) => {
          if (p.namePhoto === null) {
            return of();
          }
          return this.productService.fetchPhotoById(p.id!, p.namePhoto!);
        })
      )
      .subscribe({
        next: (buffer: ArrayBuffer) => {
          const blob = new Blob([buffer], { type: 'image/jpg' || 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
          this.imageUrl = imageUrl;
        },
        error: (e: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(e);
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
    if (file) {
      const allowedFormats = ['image/jpeg', 'image/png'];
      if (allowedFormats.includes(file.type)) {
        this.imageUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      } else {
        // Swal.fire('Opps!','File not allowed','warning');
        console.error('No permitido');
        this.imageUrl = undefined;
        this.selectedFile = undefined;
      }
    }
  }

  updateProduct(): void {
    const product = { ...this.myFormProduct.value } as ProductDto;
    if (this.selectedFile) {
      if (this.myFormProduct.invalid) {
        this.myFormProduct.markAllAsTouched();
        return;
      }
   this.subscription$ =  this.productService
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

  public isValidateField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myFormProduct, field);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
