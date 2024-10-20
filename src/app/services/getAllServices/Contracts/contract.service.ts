import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  apiUrl= environment.apiUrl;
  constructor(private http:HttpClient) { }

  getAllContracts(): Observable<any> {
    // Get tenantId from localStorage
    const tenantId = localStorage.getItem('tenant');

    // Set the custom header with the tenantId
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });

    // Send the GET request with headers
    return this.http.get(`${this.apiUrl}Contract/GetContracts`, { headers });

  }

  //With paging
  getPagingContracts(pageNumber:number, pageSize: number): Observable<any> {
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
    return this.http.get(`${this.apiUrl}Contract/GetContracts?`, { headers, params });
    
  }

  createContract(formData: FormData): Observable<any> {
    const tenantId = localStorage.getItem('tenant') || '';
    const headers = new HttpHeaders({
      tenant: tenantId, // Add tenant header if needed
    });

    return this.http.post<any>(`${this.apiUrl}Contract/CreateContract`, formData, { headers });
  }




  api= environment.apiUrl+'Contract/CreateContract' ;

    createData(data: any): Observable<any> {
      const tenant = localStorage.getItem('tenant')||'';

    // Set the custom header with the tenantId
    const headers = new HttpHeaders({
      tenant: tenant , // Set tenantId header if available
      'Content-Type': 'application/json',
    });
  
      const formData = new FormData();
      formData.append('Name', data.name);
      formData.append('LocalName', data.localName || '');
      formData.append('clientId', data.clientId || '');
      formData.append('userIds', data.userIds || '');
      formData.append('assignedToId', data.assignedToId || '');
      formData.append('teamId', data.teamId || '');
      formData.append('startDate', data.startDate || '');
      formData.append('endDate', data.endDate || '');
      formData.append('code', data.code || '');

      return this.http.post(this.api, formData, { headers });
    }
}
