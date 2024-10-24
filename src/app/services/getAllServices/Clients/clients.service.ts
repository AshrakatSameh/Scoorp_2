import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  apiUrl = environment.apiUrl;
  api = `${this.apiUrl}Clients/CreateClient`
  constructor(private http:HttpClient) { }

  getAllCliensts(pageNumber: number, pageSize: number): Observable<any> {
    const tenantId = localStorage.getItem('tenant'); 
    const headers = new HttpHeaders({
      tenant: tenantId || '',
      'Content-Type': 'application/json',
    });
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    // Send the GET request with headers
    return this.http.get(`${this.apiUrl}Clients/GetAllClients`, { headers, params });

  }

  getClietById(id:number){
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}Clients/GetClientById/${id}`,{headers});
  }

//  // Method to get a client by ID
//  getClientById(id: number): Observable<any> {
//   return this.http.get<any>(`${this.apiUrl}Clients/GetClientById/${id}`);
// }

  createClient(clientData: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    console.log(clientData)
    // Construct the URL with query parameters from the form data
    const url = `${this.api}?Name=${encodeURIComponent(clientData.name)}&LocalName=${encodeURIComponent(clientData.localName)}&Phone=${encodeURIComponent(clientData.phone)}&Email=${encodeURIComponent(clientData.email)}&Code=${encodeURIComponent(clientData.code)}&TagId=${encodeURIComponent(clientData.tagId)}`;

    // Make the POST request
    return this.http.post(url, clientData, {headers});
    

  }

  getCliensts(): Observable<any> {
    const tenantId = localStorage.getItem('tenant'); 
    const headers = new HttpHeaders({
      tenant: tenantId || '',
      'Content-Type': 'application/json',
    });

    // Send the GET request with headers
    return this.http.get(`${this.apiUrl}Clients/GetAllClients`, { headers });

  }

  deleteClientById(id: number): Observable<void> {
    const tenantId = localStorage.getItem('tenant'); 
    const headers = new HttpHeaders({
      tenant: tenantId || '',
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.apiUrl}Clients/DeleteClient/${id}`,{headers});
  }

  
}
