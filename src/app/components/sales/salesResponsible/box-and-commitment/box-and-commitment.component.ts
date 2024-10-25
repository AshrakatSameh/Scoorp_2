import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConvenantBoxService } from 'src/app/services/getAllServices/ConvenantBox/convenant-box.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-box-and-commitment',
  templateUrl: './box-and-commitment.component.html',
  styleUrls: ['./box-and-commitment.component.css']
})
export class BoxAndCommitmentComponent {
  pageNumber: number = 1;
  pageSize: number = 10;
  
  storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;
  // conBoxForm={
  //   CovenantBoxName:'',
  //   Code:'',
  //   Description:''
  // }
  convBoxForm:FormGroup;
  constructor(private convenantBox:ConvenantBoxService,private http:HttpClient,
     private fb:FormBuilder, private toast:ToastrService){
    this.convBoxForm= this.fb.group({
      covenantBoxName: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      
  });


this.getAllConvenantBoxes();

}
 
apiUrl=environment.apiUrl;

isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

onSubmit() {
  const formData = new FormData();
  formData.append('covenantBoxName', this.convBoxForm.get('covenantBoxName')?.value);
  formData.append('code', this.convBoxForm.get('code')?.value);
  formData.append('description', this.convBoxForm.get('description')?.value);

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'CovenantBox', formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      alert('submit successfully');
    }, error => {
      console.error('Error:', error);
    });
}
convenantAndBox:any[]=[];
getAllConvenantBoxes() {
  this.convenantBox.getConvenantBoxes().subscribe(response => {
    this.convenantAndBox = response.covenantBoxes;
    //console.log(this.salesOffers);
  }, error => {
    console.error('Error fetching sales data:', error)
  })
}


// Update Convenant boxes
onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.convBoxForm.patchValue({
      covenantBoxName: this.selectedCategory.covenantBoxName,
      code: this.selectedCategory.code,
      description: this.selectedCategory.description,
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
  if (this.convBoxForm.valid) {
    const updatedCategory = { ...this.convBoxForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.convenantBox.update(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('COnvenant and boxes updated successfully:', response);
        this.toast.success('Convenant and boxes updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllConvenantBoxes();
        this.closeModal();  // Close the modal after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating convenant boxes:', error);
        console.log('Updated convenant boxes Data:', updatedCategory);
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
    this.convenantBox.deleteById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item type deleted successfully:', response);
        this.toast.success('Item type deleted successfully');
        this.getAllConvenantBoxes();
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

changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllConvenantBoxes();
}

}
