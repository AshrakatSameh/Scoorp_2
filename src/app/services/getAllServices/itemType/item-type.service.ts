import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

// StoresSection/item-type
export class ItemTypeService {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Method to fetch UserTags based on tenantId
  getitemType(pageNumber: number, pageSize: number): Observable<any> {
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
    return this.http.get(`${this.apiUrl}StoresSection/item-types`, { headers, params });

  }


  getAllitemType(): Observable<any> {
    // Get tenantId from localStorage
    const tenantId = localStorage.getItem('tenant');

    // Set the custom header with the tenantId
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });

    // Send the GET request with headers
    return this.http.get(`${this.apiUrl}StoresSection/item-types`, { headers });

  }


  createItemType(brand: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    console.log(brand)
    return this.http.post(`${this.apiUrl}StoresSection/item-type?`, brand, { headers });
  }

  // updateItemType(id: number, updatedCategory: any): Observable<any> {
  //   const tenantId = localStorage.getItem('tenant');
  //   const headers = new HttpHeaders({
  //     tenant: tenantId || '', // Set tenantId header if available
  //     id : id.toString(),
  //     'Content-Type': 'application/json',
  //     // Add any additional headers if necessary, e.g., 'Authorization': 'Bearer token'
  //   });
  //   // Prepare FormData if your API requires multipart/form-data
  //   const formData = new FormData();
  //   formData.append('name', updatedCategory.name || '');
  //   formData.append('localName', updatedCategory.localName || '');
  //   formData.append('note', updatedCategory.note || '');
  //   formData.append('code', updatedCategory.code || '');

  //   return this.http.put(`${this.apiUrl}StoresSection/item-type/${id}`, updatedCategory, { headers });
  // }
  updateItemType(id: number, updatedCategory: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    
    // Create headers with tenant info
    const headers = new HttpHeaders({
      tenant: tenantId || ''  // Set tenantId header if available
    });
  
    // Prepare FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('name', updatedCategory.name || '');
    formData.append('localName', updatedCategory.localName || '');
    formData.append('note', updatedCategory.note || '');
    formData.append('code', updatedCategory.code || '');
  
    // API call with PUT method using the FormData and headers
    return this.http.put(`${this.apiUrl}StoresSection/item-type/${id}`, formData, { headers });
  }
  
}
