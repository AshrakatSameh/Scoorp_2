import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StoresSectionService } from 'src/app/services/getAllServices/StoresSection/stores-section.service';
import { UnitService } from 'src/app/services/getAllServices/unit/unit.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent {

  storesSec:any[] =[];
  unitForm : FormGroup;

  apiUrl= environment.apiUrl;

  constructor(private unitService: UnitService , private fb: FormBuilder, private toast: ToastrService,
    private unitCat: StoresSectionService, private http:HttpClient
  ){
    this.unitForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
      UnitCategoryId:['']
    })

  }

  ngOnInit(): void {

    this.getAllUnit();
    this.getAllUnitCategory();
    
}

getAllUnit(){
  this.unitService.getAllUnits().subscribe(
    (response) => {
      this.storesSec = response.units; // Assign the fetched Warehouses
      console.log('units :', this.storesSec);
    },
    (error) => {
      console.error('Error fetching units section:', error); // Handle errors
    }
  );
}

unitCategories:any[]=[];
getAllUnitCategory(){
  this.unitCat.getAllUnitCategories().subscribe(
    (response) => {
      this.unitCategories = response.units; // Assign the fetched Warehouses
      console.log('units :', this.unitCategories);
    },
    (error) => {
      console.error('Error fetching units section:', error); // Handle errors
    }
  );
}
onSubmitAdd(): void {
   
  const formData = new FormData();
  formData.append('name', this.unitForm.get('name')?.value);
  formData.append('localName', this.unitForm.get('localName')?.value);
  formData.append('note', this.unitForm.get('note')?.value);
  formData.append('UnitCategoryId', this.unitForm.get('UnitCategoryId')?.value);

  console.log('FormData contents:');
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'StoresSection/unit', formData, { headers })
    .subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.toast.success('Submitted successfully ');
        this.getAllUnit();
        // alert('Submit successfully');
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
}
  
  buttons=['المعلومات الشخصية ','معلومات المستخدم','المرفقات','معلومات العمل' ,'الاشعارات','المبيعات','الطلبات و المرفقات','الخطط و المهام','العهد المستلمه','الحساب البنكي']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
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
    this.unitForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
      UnitCategoryId:this.selectedCategory.UnitCategoryId
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a unit to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

updateCategory() {
  if (this.unitForm.valid) {
    const updatedCategory = { ...this.unitForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.unitService.updateUnit(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Unit updated successfully:', response);
        this.toast.success('Unit updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllUnit();
        this.closeModal();  // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating unit :', error);
        console.log('Updated unit  Data:', updatedCategory);
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
    const headers = new HttpHeaders().set('tenant', localStorage.getItem('tenant') || ''); // Replace 'your-tenant-id' with the actual tenant value

    this.unitService.deleteUnitById(this.selectedCategory.id, headers).subscribe(
      (response)=>{
        console.log('Unit deleted successfully:', response);
        this.toast.success('Unit deleted successfully');
        this.getAllUnit();
        this.closeModal(); 
      },error => {
        console.error('Error delete Unit :', error);
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
