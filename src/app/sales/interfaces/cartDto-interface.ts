import { ProductProjection } from "../proyecction/productProjection-interface";

export interface CartDto {
  cartItem : CartItemDto[];
  totalCosto: number;
}
export interface CartItemDto {
  id      : number;
  quantity: number;
  product : ProductProjection;
}

