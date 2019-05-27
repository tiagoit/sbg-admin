import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    // TODO: env variable
    let url = `${environment.API_URL}/auth`;
    let data = {username: username, password: password};
    return this.http.post<{token: string, partner: any}>(url, data)
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          localStorage.setItem('partner_role', result.partner.role);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('partner_role');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
 
  public get role(): String {
    return localStorage.getItem('partner_role');
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = localStorage.getItem('access_token');
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    let isTokenExpired = !(date.valueOf() > new Date().valueOf());
    if(isTokenExpired) this.logout();
    return isTokenExpired;
  }

}
