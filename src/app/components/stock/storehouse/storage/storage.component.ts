import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/getAllServices/storage/storage.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit{

  apiUrl= `${environment.apiUrl}StoresSection/storage-place`


  myForm!: FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
  public stores:any[]=[];
  constructor(private storageS: StorageService,private fb: FormBuilder,private http:HttpClient,
  ){

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      note: ['', Validators.required],
      code: ['', Validators.required],
      // warehouse: ['', Validators.required],
    
    });

  }
  ngOnInit(): void {
    this.getAllStorage();
  }

  getAllStorage(){
    this.storageS.getAllStorage().subscribe(
      (response) => {
        this.stores = response.places; // Assign the fetched Warehouses
        console.log('items :', this.stores);
      },
      (error) => {
        console.error('Error fetching item types storage:', error); // Handle errors
      }
    );
  }


  onSubmitAdd(): void {
    const formData = new FormData();
    formData.append('name', this.myForm.get('name')?.value);
    formData.append('localName', this.myForm.get('localName')?.value);
    formData.append('note',this.myForm.get('note')?.value);
    formData.append('code',this.myForm.get('code')?.value);
    // formData.append('warehouse',this.myForm.get('warehouse')?.value);
 


    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  

    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl, formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        this.getAllStorage();
        alert('submit successfully');
      }, error => {
        console.error('Error:', error);
      });
    
  }

     // Called when the user changes the page number (e.g. via pagination controls)
  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllStorage();
  }
}
