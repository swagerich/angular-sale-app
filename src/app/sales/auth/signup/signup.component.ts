import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UsuarioDto } from '../../interfaces/usuarioDto-interface';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,MaterialModule,CommonModule,RouterModule]
})
export class SignupComponent {

  private fb = inject(FormBuilder);

  private validatorService  = inject(ValidatorService);

  private authService = inject(AuthService);

  public formSignup: FormGroup = this.fb.group({
    username: ['',[Validators.required]],
    name: ['',[Validators.required]],
    lastName: ['',[Validators.required]],
    email: ['',[Validators.required]],
    password: ['',[Validators.required]],
    repeatPassword: ['',[Validators.required]]
  });

  get currentUser():UsuarioDto{
    return this.formSignup.value as UsuarioDto;
  }

  onSignup(): void {
    if(this.formSignup.invalid){
      this.formSignup.markAllAsTouched();
      return;
    }
  
  this.authService.signup(this.currentUser).subscribe({
    next:()=>{
      this.validatorService.validateSnackBar('Usuario creado correctamente');
    },
    error:(e :HttpErrorResponse) =>{
      this.validatorService.showSnackBarForError(e);
    }
  })
  }
}
