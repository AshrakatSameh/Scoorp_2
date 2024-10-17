import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LocationService } from '../Location/location.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  apiUrl= environment.apiUrl;
  constructor(private http:HttpClient) { }

  getAllContacts(pageNumber: number, pageSize: number): Observable<any> {
    const tenantId = localStorage.getItem('tenant'); 
    const headers = new HttpHeaders({
      tenant: tenantId || '',
      'Content-Type': 'application/json',
    });
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    // Send the GET request with headers
    return this.http.get(`${this.apiUrl}Contact`, { headers, params });

  }

  

}
