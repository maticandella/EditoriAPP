import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): Observable<boolean> {
      return this.authService.validateSession().pipe(
        map(() => {
          return true;
        }),
        catchError((error) => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }