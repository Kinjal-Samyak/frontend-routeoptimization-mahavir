import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
    constructor(private router: Router, private authService: AuthService) {}

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (!this.authService.isLogedIn()) {
          this.router.navigate(['login'])
          return false;
        }
        return this.authService.isLogedIn()
      }
}
