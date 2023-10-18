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



@NgModule({
  declarations: [
    UserLayoutComponent,
    ProductsComponent,
    DetailsProductComponent,
    CardComponent,
    DetailsCartComponent,
    AddOrderDetailComponent
  ],
  imports: [
    CommonModule,
    SaleAppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class SalesModule { }
