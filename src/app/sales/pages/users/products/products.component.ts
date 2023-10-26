import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductService } from 'src/app/sales/services/product.service';
import { ProductDto } from '../../../interfaces/productDto-interface';
import { Subscription, delay } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { CategoryService } from 'src/app/sales/services/category.service';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit,OnDestroy {

  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

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
  this.subscription$ =  this.productService
      .fetchAllPageProductActive(this.pageIndex, this.pageSize)
      .pipe(delay(1))
      .subscribe({
        next: (valor) => {
          this.totalElements = valor.pages.totalElements;
          this.products = valor.products;
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

   loadCategories(): void {
  this.subscription$ =   this.categoryService.fetchAllCategory().subscribe({
      next: (data) => {
        this.categories = data;
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
        delay(1)
      )
      .subscribe((p) => {
        this.totalElements = p.pages.totalElements;
        this.products = p.products;
        this.pageIndex = 0;
      });
  }

  ngOnDestroy(): void {
    if(this.subscription$){
      this.subscription$.unsubscribe();
    }
  }

}
