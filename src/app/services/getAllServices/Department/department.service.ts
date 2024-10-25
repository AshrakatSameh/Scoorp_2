import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getAllDepartments(): Observable<any> {
    // Get tenantId from localStorage
    const tenantId = localStorage.getItem('tenant');

    // Set the custom header with the tenantId
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });

    // Send the GET request with headers
    return this.http.get(`${this.apiUrl}Departments/GetAllDepartments`, { headers });

  }


  createDep(tagData: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    console.log(tagData)
    return this.http.post(`${this.apiUrl}Departments/CreateDepartment?`, tagData, { headers });
  }


  updateDepartment(departmentId: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });
    return this.http.put(`${this.apiUrl}Departments/UpdateDepartment/${departmentId}`, formData, { headers });
  }

  deleteDepartment(departmentId: number): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });
    return this.http.delete(`${this.apiUrl}Departments/${departmentId}`, { headers });
  }


}
