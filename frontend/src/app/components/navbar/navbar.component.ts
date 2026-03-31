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

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      this.profileImage = this.auth.getProfileImageUrl(user);
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