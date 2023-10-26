import { CategoryDto } from './categoryDto-interface';

export interface ProductDto {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  price: number;
  namePhoto: string;
  filePath:string;
  category: CategoryDto;
  productImagen?: string;
}
