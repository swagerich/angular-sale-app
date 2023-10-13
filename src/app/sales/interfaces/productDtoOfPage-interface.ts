import { ProductDto } from './productDto-interface';

export interface ProductDtoOfPage {
  products: ProductDto[];
  pages: Page;
}

interface Page {
  totalElements: number;
  pageNumber: number;
  totalPages: number;
}
