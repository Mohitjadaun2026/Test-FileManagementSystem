import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  oauthLoading = false;

  form = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error) {
      this.snack.open(this.normalizeAuthMessage(error), 'Dismiss', { duration: 3500 });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    console.log('[LoginComponent] Login form submitted for:', this.form.value.login);
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        console.log('[LoginComponent] Login successful for:', this.form.value.login);
        this.snack.open('Welcome back!', 'OK', { duration: 2000 });
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/files');
      },
      error: (err) => {
        console.error('[LoginComponent] Login failed for:', this.form.value.login, err);
        this.snack.open(this.normalizeAuthMessage(err?.error?.message), 'Dismiss', { duration: 3500 });
        this.loading = false;
      }
    });
  }

  loginWithGoogle() {
    this.oauthLoading = true;
    window.location.href = `${environment.apiBaseUrl}/auth/oauth2/google`;
  }

  private normalizeAuthMessage(message?: string | null): string {
    const normalized = (message || '').trim().toLowerCase();
    if (normalized.includes('blocked')) {
      return 'User is blocked';
    }

    return message?.trim() || 'Login failed';
  }
}
