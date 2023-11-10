import { CartDto } from './cartDto-interface';
import { CategoryDto } from './categoryDto-interface';
import { OrderDetailDto } from './orderDetailDto-interface';
import { OrderDetailPageOfUserDto } from './orderDetailOfPage-interface';
import { OrderStatusDto } from './orderStatusDto-interface';
import { ProductDto } from './productDto-interface';
import { ProductDtoOfPage } from './productDtoOfPage-interface';
import { QuantityProductsDto } from './quantityProductsDto-interface';
import { UsuarioDto } from './usuarioDto-interface';

export interface ApiResponse {
  error?: boolean;
  statusCode?: number;
  title?: string;
  message?: string;
  type?: string;
  date?: string;
  data:
    | CartDto
    | CartDto[]
    | CategoryDto
    | CategoryDto[]
    | ProductDto
    | ProductDto[]
    | UsuarioDto
    | UsuarioDto[]
    | ProductDtoOfPage
    | QuantityProductsDto
    | OrderDetailPageOfUserDto
    | OrderStatusDto //orderStatus
    | OrderDetailDto
    | boolean
}
