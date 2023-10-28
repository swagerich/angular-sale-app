import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequestDto } from '../interfaces/loginRequestDto-interface';

import { UsuarioDto } from '../interfaces/usuarioDto-interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endPoint: string = environment.baseUrl;

  public loginStatus$ = new BehaviorSubject(false);

  private router = inject(Router);

  private http = inject(HttpClient);

  public login(login: LoginRequestDto): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.endPoint}/auth/login`, login);
  }

  public signup(usuario: UsuarioDto): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.endPoint}/auth/signup`, usuario);
  }

  logout(): void {
    localStorage.clear();
    this.loginStatus$.next(false);
    this.router.navigate(['/login']);
  }

  setToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  setUser(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getToken());
    console.log(decodedToken);
    localStorage.setItem('user', JSON.stringify(decodedToken));
  }

  existsToken(): boolean {
    return this.getToken() !== null || this.getToken() !== undefined || this.getToken() !== '';
  }

  getUser(): any {
    let user = localStorage.getItem('user');
    if (user != null) {
      return JSON.parse(user);
    } else {
      this.logout();
      return null;
    }
  }

  getUserRole(): any{
    let userJson = this.getUser();
    return userJson.authorities[0].authority;
  }
}
