import { ProductProjection } from './ProductProjection-interface';

export interface CartProjection {
  carId    : number;
  quantity : number;
  product  : ProductProjection;
}
