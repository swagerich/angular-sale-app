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

  public updateCategory(
    category: CategoryDto,
    categoryId: number
  ): Observable<CategoryDto> {
    return this.http
      .put<ApiResponse>(`${this.endPoint}/category/${categoryId}`, category)
      .pipe(map((response) => response.data as CategoryDto));
  }
}
