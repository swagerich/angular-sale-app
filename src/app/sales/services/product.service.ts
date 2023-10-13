import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environments/environment';

import { ProductDto } from '../interfaces/productDto-interface';
import { Observable } from 'rxjs';
import { ProductDtoOfPage } from '../interfaces/productDtoOfPage-interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);


  public fetchAllPageProduct(page:number,size:number):Observable<ProductDtoOfPage>{
    return this.http.get<ProductDtoOfPage>(`${this.endPoint}/product/page?page=${page}&size=${size}`);
  }

  public saveProduct(product: ProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(`${this.endPoint}/product`,product);
  }

  public fetchProductById(productId:number):Observable<ProductDto>{
    return this.http.get<ProductDto>(`${this.endPoint}/product/${productId}`);
  }

  public updateProductById(product:ProductDto,productId:number):Observable<ProductDto>{
    return this.http.put<ProductDto>(`${this.endPoint}/product/${productId}`,product);
  }

  public fetchAllPageProductByCategoryName(categoryName:string,page:number,size:number):Observable<ProductDtoOfPage>{
    return this.http.get<ProductDtoOfPage>(`${this.endPoint}/product/page-name/${categoryName}?page=${page}&size=${size}`);
  }
  
  //falta HACER EL productAllPage
  //y el productAllPageByCagory
}
