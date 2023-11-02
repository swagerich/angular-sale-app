import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductService } from 'src/app/sales/services/product.service';
import { ProductDto } from '../../../interfaces/productDto-interface';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  delay,
  filter,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { CategoryService } from 'src/app/sales/services/category.service';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidatorService } from 'src/app/utils/service/validator.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private validatorService = inject(ValidatorService);

  public subscription$ = new Subscription();

  public categories: CategoryDto[] = [];
  public products: ProductDto[] = [];
  public pageSize = 9;
  public pageIndex = 0;
  public totalElements = 0;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.subscription$ = this.productService
      .fetchAllPageProductActive(this.pageIndex, this.pageSize)
      .pipe(
        delay(1),
        switchMap((response) => {
          this.totalElements = response.pages.totalElements;
          this.products = response.products;
          return from(response.products).pipe(
            mergeMap((p) => {
              if (!p.namePhoto && !p.filePath) {
                return of(null);
              }
              return this.loadProductImage(p);
            }),
            filter((product) => product !== null),
            toArray()
          );
        })
      )
      .subscribe({
        next: () => {},
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  loadCategories(): void {
    this.subscription$ = this.categoryService.fetchAllCategory().subscribe({
      next: (response) => {
        this.categories = response;
      },
    });
  }

  loadProductsByCategoryName(categoryName: string): void {
    this.subscription$ = this.productService
      .fetchAllPageProductActiveByCategoryName(
        categoryName,
        this.pageIndex,
        this.pageSize
      )
      .pipe(
        delay(1),
        switchMap((response) => {
          this.totalElements = response.pages.totalElements;
          this.products = response.products;
          this.pageIndex = 0;
          return from(response.products).pipe(
            mergeMap((p) => {
              if (!p.namePhoto && !p.filePath) {
                return of(null);
              }
              return this.loadProductImage(p);
            }),
            filter((product) => product !== null),
            toArray()
          );
        })
      )
      .subscribe(() => {});
  }

  private loadProductImage(product: ProductDto): Observable<ProductDto> {
    return this.productService
      .fetchPhotoById(product.id!, product.namePhoto)
      .pipe(
        map((response) => {
          const blob = new Blob([response], {
            type: 'image/jpeg' || 'image/png',
          });
          product.productImagen = URL.createObjectURL(blob);
          return product;
        }),
        catchError((e: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(e);
          return EMPTY;
        })
      );
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
