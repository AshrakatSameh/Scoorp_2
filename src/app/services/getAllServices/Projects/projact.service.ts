import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProjactService {
  private apiUrl= environment.apiUrl;

  constructor(private http : HttpClient) { }

     // Method to fetch UserTags based on tenantId
     getProjacts(pageNumber:number, pageSize: number): Observable<any> {
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
      return this.http.get(`${this.apiUrl}Project/GetProjects`, { headers, params });
      
    }


    api= environment.apiUrl+'Project/CreateProject' ;

    createData(data: any): Observable<any> {
      const headers = new HttpHeaders({
        'tenant': 'ash'  // Required tenant header
      });
  
      const formData = new FormData();
      formData.append('Name', data.name);
      formData.append('LocalName', data.localName || '');
      //formData.append('Description', data.description || '');
      formData.append('clientId', data.clientId || '');
      formData.append('userIds', data.userIds || '');
      formData.append('assignedToId', data.assignedToId || '');
      formData.append('teamId', data.teamId || '');
      formData.append('startDate', data.startDate || '');
      formData.append('endDate', data.endDate || '');
      formData.append('size', data.size || '');
      formData.append('priority', data.priority || '');

      return this.http.post(this.api, formData, { headers });
    }

}
