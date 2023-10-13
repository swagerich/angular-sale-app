import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './users/products/products.component';
import { UserLayoutComponent } from './users/user-layout/user-layout.component';
import { AddCartComponent } from './users/add-cart/add-cart.component';
import { DetailsProductComponent } from './users/details-product/details-product.component';

const routes: Routes = [
  {
  path:'',
  component:ProductsComponent
  },

  //user
  {
    path:'shop',
    component:UserLayoutComponent,
    children:[
      {
        path:'add',
        component:AddCartComponent
      },
      {
        path:'detail-product/:pId',
        component:DetailsProductComponent
      }
    ]
  }
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleAppRoutingModule { }
