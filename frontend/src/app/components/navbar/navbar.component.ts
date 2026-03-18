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
    private dialog: MatDialog   // ✅ added
  ) {}

ngOnInit(): void {

  // ✅ USER SUBSCRIPTION
  this.auth.currentUser$.subscribe(user => {
    this.isLoggedIn = !!user;
    this.currentUser = user || null;

    if (user) {
      this.loadProfileImage();
    }
  });

  // ✅ PROFILE IMAGE LIVE UPDATE (SEPARATE)
  this.auth.profileImage$.subscribe(img => {
    this.profileImage = img;
  });
}

 loadProfileImage(): void {
   if (this.currentUser?.id) {
     const storedImage = localStorage.getItem(`profile_image_${this.currentUser.id}`);

     if (storedImage) {
       this.profileImage = storedImage;

       // 🔥 sync with global state
       this.auth.updateProfileImage(storedImage);
     }
   }
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