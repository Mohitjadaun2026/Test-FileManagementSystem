import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.scss']
})
export class OauthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email') || '';
    const username = this.route.snapshot.queryParamMap.get('username') || email;
    const id = Number(this.route.snapshot.queryParamMap.get('id') || 0);
    const role = this.route.snapshot.queryParamMap.get('role') || 'USER';

    if (!token || !email) {
      this.snack.open('Google login failed. Please try again.', 'Dismiss', { duration: 3500 });
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.auth.updateUser({
      id,
      email,
      username,
      role,
      token
    });

    this.snack.open('Google login successful', 'OK', { duration: 2000 });
    this.router.navigate(['/files'], { replaceUrl: true });
  }
}
