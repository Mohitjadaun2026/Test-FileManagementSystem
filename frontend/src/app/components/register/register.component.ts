import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loading = false;
  private readonly comEmailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/i;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(this.comEmailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snack: MatSnackBar) {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Account created!', 'OK', { duration: 2000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snack.open(err?.error?.message ?? 'Registration failed', 'Dismiss', { duration: 3500 });
        this.loading = false;
      }
    });
  }
}