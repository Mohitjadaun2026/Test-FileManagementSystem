import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
selector: 'app-navbar',
templateUrl: './navbar.component.html',
styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

// Tracks whether the user is logged in
isLoggedIn: boolean = false;
currentUser: User | null = null;
profileImage: string = 'assets/default-avatar.svg';

constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to login/logout events
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user || null;
      if (user) {
        this.loadProfileImage();
      }
    });
  }

  loadProfileImage(): void {
    if (this.currentUser?.id) {
      const storedImage = localStorage.getItem(`profile_image_${this.currentUser.id}`);
      if (storedImage) {
        this.profileImage = storedImage;
      }
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']); // redirect to dashboard after logout
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}