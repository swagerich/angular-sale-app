import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './sales/auth/signup/signup.component';
import { LoginComponent } from './sales/auth/login/login.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch:'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch:'full'
  },
  {
    path: '',
    loadChildren: () =>
      import('./sales/pages/sale.module').then((m) => m.SalesModule),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
