import { CategoryDto } from './categoryDto-interface';

export interface ProductDto {
  id?: number;
  name: string;
  description: string;
  isStock: boolean;
  price: number;
  category: CategoryDto;
}
