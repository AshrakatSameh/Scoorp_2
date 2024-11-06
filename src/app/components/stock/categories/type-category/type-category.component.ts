import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemcategoryService } from 'src/app/services/getAllServices/itemcategory/itemcategory.service';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-type-category',
  templateUrl: './type-category.component.html',
  styleUrls: ['./type-category.component.css']
})
export class TypeCategoryComponent {
  storesSec:any[] =[];
  TypeCatForm : FormGroup;

  apiUrl= environment.apiUrl;

  constructor(private itemCatServices: ItemcategoryService , private fb: FormBuilder,
    private toast: ToastrService, private http: HttpClient
  ){
    this.TypeCatForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
    })

  }

  ngOnInit(): void {
    this.getAllItemCat();
    
    
}



getAllItemCat(){
  this.itemCatServices.getAllitemCat().subscribe(
    (response) => {
      this.storesSec = response.categories; // Assign the fetched Warehouses
      console.log('item cat :', this.storesSec);
    },
    (error) => {
      console.error('Error fetching item cat section:', error); // Handle errors
    }
  );
}

onSubmitAdd(): void {
  const formData = new FormData();
  formData.append('name', this.TypeCatForm.get('name')?.value);
  formData.append('localName', this.TypeCatForm.get('localName')?.value);
  formData.append('note', this.TypeCatForm.get('note')?.value);

  console.log('FormData contents:');
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'StoresSection/item-category?', formData, { headers })
    .subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.toast.success('Submitted successfully ');
        this.getAllItemCat();
        // alert('Submit successfully');
      },
      (error: any) => {
        console.error('Error:', error);
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
}


// Update
isModalOpen = false;
selectedCategory: any = null;
onCheckboxChange(category: any) {
  this.updateSelectAll();
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.TypeCatForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a type category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

updateCategory() {
  if (this.TypeCatForm.valid) {
    const updatedCategory = { ...this.TypeCatForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.itemCatServices.updateItemCat(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Item type updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllItemCat();
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
    this.itemCatServices.deleteItemTypeById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item type deleted successfully:', response);
        this.toast.success('Item type deleted successfully');
        this.getAllItemCat();
        this.closeModal(); 
      },error => {
        console.error('Error delete item type category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');   
        console.log(error)   
       }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
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
  this.storesSec.forEach(item => (item.checked = this.selectAll));
  // Update the selected count
  this.selectedCount = this.selectAll ? this.storesSec.length : 0;
}

updateSelectAll() {
  // Update selectAll if all items are checked
  this.selectAll = this.storesSec.every(item => item.checked);
  // Calculate the number of selected items
  this.selectedCount = this.storesSec.filter(item => item.checked).length;
}

pageNumber=1
pageSize = 10;

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllItemCat();
  }
}
