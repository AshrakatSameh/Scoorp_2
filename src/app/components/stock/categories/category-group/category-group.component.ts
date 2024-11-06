import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemgroupService } from 'src/app/services/getAllServices/itemgroup/itemgroup.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-category-group',
  templateUrl: './category-group.component.html',
  styleUrls: ['./category-group.component.css']
})
export class CategoryGroupComponent {
  storesSec:any[] =[];
  GroupForm : FormGroup;
  apiUrl= environment.apiUrl;

  constructor(private itemGServices: ItemgroupService , private fb: FormBuilder,
    private toast:ToastrService, private http: HttpClient, 
  ){
    this.GroupForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
      parentProductGroupId:['',Validators.required]
    })

  }

  ngOnInit(): void {
    this.getAllGroupCatogory();
  
}

isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

getAllGroupCatogory(){
  this.itemGServices.getAllitemGroup().subscribe(
    (response) => {
      this.storesSec = response.groups; // Assign the fetched Warehouses
      console.log('item Group :', this.storesSec);
    },
    (error) => {
      console.error('Error fetching item types Group:', error); // Handle errors
    }
  );
}

onSubmitAdd(): void {
  const formData = new FormData();
  formData.append('name', this.GroupForm.get('name')?.value);
  formData.append('localName', this.GroupForm.get('localName')?.value);
  formData.append('note', this.GroupForm.get('note')?.value);
  formData.append('parentProductGroupId', this.GroupForm.get('parentProductGroupId')?.value);

  console.log('FormData contents:');
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'StoresSection/item-group', formData, { headers })
    .subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.toast.success('Submitted successfully ');
        this.getAllGroupCatogory();
        // alert('Submit successfully');
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

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
    this.GroupForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
      parentProductGroupId: this.selectedCategory.parentProductGroupId,
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
  if (this.GroupForm.valid) {
    const updatedCategory = { ...this.GroupForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.itemGServices.updateCategoryGroup(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Item group updated successfully:', response);
        this.toast.success('Item group updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllGroupCatogory();
        this.closeModal();  // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating item group:', error);
        console.log('Updated item group Data:', updatedCategory);
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
    this.itemGServices.deleteCategoryGroupById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item group deleted successfully:', response);
        this.toast.success('Item group deleted successfully');
        this.getAllGroupCatogory();
        this.closeModal(); 
      },error => {
        console.error('Error delete item group category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');       }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
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
