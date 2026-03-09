// auth-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAauthenticated()) {

      const requiredRoles = route.data['requiredRoles'] as string[];

      // If no roles defined, allow access
      if (!requiredRoles || requiredRoles.length === 0) return true;

      // Check if user's role is in the allowed list
      if (!requiredRoles.includes(this.authService.userType!)) {
        this.router.navigate(['/forbidden']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // You can reuse the same logic here if needed
    return this.canActivate(childRoute, state);
  }
}
