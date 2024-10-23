import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { WarehouseCatService } from 'src/app/services/getAllServices/WarehouseCategories/warehouse-cat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storehouse',
  templateUrl: './storehouse.component.html',
  styleUrls: ['./storehouse.component.css']
})
export class StorehouseComponent implements OnInit{

  apiUrl = `${environment.apiUrl}Warehouses/CreateWarehouse`

  public storehouse:any[]=[];
  itemCategory: any[] = [];

  pageNumber: number = 1;
  pageSize: number = 10;

  storeHouseForm: FormGroup;

  constructor(private  storeHouseService: WarehouseService ,private fb:FormBuilder,private http:HttpClient , private warehouseCat: WarehouseCatService){

    this.storeHouseForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      warehouseCategoryId:['',Validators.required]
    })
  }

  ngOnInit(): void {
this.getAllWareHouses();
this.getAllWareHousesCat()
  }

  
  getAllWareHouses(){
    this.storeHouseService.getWarehouses(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.storehouse = data.data;
          console.log(this.storehouse);
        }, error => {
          console.error('Error fetching tenant storehouse:', error);
        });
      }

      getAllWareHousesCat(){
        this.warehouseCat.getWarehouseCategories(this.pageNumber, this.pageSize)
            .subscribe(data => {
              this.itemCategory = data.data;
              console.log(this.itemCategory);
            }, error => {
              console.error('Error fetching tenant storehouse:', error);
            });
          }

      
      onSubmit() {
        const formData = new FormData();
        const name = this.storeHouseForm.get('name')!.value;
        const localName = this.storeHouseForm.get('localName')!.value;
        const description = this.storeHouseForm.get('description')!.value;
        // const warehouseCategoryId = this.storeHouseForm.get('warehouseCategoryId')!.value;
  
        
        if (name) {
          formData.append('name', name);
          formData.append('localName', localName);
          formData.append('description', description);
          // formData.append('warehouseCategoryId', warehouseCategoryId);
         
          
    
          
        } else {
          console.error('One or more form fields are null');
          return;
        }
    
        const tenantId = localStorage.getItem('tenant');
        const headers = new HttpHeaders({
          tenant: tenantId || '', // Set tenantId header if available
          'Content-Type': 'application/json',
        });
        const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&description=${encodeURIComponent(description)}`;
        this.http.post<any>(url, formData,{headers}).subscribe(
          (response) => {
            alert('Done');
            console.log('Category created successfully:', response);
            // Reset form after successful submission
            this.storeHouseForm.reset();
          },
          (error: HttpErrorResponse) => {
            console.error('Error creating warehouse:', error.error);
            // Handle error
          }
        );
      }
  
      changePage(newPageNumber: number): void {
        this.pageNumber = newPageNumber;
        console.log(this.pageNumber)
        this.getAllWareHouses();
      }

}
