import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { Subscription } from 'rxjs';
import { LoginRequestDto } from '../../interfaces/loginRequestDto-interface';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule, RouterModule],
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  private subscription$ = new Subscription();

  private validatorService = inject(ValidatorService);

  public formLogin: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get currentUser(): LoginRequestDto {
    return this.formLogin.value as LoginRequestDto;
  }

  onLogin(): void {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    this.subscription$ = this.authService.login(this.currentUser).subscribe({
      next: (response) => {
        this.authService.setToken(response.accessToken);
        this.authService.setUser();
        console.log(response);
        if (this.authService.getUserRole() === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/dashboard']);
          this.authService.loginStatus$.next(true);
        } else if (this.authService.getUserRole() === 'ROLE_USER') {
          this.router.navigate(['/user/shop']);
          this.authService.loginStatus$.next(true);
        } else {
          this.authService.logout();
        }
      },
      error: (e: HttpErrorResponse) => {
        this.validatorService.showSnackBarForError(e);
      },
    });
  }
  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
