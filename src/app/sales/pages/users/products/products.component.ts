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
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
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

  public selectedNameCategory: string = '';

  public isLoading: boolean = false;

  public categories: CategoryDto[] = [];
  public products: ProductDto[] = [];
  public pageSize = 5;
  public pageIndex = 0;
  public totalElements = 0;
  categoryPageIndices: { [key: string]: number } = {};
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.selectedNameCategory = '';
    this.subscription$ = this.productService
      .fetchAllPageProductActive(this.pageIndex, this.pageSize)
      .pipe(
        delay(1000),
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
        next: () => {
          this.isLoading = false;
        },
      });
  }

  // loadCategoriess(): void {
  //   this.subscription$ = this.categoryService.fetchAllCategory().subscribe({
  //     next: (response: CategoryDto[]) => {
  //       const totalCategoryShow = 6;
  //       let categorysDto = response
  //         .filter((c) => c.id! <= totalCategoryShow)
  //         .map((c) => {
  //           if (c.fileName !== null && c.filePath !== null) {
  //             this.subscription$ = this.categoryService
  //               .viewPhoto(c.id!, c.fileName)
  //               .subscribe({
  //                 next: (array: ArrayBuffer) => {
  //                   const blod = new Blob([array], {
  //                     type: 'image/jpeg' || 'image/png',
  //                   });
  //                   c.showPhoto = URL.createObjectURL(blod);
  //                 },
  //               });
  //           }
  //           return c;
  //         });
  //       this.categories = categorysDto;
  //     },
  //   });
  // }

  loadCategories(): void {
    const totalCategoryShow = 6;
    this.subscription$ = this.categoryService
      .fetchAllCategory()
      .pipe(
        switchMap((response: CategoryDto[]) => {
          let categorysDtoObserver = response
            .filter((c) => c.id! <= totalCategoryShow)
            .map((c) => {
              if (c.fileName !== null && c.filePath !== null) {
                return this.categoryService.viewPhoto(c.id!, c.fileName).pipe(
                  map((array: ArrayBuffer) => {
                    const blod = new Blob([array], {
                      type: 'image/jpeg' || 'image/png',
                    });
                    c.showPhoto = URL.createObjectURL(blod);
                    return c;
                  }),
                  catchError((e: HttpErrorResponse) => {
                    this.validatorService.showSnackBarForError(e);
                    return of(c);
                  })
                );
              } else {
                return of(c);
              }
            });
          return forkJoin(categorysDtoObserver);
        })
      )
      .subscribe({
        next: (categories: CategoryDto[]) => {
          this.categories = categories;
        },
      });
  }

  loadProductsByCategoryName(categoryName: string): void {
    this.isLoading = true;
    this.selectedNameCategory = categoryName;
    this.subscription$ = this.productService
      .fetchAllPageProductActiveByCategoryName(
        this.selectedNameCategory,
        this.pageIndex,
        this.pageSize
      )
      .pipe(
        delay(1000),
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
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.selectedNameCategory) {
      this.loadProductsByCategoryName(this.selectedNameCategory);
    } else {
      this.loadProducts();
    }
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
