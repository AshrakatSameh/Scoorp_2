import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Adjust base URL if necessary


  constructor(private http: HttpClient) { }

     // Login method
  login(credentials: { email: string; password: string }, tenant: string): Observable<any> {
    // Set the custom header with the tenant (SpaceName)
    const headers = new HttpHeaders({
      tenant: tenant, // Pass tenant as a custom header
      'Content-Type': 'application/json',
    });

    // Send the POST request with email and password in the body
    return this.http.post(`${this.apiUrl}Auth/Login`, credentials, { headers });
  }


  logout(tenant: string): Observable<any> {
   
    const header = new HttpHeaders({
      tenant: tenant, // Pass tenant as a custom header
      'Content-Type': 'application/json',
    })
    return this.http.post(`${this.apiUrl}/Logout`, {header });
   
  }

  refreshToken(tenant: string): Observable<any> {
    // Retrieve tenant from local storage
    tenant = localStorage.getItem('tenant') || ''; // Default to an empty string if null

    const headers = new HttpHeaders({
      tenant: tenant // tenant is guaranteed to be a string here
    });

    // Send the request to refresh the token
    return this.http.post<any>(`${this.apiUrl}Auth/RefreshToken`, {}, { headers });
  }
   
  isLoggin(): boolean{
    return !!localStorage.getItem('authToken')
  }
  getToken = (): string | null =>
    localStorage.getItem('authToken') || '';

}
