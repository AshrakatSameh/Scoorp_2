import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

// When a row is selected in the table
// onRowSelect(category: any) {
//   this.selectedCategory = category;
//   // this.openModalForSelected();
// }

// // Open the modal and patch the selected row's data into the form
// openModalForSelected() {
//   if (this.selectedCategory) {
//     this.TypeForm.patchValue({
//       name: this.selectedCategory.name,
//       localName: this.selectedCategory.localName,
//       note: this.selectedCategory.note,
//       code: this.selectedCategory.code,
//     });
//     this.isModalOpen = true;
//   } else {
//     alert('Please select an item to update.');
//   }
// }

// // Close the modal
// closeModal() {
//   this.isModalOpen = false;
// }

// Update the selected item
// updateCategory() {
  // if (this.TypeForm.valid) {
  //   const formData = new FormData();
  //   formData.append('name', this.TypeForm.get('name')?.value);
  //   formData.append('localName', this.TypeForm.get('localName')?.value);
  //   formData.append('note', this.TypeForm.get('note')?.value);
  //   formData.append('code', this.TypeForm.get('code')?.value);

  //   const headers = new HttpHeaders({
  //     tenant: localStorage.getItem('tenant') || ''  // Tenant value from local storage
  //   });

  //   // Call PUT API with item ID
  //   this.http.put(`https://lawersys-001-site1.etempurl.com/api/StoresSection/item-type/${this.selectedCategory.id}`, formData, { headers })
  //     .subscribe(
//         (response) => {
//           console.log('Item updated successfully:', response);
//           this.toast.success('Item type updated successfully');
//           this.closeModal();
//           // Update the table data with the new values if needed
//         },
//         (error: HttpErrorResponse) => {
//           console.error('Error updating item:', error);
//           this.toast.error('An error occurred while updating the item type.');
//         }
//       );
//   }
// }

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
      // alert('submit successfully');
    }, error => {
      console.error('Error:', error);
      this.toast.error('Error in submit')
    });
}

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
}
