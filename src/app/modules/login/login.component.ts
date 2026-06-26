import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('username') username!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLogged) {
      const mappedUserType = this.mapUserRoleToString(this.authService.userType);
      this.router.navigate([mappedUserType]);
    }
  }

  onLoginClicked(): void {
    const credentials = {
      username: this.username.nativeElement.value,
      password: this.password.nativeElement.value
    };

    this.authService.login(credentials).subscribe({
      next: (data: any) => {
        this.authService.isLogged = true;
        this.authService.userType = data.authority;

        // Only set if the field exists in response
        if ('isSuperReceptionist' in data) {
          this.authService.isSuper = data.isSuperReceptionist;
          sessionStorage.setItem('isSuper', data.isSuperReceptionist.toString());
        }

        this.authService.setToken(data.token);
        sessionStorage.setItem('isLogged', 'true');
        sessionStorage.setItem('userType', data.authority);

        this.router.navigateByUrl(
          this.mapUserRoleToString(data.authority)
        );
      },
      error: (error) => {
        alert(error.error.message);
      }
    });
  }


  private mapUserRoleToString(userRole: string | null): string {
    switch (userRole) {
      case 'ROLE_RECEPTIONIST': return 'receptionist';
      case 'ROLE_ADMIN':        return 'admin';
      case 'ROLE_DOCTOR':       return 'doctor';
      case 'ROLE_CONTRIBUTOR':  return 'contributer';
      default:                  return '';
    }
  }
}