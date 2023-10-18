import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';
import { CartDto } from '../interfaces/cartDto-interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public addProductToCart(productId:number,userId:number,quantity:number): Observable<any> {
    return this.http.post<any>(`${this.endPoint}/cart/add/${productId}/${userId}/${quantity}`,{})
  }

  public fetchCartByUserId(userId:number): Observable<CartDto> {
    return this.http.get<CartDto>(`${this.endPoint}/cart/${userId}`);
  }
  
  public removeProductFromCart(cartId:number,productId:number): Observable<void> {
     return  this.http.delete<void>(`${this.endPoint}/cart/delete/${cartId}/${productId}`);
  }

  public updateProductQuantity(cartId:number,quantity:number): Observable<any> {
    return this.http.put<any>(`${this.endPoint}/cart/update/${cartId}/${quantity}`,{});
  }
}
