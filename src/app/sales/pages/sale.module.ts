import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleAppRoutingModule } from './sale-app-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CardComponent } from '../components/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';


import { ProductsComponent } from './users/products/products.component';
import { DetailsProductComponent } from './users/details-product/details-product.component';
import { DetailsCartComponent } from './users/details-cart/details-cart.component';
import { UserLayoutComponent } from './users/user-layout/user-layout.component';
import { AddOrderDetailComponent } from './users/add-order-detail/add-order-detail.component';
import { ListProductsComponent } from './admin/products/list-products/list-products.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { UpdateProductComponent } from './admin/products/update-product/update-product.component';



@NgModule({
  declarations: [
    UserLayoutComponent,
    ProductsComponent,
    DetailsProductComponent,
    CardComponent,
    DetailsCartComponent,
    AddOrderDetailComponent,
    ListProductsComponent,
    //admin
    DashboardComponent,
    AddProductComponent,
    AdminLayoutComponent,
    UpdateProductComponent
  ],
  imports: [
    CommonModule,
    SaleAppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class SalesModule { }
