import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './users/products/products.component';
import { UserLayoutComponent } from './users/user-layout/user-layout.component';
import { DetailsProductComponent } from './users/details-product/details-product.component';
import { DetailsCartComponent } from './users/details-cart/details-cart.component';
import { AddOrderDetailComponent } from './users/add-order-detail/add-order-detail.component';

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
        path:'checkout',
        component:DetailsCartComponent
      },
      {
        path:'detail-product/:pId',
        component:DetailsProductComponent
      },
      {
        path:'order-detail',
        component: AddOrderDetailComponent
      }
    ]
  }
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleAppRoutingModule { }
