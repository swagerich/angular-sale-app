import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDto } from '../interfaces/categoryDto-interface';
import { ApiResponse } from '../interfaces/ApiResponse-interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public fetchAllCategory(): Observable<CategoryDto[]> {
    return this.http.get<ApiResponse>(`${this.endPoint}/category`).pipe(
      map((response) => {
        return response.data as CategoryDto[];
      })
    );
  }

  public saveCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http
      .post<ApiResponse>(`${this.endPoint}/category`, category)
      .pipe(map((response) => response.data as CategoryDto));
  }

  public saveCategoryWithImage(
    category: CategoryDto,
    file: File
  ): Observable<CategoryDto> {
    const formData = new FormData();
    formData.append(
      'category',
      new Blob([JSON.stringify(category)], { type: 'application/json' })
    );
    formData.append('file', file);
    return this.http
      .post<ApiResponse>(`${this.endPoint}/category`, formData)
      .pipe(map((response) => response.data as CategoryDto));
  }

  public viewPhoto(
    categoryId: number,
    fileName: string
  ): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(
      `${this.endPoint}/category/view/${categoryId}/${fileName}`,
      { responseType: 'arraybuffer' as 'json' }
    );
  }

  public updateCategory(
    category: CategoryDto,
    categoryId: number,
    file: File
  ): Observable<CategoryDto> {
    const formData = new FormData();
    formData.append(
      'category',
      new Blob([JSON.stringify(category)], { type: 'application/json' })
    );
    formData.append('file', file);
    return this.http
      .put<ApiResponse>(`${this.endPoint}/category/${categoryId}`, formData)
      .pipe(map((response) => response.data as CategoryDto));
  }

  public deleteCategory(categoryId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.endPoint}/category/delete/${categoryId}`
    );
  }

  public existsNameCategory(name: string): Observable<boolean> {
    return this.http
      .get<ApiResponse>(`${this.endPoint}/category/exists/${name}`)
      .pipe(
        map((response) => {
          return response.data as boolean;
        })
      );
  }
}
