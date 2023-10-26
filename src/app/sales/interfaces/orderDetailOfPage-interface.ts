import { OrderDetailProjection } from '../proyecction/orderDetailProjection-interface';

export interface OrderDetailPageOfUserDto {
  orders: OrderDetailProjection[];
  pages: Pages;
}

export interface Pages {
  totalPages: number;
  pageNumber: number;
  totalElements: number;
}
