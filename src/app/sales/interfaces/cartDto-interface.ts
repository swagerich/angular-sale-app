import { ProductProjection } from "../proyecction/ProductProjection-interface";

export interface CartDto {
  cartItem : CartItemDto[];
  totalCost: number;
}

export interface CartItemDto {
  id      : number;
  quantity: number;
  product : ProductProjection;
}

