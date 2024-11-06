import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StoresSectionService } from 'src/app/services/getAllServices/StoresSection/stores-section.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-unit-category',
  templateUrl: './unit-category.component.html',
  styleUrls: ['./unit-category.component.css']
})
export class UnitCategoryComponent {

  storesSec:any[] =[];
  unitCatForm : FormGroup;
  apiUrl=environment.apiUrl;
  constructor(private mysrv: StoresSectionService , private fb: FormBuilder,
    private toast: ToastrService, private http:HttpClient
  ){
    this.unitCatForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required]
    })

  }

  ngOnInit(): void {
this.getAllUnitCat();
   
}

getAllUnitCat(){
  this.mysrv.getAllUnitCategories().subscribe(
    (response) => {
      this.storesSec = response.categories; // Assign the fetched Warehouses
      console.log('store section:', this.storesSec);
    },
    (error) => {
      console.error('Error fetching stores section:', error); // Handle errors
    }
  );
}
onSubmitAdd(): void {
   
  const formData = new FormData();
    formData.append('name', this.unitCatForm.get('name')?.value);
    formData.append('localName', this.unitCatForm.get('localName')?.value);
    formData.append('note', this.unitCatForm.get('note')?.value);

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });

    this.http.post(this.apiUrl+'StoresSection/unit-category', formData, { headers })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.toast.success('Submitted successfully ');
          this.getAllUnitCat();
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
    this.unitCatForm.patchValue({
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
  if (this.unitCatForm.valid) {
    const updatedCategory = { ...this.unitCatForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.mysrv.updateUnitCat(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Unit category updated successfully:', response);
        this.toast.success('Unit category updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllUnitCat();
        this.closeModal();  // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating unit category:', error);
        console.log('Updated unit category Data:', updatedCategory);
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
    this.mysrv.deleteUnitCatById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item type deleted successfully:', response);
        this.toast.success('Item type deleted successfully');
        this.getAllUnitCat();
        this.closeModal(); 
      },error => {
        console.error('Error delete Unit category:', error);
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
}
