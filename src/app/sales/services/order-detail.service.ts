import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Observable, of, map } from 'rxjs';
import { OrderDetailPageOfUserDto } from '../interfaces/orderDetailOfPage-interface';
import { ApiResponse } from '../interfaces/ApiResponse-interface';
import { OrderStatus } from '../proyecction/orderDetailProjection-interface';
import { OrderStatusDto } from '../interfaces/orderStatusDto-interface';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public fetchOrderDetail(
    page: number,
    size: number
  ): Observable<OrderDetailPageOfUserDto> {
    return this.http
      .get<ApiResponse>(
        `${this.endPoint}/orderDetail/users?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.data as OrderDetailPageOfUserDto));
  }

  public fetchOrderStatus(): Observable<OrderStatusDto> {
    return this.http
      .get<ApiResponse>(`${this.endPoint}/orderDetail/status`)
      .pipe(map((response) => response.data as OrderStatusDto));
  }

  public changeOrderStatus(orderId: number,orderStatus: OrderStatus): Observable<boolean> {
    return this.http.patch<ApiResponse>(
      `${this.endPoint}/orderDetail/change/${orderId}/${orderStatus}`,
      {}
    ).pipe(map((response) => response.data as any));
  }
}
