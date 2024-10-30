import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  priceListForm!:FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
  lists:any[]=[];
  apiUrl= environment.apiUrl+'PriceList/Create'

  constructor(private fb:FormBuilder, private priceService:PriceListService, private http:HttpClient,
    private toast: ToastrService
  ){
    this.priceListForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      code:['', Validators.required]
      
    })
  }

  ngOnInit(): void {
    this.getAllPriceLists();
  }

  getAllPriceLists() {
    this.priceService.getPriceListsWithPaging(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.lists = data.data;
        //console.log(this.contacts);
      }, error => {
        console.error('Error fetching price lists data:', error);
      });
  } 
  onSubmitAdd(){

    const formData = new FormData();
    const name = this.priceListForm.get('name')!.value;
    const localName = this.priceListForm.get('localName')!.value;
    const code = this.priceListForm.get('code')!.value;
    const description = this.priceListForm.get('description')!.value;

    if (name) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('code', code);
      formData.append('description', description);
    

      
    } else {
      console.error('One or more form fields are null');
      return;
    }

    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&Code=${encodeURIComponent(code)}&Description=${encodeURIComponent(description)}`;
    this.http.post<any>(url, formData,{headers}).subscribe(
      (response) => {
        alert('Done');
        console.log('Price list created successfully:', response);
        // Reset form after successful submission
        this.priceListForm.reset();
        this.getAllPriceLists();
        this.toast.success('Price list created successfully');
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating Client:', error.error);
        this.toast.error(error.error)
        // Handle error
      }
    );
  }

     // Handle file selection via input click
     onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.handleFile(file);
      }
    }
  
    // Handle file dropped via drag-and-drop
    onFileDropped(event: DragEvent): void {
      event.preventDefault();
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        this.handleFile(file);
      }
    }
  
    onDragOver(event: DragEvent): void {
      event.preventDefault();
      const target = event.target as HTMLElement;  // Cast to HTMLElement
      target.classList.add('drag-over');
    }
  
    onDragLeave(event: DragEvent): void {
      // Remove the hover effect class on drag leave
      event.preventDefault();
      const target = event.target as HTMLElement;  // Cast EventTarget to HTMLElement
      target.classList.add('drag-over');  }
  
    // Handle file logic (validate and upload)
    handleFile(file: File): void {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size exceeds 10MB');
        return;
      }
  
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, or PDF files are allowed');
        return;
      }
  
      // Perform file upload or further processing here
      console.log('File selected:', file);
      // You could upload the file to the server here using an API service
    }
}
