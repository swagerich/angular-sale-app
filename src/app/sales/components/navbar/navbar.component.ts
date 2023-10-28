import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  isLogged(): boolean {
   return this.authService.getUserRole() == "ROLE_USER" ? true : false;
  }
}
