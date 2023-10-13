export interface OrderDetailProjection {
  id?                     : number;
  fullName                : string;
  fullAddress             : string;
  contactNumber           : string;
  alternativeContactNumber: string;
  orderStatus             : OrderStatus;
  amount                  : number;
  userName                : string;
  productName             : string;
}
export enum OrderStatus {
  DELIVERY,
  IN_PROCESS,
  ORDER_PLACED,
}
