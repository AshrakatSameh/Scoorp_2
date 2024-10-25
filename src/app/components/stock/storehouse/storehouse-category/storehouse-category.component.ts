import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseCatService } from 'src/app/services/getAllServices/WarehouseCategories/warehouse-cat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storehouse-category',
  templateUrl: './storehouse-category.component.html',
  styleUrls: ['./storehouse-category.component.css']
})
export class StorehouseCategoryComponent implements OnInit {

  apiUrl = `${environment.apiUrl}WarehouseCategories/CreateCategory`

  public wares:any[]=[];
  pageNumber: number = 1;
  pageSize: number = 10;

  CatForm: FormGroup;

  constructor(private warehaouseService: WarehouseCatService ,private fb:FormBuilder,private http:HttpClient ){

    this.CatForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      parentCategory:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllWaresCat()
  }


  getAllWaresCat(){
    this.warehaouseService.getWarehouseCategories(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.wares = data.data;
          console.log(this.wares);
        }, error => {
          console.error('Error fetching tenant data:', error);
        });
      }


      onSubmit() {
        const formData = new FormData();
        const name = this.CatForm.get('name')!.value;
        const localName = this.CatForm.get('localName')!.value;
        const description = this.CatForm.get('description')!.value;
        const parentCategory = this.CatForm.get('parentCategory')!.value;
  
        
        if (name) {
          formData.append('name', name);
          formData.append('localName', localName);
          formData.append('description', description);
          formData.append('parentCategory', parentCategory);
         
          
    
          
        } else {
          console.error('One or more form fields are null');
          return;
        }
    
        const tenantId = localStorage.getItem('tenant');
        const headers = new HttpHeaders({
          tenant: tenantId || '', // Set tenantId header if available
          'Content-Type': 'application/json',
        });
        const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&description=${encodeURIComponent(description)}&parentCategory=${encodeURIComponent(parentCategory)}}`;
        this.http.post<any>(url, formData,{headers}).subscribe(
          (response) => {
            alert('Done');
            console.log('Category created successfully:', response);
            // Reset form after successful submission
            this.CatForm.reset();
          },
          (error: HttpErrorResponse) => {
            console.error('Error creating Category:', error.error);
            // Handle error
          }
        );
      }
  
      changePage(newPageNumber: number): void {
        this.pageNumber = newPageNumber;
        console.log(this.pageNumber)
        this.getAllWaresCat();
      }

}
