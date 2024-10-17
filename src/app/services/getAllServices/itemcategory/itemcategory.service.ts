import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ItemcategoryService {

  private apiUrl = environment.apiUrl; 

  constructor(private http : HttpClient) { }

     // Method to fetch UserTags based on tenantId
     getitemCat(pageNumber:number, pageSize: number): Observable<any> {
      // Get tenantId from localStorage
      const tenantId = localStorage.getItem('tenant');
  
      // Set the custom header with the tenantId
      const headers = new HttpHeaders({
        tenant: tenantId || '', // Set tenantId header if available
        'Content-Type': 'application/json',
      });
      let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
  
      // Send the GET request with headers
      return this.http.get(`${this.apiUrl}StoresSection/item-categories`, { headers, params });
      
    }


    getAllitemCat(): Observable<any> {
      // Get tenantId from localStorage
      const tenantId = localStorage.getItem('tenant');
  
      // Set the custom header with the tenantId
      const headers = new HttpHeaders({
        tenant: tenantId || '', // Set tenantId header if available
        'Content-Type': 'application/json',
      });
  
      // Send the GET request with headers
      return this.http.get(`${this.apiUrl}StoresSection/item-categories`, { headers });
      
    }


    createItemCat(brand: any): Observable<any> {
      const tenantId = localStorage.getItem('tenant');
      const headers = new HttpHeaders({
        tenant: tenantId || '', // Set tenantId header if available
        'Content-Type': 'application/json',
      });
      console.log(brand)
      return this.http.post(`${this.apiUrl}StoresSection/item-category?`, brand, { headers });
    }
}
