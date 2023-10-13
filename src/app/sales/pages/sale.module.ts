import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleAppRoutingModule } from './sale-app-routing.module';
import { UserLayoutComponent } from './users/user-layout/user-layout.component';

import { ProductsComponent } from './users/products/products.component';
import { DetailsProductComponent } from './users/details-product/details-product.component';
import { AddCartComponent } from './users/add-cart/add-cart.component';

import { MaterialModule } from 'src/app/material/material.module';
import { CardComponent } from '../components/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserLayoutComponent,
    ProductsComponent,
    DetailsProductComponent,
    AddCartComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    SaleAppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class SalesModule { }
