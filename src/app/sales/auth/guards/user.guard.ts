import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const userGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.existsToken() && auth.getUserRole() === 'ROLE_USER') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
