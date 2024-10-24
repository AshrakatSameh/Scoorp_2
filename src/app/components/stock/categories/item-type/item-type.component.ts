import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent {
  storesSec:any[] =[];
  TypeForm : FormGroup;
  isModalOpen = false;
  selectedCategory: any = null;


  constructor(private itemTypeServices: ItemTypeService , private fb: FormBuilder,
    private toast: ToastrService, private http:HttpClient
  ){
    this.TypeForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
      code:['',Validators.required]
    })

  }

  ngOnInit(): void {

    this.getAllItemTypes()
}
getAllItemTypes(){
  this.itemTypeServices.getAllitemType().subscribe(
    (response) => {
      this.storesSec = response.types; // Assign the fetched Warehouses
      console.log('item types :', this.storesSec);
    },
    (error) => {
      console.error('Error fetching item types section:', error); // Handle errors
    }
  );
}
isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}


onSubmitAdd(): void {
   
  if (this.TypeForm.valid) {
    // Call the service to post the data
    const formData = this.TypeForm.value; // Get the form data
    this.itemTypeServices.createItemType(formData).subscribe(
      response => {
        console.log('item type created successfully!', response);

        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating types :', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.TypeForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}

apiUrl= environment.apiUrl+'StoresSection/item-type';
onSubmit() {
  const formData = new FormData();
  formData.append('name', this.TypeForm.get('name')?.value);
  formData.append('localName', this.TypeForm.get('localName')?.value);
  formData.append('code', this.TypeForm.get('code')?.value);
  formData.append('note', this.TypeForm.get('note')?.value);
  


  const headers = new HttpHeaders({
    tenant: localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl, formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      this.toast.success("submit successfully");
      this.getAllItemTypes();
      // alert('submit successfully');
    }, error => {
      console.error('Error:', error);
      this.toast.error('Error in submit')
    });
}


// Update
onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.TypeForm.patchValue({
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
  if (this.TypeForm.valid) {
    const updatedCategory = { ...this.TypeForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.itemTypeServices.updateItemType(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Item type updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllItemTypes();
        this.closeModal();  // Close the modal after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating category:', error);
        console.log('Updated Category Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the item type .')
      }
    );
    }
  }

deleteItemType(){
  const confirmed = window.confirm(
    'Are you sure you want to delete this record?'
  );
  if (confirmed){
    this.itemTypeServices.deleteItemTypeById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item type deleted successfully:', response);
        this.toast.success('Item type deleted successfully');
        this.getAllItemTypes();
        this.closeModal(); 
      },error => {
        console.error('Error delete item type category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while deleting the item type .')
      }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
}
 
}
