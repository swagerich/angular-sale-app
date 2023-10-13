import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDto } from '../interfaces/categoryDto-interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  
  private endPoint: string = environment.baseUrl;

  private http = inject(HttpClient);

  public fetchAllCategory(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.endPoint}/category`);
  }

  public saveCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${this.endPoint}/category`, category);
  }
}
