import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {

  currentUser: User | null = null;
  profileImage: string = 'assets/default-avatar.svg';

  constructor(
    private router: Router,
    private auth: AuthService,
    private dialogRef: MatDialogRef<ProfileDialogComponent>  // ✅ IMPORTANT
  ) {}

  getBackendBaseUrl(): string {
    const protocol = window.location.protocol;
    let port = protocol === 'https:' ? '8080' : '8082';
    return `${protocol}//localhost:${port}`;
  }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.profileImage = this.auth.getProfileImageUrl(user);
    });
  }

  // ✅ FIXED
  goToProfile() {
    this.dialogRef.close();        // 🔥 close dialog first
    this.router.navigate(['/profile']);
  }

  // ✅ ALSO FIX THIS
  logout() {
    this.dialogRef.close();        // close dialog
    this.auth.logout();
    this.router.navigate(['/']);
  }
}