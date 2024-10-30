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
      formData.append('canBeSold', updatedCategory.note || '');
      formData.append('canBePurchased', updatedCategory.code || '');

      formData.append('canBeConsumed', updatedCategory.name || '');
      formData.append('itemCategoryId', updatedCategory.localName || '');
      formData.append('barcode', updatedCategory.note || '');
      formData.append('code', updatedCategory.code || '');

      formData.append('itemTypeId', updatedCategory.name || '');
      formData.append('unitId', updatedCategory.localName || '');
      formData.append('salesPrice', updatedCategory.note || '');
      formData.append('salesTax', updatedCategory.code || '');

      formData.append('costCenterId', updatedCategory.name || '');
      formData.append('brandId', updatedCategory.localName || '');
      formData.append('note', updatedCategory.note || '');
      formData.append('localNote', updatedCategory.code || '');

      formData.append('totalSoldQuantity', updatedCategory.name || '');
      formData.append('totalPurchasedQuantity', updatedCategory.localName || '');
      formData.append('totalCurrentStock', updatedCategory.note || '');
      formData.append('width', updatedCategory.code || '');

      formData.append('length', updatedCategory.name || '');
      formData.append('height', updatedCategory.localName || '');
      formData.append('pallet', updatedCategory.note || '');
      formData.append('palletHeight', updatedCategory.code || '');

      formData.append('thickness', updatedCategory.name || '');
      formData.append('weight', updatedCategory.localName || '');
      formData.append('customField', updatedCategory.note || '');
    
      // API call with PUT method using the FormData and headers
      return this.http.put(`${this.apiUrl}Items/${id}`, formData, { headers });
    }

    deleteCategoryById(id: number): Observable<void> {
      const tenantId = localStorage.getItem('tenant'); 
      const headers = new HttpHeaders({
        tenant: tenantId || '',
        // 'Content-Type': 'application/json',
      });
      return this.http.delete<void>(`${this.apiUrl}Items/${id}`,{headers});
    }
}
