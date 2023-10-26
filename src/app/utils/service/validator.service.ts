import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  private snackBar = inject(MatSnackBar);

  public isValidField = (myForm: FormGroup, field: string): boolean | null => {
    return myForm.controls[field].errors && myForm.controls[field].touched;
  };

  /* MOSTRAR SNACKBAR MATERIAL  */
  validateSnackBar(error: string): void {
    this.snackBar.open(error, 'done', {
      duration: 3000,
    });
  }

  /* VALIDAR LONGITUD */
  public isValidFieldLength = (
    myForm: FormGroup,
    field: string
  ): string | null => {
    if (!myForm.controls[field]) return null;
    const error = myForm.controls[field].errors || {};
    for (let e of Object.keys(error)) {
      switch (e) {
        case 'required':
          return 'required';
        case 'minlength':
          return `the minimum length is ${error['minlength'].requiredLength} characters`;
        case 'maxlength':
          return `the maximun length is ${error['maxlength'].requiredLength} characters`;
      }
    }
    return null;
  };

  /* VALIDACIONES PATTERN */
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';

  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  /* VALIDATORS  HTTP STATUS */

  showSnackBarForError(error: HttpErrorResponse): void {
    const HTTP_STATUS_UNAUTHORIZED = 401;
    const HTTP_STATUS_NOT_FOUND = 404;
    const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
    const HTTP_STATUS_NOT_ACCEPTABLE = 406;
    const HTTP_STATUS_FORBIDDEN = 403;
    const HTTP_STATUS_BAD_REQUEST = 400

    let message = 'An error occurred in the backend';
    
    if (error.error && error.error.detail) {
      message = error.error.detail;
    } else if (error.status === HTTP_STATUS_FORBIDDEN) {
      message = 'You don t have permissions';
    } else if (error.status === HTTP_STATUS_UNAUTHORIZED) {
      message = 'You don\'t have authorization';
    } else if (error.status === HTTP_STATUS_NOT_FOUND) {
      message = 'Page not found';
    } else if (error.status === HTTP_STATUS_NOT_ACCEPTABLE) {
      message = 'Not Acceptable';
    } else if (error.status === HTTP_STATUS_BAD_REQUEST) {
      message = 'Bad Request';
    } else if (error.status === HTTP_STATUS_INTERNAL_SERVER_ERROR) {
      message = 'A problem occurred in the system';
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
