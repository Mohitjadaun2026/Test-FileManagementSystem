import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'fl_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.KEY);
    try {
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  }

  private saveUser(user: User | null) {
    if (user) localStorage.setItem(this.KEY, JSON.stringify(user));
    else localStorage.removeItem(this.KEY);
  }

  // ✅ NEW METHOD (IMPORTANT)
  updateUser(user: User) {
    this.saveUser(user);
    this.currentUserSubject.next(user);
  }

  login(payload: { login: string; password: string }): Observable<User> {
    console.log('[AuthService] Login attempt for:', payload.login);
    return this.http.post<User>(`${environment.apiBaseUrl}/auth/login`, payload).pipe(
      tap({
        next: (user) => {
          console.log('[AuthService] Login successful for:', user.email || user.username);
          this.saveUser(user);
          this.currentUserSubject.next(user);
        },
        error: (err) => {
          console.error('[AuthService] Login failed for:', payload.login, err);
        }
      })
    );
  }

  register(payload: { name: string; email: string; password: string }): Observable<User> {
    console.log('[AuthService] Register attempt for:', payload.email);
    const body = {
      username: payload.name,
      email: payload.email,
      password: payload.password
    };
    return this.http.post<User>(`${environment.apiBaseUrl}/auth/register`, body).pipe(
      tap({
        next: (user) => console.log('[AuthService] Registration successful for:', user.email || user.username),
        error: (err) => console.error('[AuthService] Registration failed for:', payload.email, err)
      })
    );
  }

  logout() {
    console.log('[AuthService] Logging out user:', this.currentUserSubject.value?.email || this.currentUserSubject.value?.username);
    this.saveUser(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  // ✅ FIXED (no hardcoded URL)
  uploadProfileImage(formData: FormData) {
    return this.http.post(`${environment.apiBaseUrl}/auth/upload-profile`, formData);
  }

  // Fetch the latest user profile from the backend (including profileImage)
  fetchProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/auth/profile`).pipe(
      tap({
        next: (user) => {
          this.saveUser(user);
          this.currentUserSubject.next(user);
        },
        error: (err) => {
          console.error('[AuthService] Failed to fetch user profile:', err);
        }
      })
    );
  }
}