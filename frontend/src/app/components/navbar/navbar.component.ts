import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  profileImage: string = 'assets/default-avatar.svg';

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  getBackendBaseUrl(): string {
    const protocol = window.location.protocol;
    let port = protocol === 'https:' ? '8080' : '8082';
    return `${protocol}//localhost:${port}`;
  }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;

      // 🔥 ALWAYS reload latest user from localStorage
      const storedUser = localStorage.getItem('fl_user');
      this.currentUser = storedUser ? JSON.parse(storedUser) : user;

      if (this.currentUser?.profileImage) {
        this.profileImage =
          this.getBackendBaseUrl() +
          this.currentUser.profileImage +
          '?t=' +
          new Date().getTime();
      } else {
        this.profileImage = 'assets/default-avatar.svg';
      }
    });
  }

  openProfileDialog(): void {
    this.dialog.open(ProfileDialogComponent, {
      width: '320px',
      position: {
        top: '70px',
        right: '20px'
      },
      panelClass: 'profile-dialog-panel',
      backdropClass: 'transparent-backdrop'
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}