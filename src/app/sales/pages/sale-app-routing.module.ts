import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './users/products/products.component';
import { UserLayoutComponent } from './users/user-layout/user-layout.component';
import { DetailsProductComponent } from './users/details-product/details-product.component';
import { DetailsCartComponent } from './users/details-cart/details-cart.component';
import { AddOrderDetailComponent } from './users/add-order-detail/add-order-detail.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';
import { UpdateProductComponent } from './admin/products/update-product/update-product.component';
import { ListProductsComponent } from './admin/products/list-products/list-products.component';
import { OrderDetailsComponent } from './admin/order-details/order-details.component';
import { CategoriesComponent } from './admin/category/categories/categories.component';
import { userGuard } from '../auth/guards/user.guard';
import { adminGuard } from '../auth/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },

  //user
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [userGuard],
    children: [
      {
        path: 'shop',
        component: ProductsComponent,
      },
      {
        path: 'checkout',
        component: DetailsCartComponent,
      },
      {
        path: 'detail-product/:pId',
        component: DetailsProductComponent,
      },
      {
        path: 'order-detail',
        component: AddOrderDetailComponent,
      },
    ],
  },
  //admin
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'products',
        component: ListProductsComponent,
      },
      {
        path: 'product-add',
        component: AddProductComponent,
      },
      {
        path: 'edit/:pId',
        component: UpdateProductComponent,
      },
      {
        path:'order-detail',
        component: OrderDetailsComponent
      },
      {
        path:'categories',
        component: CategoriesComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleAppRoutingModule {}
