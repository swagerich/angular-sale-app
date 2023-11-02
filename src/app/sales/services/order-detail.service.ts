import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Observable, map } from 'rxjs';
import { OrderDetailPageOfUserDto } from '../interfaces/orderDetailOfPage-interface';
import { ApiResponse } from '../interfaces/ApiResponse-interface';
import { OrderStatus } from '../proyecction/orderDetailProjection-interface';
import { OrderStatusDto } from '../interfaces/orderStatusDto-interface';
import { OrderDetailDto } from '../interfaces/orderDetailDto-interface';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public saveOrderDetail(order: OrderDetailDto): Observable<any> {
    return this.http
      .post<ApiResponse>(`${this.endPoint}/orderDetail`, order)
      .pipe(map((response) => response.data as any));
  }

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

  public fetchOrderDetaiilByUser(
    userId: number,
    page: number,
    size: number
  ): Observable<OrderDetailPageOfUserDto> {
    return this.http
      .get<ApiResponse>(
        `${this.endPoint}/orderDetail/${userId}?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.data as OrderDetailPageOfUserDto));
  }

  public checkoutOrderDetailByUser(userId: number): Observable<boolean> {
    return this.http
      .get<ApiResponse>(`${this.endPoint}/orderDetail/exists/${userId}`)
      .pipe(map((response) => response.data as any));
  }

  public fetchOrderStatus(): Observable<OrderStatusDto> {
    return this.http
      .get<ApiResponse>(`${this.endPoint}/orderDetail/status`)
      .pipe(map((response) => response.data as OrderStatusDto));
  }

  public changeOrderStatus(
    orderId: number,
    orderStatus: OrderStatus
  ): Observable<boolean> {
    return this.http
      .patch<ApiResponse>(
        `${this.endPoint}/orderDetail/change/${orderId}/${orderStatus}`,
        {}
      )
      .pipe(map((response) => response.data as any));
  }
}
