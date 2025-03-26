import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
  }
}
