import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WarehouseCatService } from 'src/app/services/getAllServices/WarehouseCategories/warehouse-cat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storehouse-category',
  templateUrl: './storehouse-category.component.html',
  styleUrls: ['./storehouse-category.component.css']
})
export class StorehouseCategoryComponent implements OnInit {

  apiUrl = `${environment.apiUrl}WarehouseCategories/CreateCategory`

  public wares: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;

  CatForm: FormGroup;

  constructor(private warehaouseService: WarehouseCatService, private fb: FormBuilder, private http: HttpClient,
    private toast: ToastrService
  ) {

    this.CatForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      description: ['', Validators.required],
      parentCategory: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllWaresCat()
  }

  isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

  // select checkbox
  selectAll = false;

  selectedCount = 0;
  
  toggleAllCheckboxes() {
    // Set each item's checked status to match selectAll
    this.wares.forEach(item => (item.checked = this.selectAll));
    // Update the selected count
    this.selectedCount = this.selectAll ? this.wares.length : 0;
  }
  
  updateSelectAll() {
    // Update selectAll if all items are checked
    this.selectAll = this.wares.every(item => item.checked);
    // Calculate the number of selected items
    this.selectedCount = this.wares.filter(item => item.checked).length;
  }

  getAllWaresCat() {
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
    this.http.post<any>(url, formData, { headers }).subscribe(
      (response) => {
        // alert('Done');
        console.log('Category created successfully:', response);
        // Reset form after successful submission
        this.toast.success('storehousr category created successfully');
        this.CatForm.reset();
      },
      (error) => {
        console.error('Error creating Category:', error.error);
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');
        // Handle error
      }
    );
  }

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllWaresCat();
  }

  // Update
  storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;
onCheckboxChange(category: any) {
  this.updateSelectAll();
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.CatForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
      code: this.selectedCategory.code,
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
  if (this.CatForm.valid) {
    const updatedCategory = { ...this.CatForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.warehaouseService.updateWareCat(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Category updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllWaresCat();
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
    this.warehaouseService.deleteWareCatById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Warehouse category deleted successfully:', response);
        this.toast.success('Warehouse category deleted successfully');
        this.getAllWaresCat();
        this.closeModal(); 
      },error => {
        console.error('Error delete category category:', error);
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


}
