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
    console.log( "applying Rout Guard : "  ,this.authService.isAauthenticated());
    if (this.authService.isAauthenticated()) {
      // Check if the user has the required role to access the module
      const requiredRole = route.data['requiredRole'] as string;
            console.log('requiredRole :>> ', requiredRole);

      if (requiredRole && this.authService.userType !== requiredRole) {
        console.log('userType :>> ', this.authService.userType);
         this.router.navigate(['/forbidden']);
        return false;
      }

      return true;
    }

    // Redirect to the login page if the user is not authenticated
    this.router.navigate(['/login']);
    return false;
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // You can reuse the same logic here if needed
    return this.canActivate(childRoute, state);
  }
}
