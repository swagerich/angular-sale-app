export interface OrderDetailDto {
  id?: number;
  fullName: string;
  fullAddress: string;
  contactNumber: string;
  alternativeContactNumber: string;
  products: OrderProductQuantityListDto[];
}

export interface OrderProductQuantityListDto {
  productId: number;
  userId: number;
}
