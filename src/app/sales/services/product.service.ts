import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environments/environment';

import { ProductDto } from '../interfaces/productDto-interface';
import { Observable, map, of } from 'rxjs';
import { ProductDtoOfPage } from '../interfaces/productDtoOfPage-interface';
import { ApiResponse } from '../interfaces/ApiResponse-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public fetchAllPageProductActive(
    page: number,
    size: number
  ): Observable<ProductDtoOfPage> {
    return this.http
      .get<ApiResponse>(
        `${this.endPoint}/product/page?page=${page}&size=${size}`
      )
      .pipe(
        map((response) => {
          return response.data as ProductDtoOfPage;
        })
      );
  }

  public saveProductToPhoto(
    product: ProductDto,
    file: File
  ): Observable<ProductDto> {
    return this.http
      .post<ApiResponse>(
        `${this.endPoint}/product/foto`,
        this._createFormData(product, file)
      )
      .pipe(
        map((response) => {
          return response.data as ProductDto;
        })
      );
  }

  public fetchAllPageProduct(
    page: number,
    size: number
  ): Observable<ProductDtoOfPage> {
    return this.http
      .get<ApiResponse>(
        `${this.endPoint}/product/page-all?page=${page}&size=${size}`
      )
      .pipe(
        map((response) => {
          return response.data as ProductDtoOfPage;
        })
      );
  }

  public deleteProduct(productId: number): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>(`${this.endPoint}/product/${productId}`);
  }

  public fetchPhotoById(
    productId: number,
    fileName: string
  ): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(
      `${this.endPoint}/product/getphoto/${productId}/${fileName}`,
      {
        responseType: 'arraybuffer' as 'json',
      }
    );
  }

  public fetchProductById(productId: number): Observable<ProductDto> {
    return this.http
      .get<ApiResponse>(`${this.endPoint}/product/${productId}`)
      .pipe(map((response) => response.data as ProductDto));
  }

  public updateProductPhotoById(
    product: ProductDto,
    productId: number,
    file: File
  ): Observable<ProductDto> {
    return this.http
      .put<ApiResponse>(
        `${this.endPoint}/product/foto/${productId}`,
        this._createFormData(product, file)
      )
      .pipe(
        map((response) => {
          return response.data as ProductDto;
        })
      );
  }

  public updateProductById(
    product: ProductDto,
    productId: number
  ): Observable<ProductDto> {
    return this.http
      .put<ApiResponse>(
        `${this.endPoint}/product/${productId}`,
      product
      )
      .pipe(
        map((response) => {
          return response.data as ProductDto;
        })
      );
  }
  

  public fetchAllPageProductActiveByCategoryName(
    categoryName: string,
    page: number,
    size: number
  ): Observable<ProductDtoOfPage> {
    return this.http
      .get<ApiResponse>(
        `${this.endPoint}/product/page-name/${categoryName}?page=${page}&size=${size}`
      )
      .pipe(
        map((response) => {
          return response.data as ProductDtoOfPage;
        })
      );
  }

  //falta HACER EL productAllPage
  //y el productAllPageByCagory

  private _createFormData(entity: ProductDto, file: File | null): FormData {
    const form = new FormData();
    form.append(
      'data',
      new Blob([JSON.stringify(entity)], {
        type: 'application/json',
      })
    );
    if (file !== null) form.append('file', file);
    return form;
  }
}
