import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { ProductDto } from 'src/app/sales/interfaces/productDto-interface';
import { ProductService } from 'src/app/sales/services/product.service';
import { SharedDataServiceService } from 'src/app/sales/services/shared/shared-data-service.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
})
export class ListProductsComponent implements OnInit, OnDestroy {
  public productService = inject(ProductService);

  public sharedDataService = inject(SharedDataServiceService);

  public validatorService = inject(ValidatorService);

  public subscription$ = new Subscription();

  public dataPaginacion = new MatTableDataSource<ProductDto>();
  public displayedColumns: string[] = ['product', 'price', 'active', 'actions'];
  public products: ProductDto[] = [];
  public pageIndex = 0;
  public pageSize = 5;
  public totalElements = 0;
  public totalPages = 0;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.subscription$ = this.productService
      .fetchAllPageProduct(this.pageIndex, this.pageSize)
      .pipe(
        switchMap((response) => {
          this.products = response.products;
          this.totalPages = response.pages.totalPages;
          this.totalElements = response.pages.totalElements;
          return from(response.products).pipe(
            mergeMap((p) => {
              if (!p.namePhoto && !p.filePath) {
                return of(null);
              }
              return this.loadProductPhoto(p);
            }),
            filter((p) => p !== null),
            toArray()
          );
        })
      )
      .subscribe({
        next: () => {
          this.dataPaginacion = new MatTableDataSource<ProductDto>(
            this.products
          );
        },
      });
  }

  // Metodo para cargar los productos sin rxjs
  // loadProducts1(): void {
  //   this.subscription$ = this.productService
  //     .fetchAllPageProduct(this.pageIndex, this.pageSize)
  //     .subscribe({
  //       next:(response) => {
  //         response.products.forEach((p) => {
  //         this.products = response.products;
  //          this.totalPages= response.pages.totalPages;
  //          this.totalElements = response.pages.totalElements;
  //          this.dataPaginacion = new MatTableDataSource<ProductDto>(
  //           this.products);
  //           if (p.namePhoto !== null && p.filePath !== null) {
  //             this.productService
  //               .fetchPhotoById(p.id!, p.namePhoto!)
  //               .subscribe({
  //                 next: (response) => {
  //                   const blob = new Blob([response], {
  //                     type: 'image/jpg' || 'image/png',
  //                   });
  //                   const imageUrl = URL.createObjectURL(blob);
  //                   p.productImagen = imageUrl;
  //                 },
  //               });
  //           }
  //         });

  //       }
  //     });
  //   }

  onPageChange(event: PageEvent) {
    this.getPage(event.pageIndex, event.pageSize);
  }

  getPage(nroPagina: number, cantidadPorPagina: number): void {
    this.subscription$ = this.productService
      .fetchAllPageProduct(nroPagina, cantidadPorPagina)
      .pipe(
        mergeMap((response) => {
          this.products = response.products;
          return from(response.products).pipe(
            mergeMap((p) => {
              if (!p.namePhoto && !p.filePath) {
                return of(null);
              }
              return this.loadProductPhoto(p);
            }),
            filter((p) => p !== null),
            toArray()
          );
        })
      )
      .subscribe({
        next: () => {
          this.dataPaginacion = new MatTableDataSource<ProductDto>(
            this.products
          );
        },
      });
  }

  deleteProduct(id: number) {
    let product = this.products.find((p) => p.id === id);
    if (product) {
      Swal.fire({
        title: `Are you sure to delete the product ${product.name}?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(id).subscribe({
            next: () => {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
              this.loadProducts();
            },
          });
        }
      });
    }
  }

  private loadProductPhoto(product: ProductDto): Observable<ProductDto> {
    return this.productService
      .fetchPhotoById(product.id!, product.namePhoto!)
      .pipe(
        map((response) => {
          const blob = new Blob([response], {
            type: 'image/jpg' || 'image/png',
          });
          const imageUrl = URL.createObjectURL(blob);
          product.productImagen = imageUrl;
          return product;
        }),
        catchError((error: HttpErrorResponse) => {
          this.validatorService.showSnackBarForError(error);
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
