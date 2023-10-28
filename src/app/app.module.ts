import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalTemplateComponent } from './sales/components/modal-template/modal-template.component';
import { LoginComponent } from './sales/auth/login/login.component';
import { SignupComponent } from './sales/auth/signup/signup.component';
import { authInterceptorProviders } from './sales/auth/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    ModalTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //==standalone==
    LoginComponent,
    SignupComponent
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
