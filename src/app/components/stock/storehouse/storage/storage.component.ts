import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/getAllServices/storage/storage.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

  apiUrl = `${environment.apiUrl}StoresSection/storage-place`


  myForm!: FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
  public stores: any[] = [];
  constructor(private storageS: StorageService, private fb: FormBuilder, private http: HttpClient,
    private toast: ToastrService, private wareService: WarehouseService
  ) {

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      note: ['', Validators.required],
      code: [''],
      warehouseId: ['', Validators.required],

    });

  }
  ngOnInit(): void {
    this.getAllStorage();
    this.getAllWareHouses();
  }

  getAllStorage() {
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

  storehouse: any[] = [];
  getAllWareHouses() {
    this.wareService.getWarehouses(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.storehouse = data.data;
        console.log(this.storehouse);
      }, error => {
        console.error('Error fetching tenant storehouse:', error);
      });
  }

  onSubmitAdd(): void {
    const formData = new FormData();
    formData.append('name', this.myForm.get('name')?.value);
    formData.append('localName', this.myForm.get('localName')?.value);
    formData.append('note', this.myForm.get('note')?.value);
    formData.append('code', this.myForm.get('code')?.value);
    formData.append('warehouseId',this.myForm.get('warehouseId')?.value);



    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });


    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });

    this.http.post(this.apiUrl, formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        this.getAllStorage();
        // alert('submit successfully');
        this.toast.success('submit successfully')
      }, error => {
        console.error('Error:', error);
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');
      });

  }

  // Called when the user changes the page number (e.g. via pagination controls)
  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllStorage();
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
}

  // Update
  storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;
onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.myForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
      code: this.selectedCategory.code,
      warehouseId: this.selectedCategory.warehouseId,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

updateCategory() {
  if (this.myForm.valid) {
    const updatedCategory = { ...this.myForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.storageS.updateStorage(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Category updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllStorage();
        this.closeModal();  // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating category:', error);
        console.log('Updated Category Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error'); 
            }
    );
    }
  }

deleteItemType(){
  const confirmed = window.confirm(
    'Are you sure you want to delete this record?'
  );
  if (confirmed){
    this.storageS.deleteStorageById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Storage deleted successfully:', response);
        this.toast.success('Storage deleted successfully');
        this.getAllStorage();
        this.closeModal(); 
      },error => {
        console.error('Error delete storage category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the category .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');       }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
}
selectAll = false;

toggleAllCheckboxes() {
  this.stores.forEach(item => (item.checked = this.selectAll));
}

updateSelectAll() {
  this.selectAll = this.stores.every(item => item.checked);
}

isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}
}
