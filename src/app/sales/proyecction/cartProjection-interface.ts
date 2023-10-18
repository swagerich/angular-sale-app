import { ProductProjection } from './productProjection-interface';

export interface CartProjection {
  carId    : number;
  quantity : number;
  product  : ProductProjection;
}
