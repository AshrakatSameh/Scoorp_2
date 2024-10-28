import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  apiUrl= environment.apiUrl;
  constructor(private http:HttpClient) { }

  getSalesOffers(pageNumber: number, pageSize: number): Observable<any> {
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
    return this.http.get(`${this.apiUrl}SaleOffer`, { headers, params });

  }

  getDeliveryVoucher(pageNumber: number, pageSize: number): Observable<any> {
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
    return this.http.get(`${this.apiUrl}DeliveryNotes/GetAll`, { headers,params });

  }

  // Sales Invioces

  getSalesInvoices(pageNumber: number, pageSize: number): Observable<any> {
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
    return this.http.get(`${this.apiUrl}SalesInvoice`, { headers, params });

  }

  updateSalesInvoice(id: number, updatedCategory: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    
    // Create headers with tenant info
    const headers = new HttpHeaders({
      tenant: tenantId || ''  // Set tenantId header if available
    });
  
    // Prepare FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('code', updatedCategory.code || '');
    formData.append('clientId', updatedCategory.clientId || '');
    formData.append('representativeId', updatedCategory.representativeId || '');
    formData.append('teamId', updatedCategory.teamId || '');
    formData.append('priceListId', updatedCategory.priceListId || '');
    formData.append('paymentPeriodId', updatedCategory.paymentPeriodId || '');
    formData.append('invoiceNumber', updatedCategory.invoiceNumber || '');
    formData.append('invoiceType', updatedCategory.invoiceType || '');
    formData.append('costCenterId', updatedCategory.costCenterId || '');
    formData.append('driver', updatedCategory.driver || '');
  
    // API call with PUT method using the FormData and headers
    return this.http.put(`${this.apiUrl}SalesInvoice/${id}`, formData, { headers });
  }
  
  deleteSalesInvoiceById(id: number): Observable<void> {
    const tenantId = localStorage.getItem('tenant'); 
    const headers = new HttpHeaders({
      tenant: tenantId || '',
      // 'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.apiUrl}SalesInvoice/${id}`,{headers});
  }

  postDeliveryNote(data: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}DeliveryNotes/Create`, data, { headers });
  }
  
  postSaleOffer(data: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}SaleOffer`, data, { headers });
  }

  postSalesInvoice(data: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}SalesInvoice`, data, { headers });
  }
 
  createSalesInvoice(data: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    console.log(data)
    return this.http.post(`${this.apiUrl}SalesInvoice`, data, { headers });
  }

  // Update And Delete Delivery Notes
  update(id: number, updatedCategory: any): Observable<any> {
    const tenantId = localStorage.getItem('tenant');
    
    // Create headers with tenant info
    const headers = new HttpHeaders({
      tenant: tenantId || ''  // Set tenantId header if available
    });
  
    const formData = new FormData();
    formData.append('clientId', updatedCategory.clientId || '');
    formData.append('representativeId', updatedCategory.representativeId || '');
    formData.append('teamId', updatedCategory.teamId || '');
    formData.append('code', updatedCategory.code || '');
    formData.append('purchaseOrderNumber', updatedCategory.purchaseOrderNumber || '');
    formData.append('costCenterId', updatedCategory.costCenterId || '');
    formData.append('warehouseId', updatedCategory.warehouseId || '');
    (updatedCategory.locationLinkIds || []).forEach((id: string) => {
      formData.append('locationLinkIds', id);
    });  
    // API call with PUT method using the FormData and headers
    return this.http.put(`${this.apiUrl}DeliveryNotes/Update/${id}`, formData, { headers });
  }
  
  deleteById(id: number): Observable<void> {
    const tenantId = localStorage.getItem('tenant'); 
    const headers = new HttpHeaders({
      tenant: tenantId || '',
      // 'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.apiUrl}DeliveryNotes/${id}`,{headers});
  }


  // Return invoice
  getReturnInvoices(pageNumber: number, pageSize: number): Observable<any> {
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
    return this.http.get(`${this.apiUrl}ReturnInvoice`, { headers, params });

  }
}
