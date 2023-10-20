import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from 'src/app/environments/environment';
import { Observable, map, of } from 'rxjs';
import { CartDto } from '../interfaces/cartDto-interface';
import { ApiResponse } from '../interfaces/ApiResponse-interface';
import { QuantityProductsDto } from '../interfaces/quantityProductsDto-interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public addProductToCart(productId:number,userId:number,quantity:number): Observable<QuantityProductsDto> {
    return this.http.post<ApiResponse>(`${this.endPoint}/cart/add/${productId}/${userId}/${quantity}`,{})
    .pipe(map((response) => response.data  as QuantityProductsDto));
  }

  public fetchCartByUserId(userId:number): Observable<CartDto> {
    return this.http.get<ApiResponse>(`${this.endPoint}/cart/${userId}`)
    .pipe(map((response) => response.data as CartDto));
  }
  
  public removeProductFromCart(cartId:number,productId:number): Observable<void> {
     return  this.http.delete<ApiResponse>(`${this.endPoint}/cart/delete/${cartId}/${productId}`)
     .pipe(map((response) =>  {
         of(response);
     }));
  }

  public updateProductQuantity(cartId:number,quantity:number): Observable<QuantityProductsDto> {
    return this.http.put<ApiResponse>(`${this.endPoint}/cart/update/${cartId}/${quantity}`,{})
    .pipe(map((response) => response.data as QuantityProductsDto));
  }
}
