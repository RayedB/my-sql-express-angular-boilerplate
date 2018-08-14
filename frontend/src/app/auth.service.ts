import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: String = '';
  data: any;
  message = '';
  constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService) { }

  signinUser(email: string, password: string) {
    const loginData = { email: email, password: password };
    this.http.post('http://localhost:8080/auth/login', loginData).subscribe(resp => {
      this.data = resp;
      console.log(this.data);
      localStorage.setItem('jwtToken', this.data.token);
      this.router.navigate(['home']);
    });
  }

  register(firstName: string, lastName: string, email: string, password: string) {
    const registerData = {firstName: firstName, lastName: lastName, email: email, password: password };
    this.http.post('http://localhost:8080/auth/register', registerData).subscribe(resp => {
      this.data = resp;
      this.router.navigate(['login']);
    }, err => {
      this.message = err.error.msg;
    });
  }

  logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['login']);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwtToken');
    // If token not expired, return true
    if (token != null) {
    return !this.jwtHelper.getTokenExpirationDate(token) || !this.jwtHelper.isTokenExpired(token);
    }
  }

}
