import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { JobDescriptionsService } from 'src/app/services/getAllServices/JobDescriptions/job-descriptions.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-descriptions',
  templateUrl: './descriptions.component.html',
  styleUrls: ['./descriptions.component.css']
})
export class DescriptionsComponent {

  storesSec:any[] =[];
  JobForm : FormGroup;
  isModalOpen = false;
  selectedJob: any = null;

  constructor(private jobServices: JobDescriptionsService , private fb: FormBuilder,
    private toast: ToastrService, private http:HttpClient
  ){
    this.JobForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['',Validators.required],
    })

  }


  ngOnInit(): void {

    this.getAllJobDes()
}
getAllJobDes(){
  this.jobServices.getAllgetJobDes().subscribe(
    (response) => {
      this.storesSec = response.jobDescriptions; // Assign the fetched Warehouses
      console.log('Job Des :', this.storesSec);
    },
    (error) => {
      console.error('Error fetching Job Des:', error); // Handle errors
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
   
  if (this.JobForm.valid) {
    // Call the service to post the data
    const formData = this.JobForm.value; // Get the form data
    this.jobServices.creategetJobDes(formData).subscribe(
      response => {
        console.log('Job Des  created successfully!', response);
        this.toast.success('Job description created successfully');
        this.getAllJobDes();
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating Job Des :', error);
        console.log(formData);
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error'); 
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.JobForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}


apiUrl= environment.apiUrl+'JobDescriptions';
onSubmit() {
  const formData = new FormData();
  formData.append('name', this.JobForm.get('name')?.value);
  formData.append('localName', this.JobForm.get('localName')?.value);
  formData.append('description', this.JobForm.get('description')?.value);
 


  const headers = new HttpHeaders({
    tenant: localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl, formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      this.toast.success("submit successfully");
      this.getAllJobDes();
      // alert('submit successfully');
    }, error => {
      console.error('Error:', error);
      this.toast.error('Error in submit')
    });
}

onCheckboxChange(category: any) {
  this.selectedJob = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedJob) {
    this.JobForm.patchValue({
      name: this.selectedJob.name,
      localName: this.selectedJob.localName,
      description: this.selectedJob.description,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a Job des to update.');
  }
}


closeModal() {
  this.isModalOpen = false;
}


updateCategory() {
  if (this.JobForm.valid) {
    const updatedCategory = { ...this.JobForm.value, id: this.selectedJob.id };

    // Call the update service method using the category's id
    this.jobServices.updateJobDes(this.selectedJob.id, updatedCategory).subscribe(
      (response) => {
        console.log('Job Des updated successfully:', response);
        this.toast.success('Job Des updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllJobDes();
        this.closeModal();  // Close the modal after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating category:', error);
        console.log('Updated Category Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the Job Des .')
      }
    );
    }
  }

  deleteItemType(){
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed){
      this.jobServices.deleteJobDesById(this.selectedJob.id).subscribe(
        (response)=>{
          console.log('Item type deleted successfully:', response);
          this.toast.success('Item type deleted successfully');
          this.getAllJobDes();
          this.closeModal(); 
        },error => {
          console.error('Error delete item type category:', error);
          console.log(this.selectedJob.id);
          // alert('An error occurred while updating the item type .');
          this.toast.error('An error occurred while deleting the item type .')
        }
      )
    }else {
        // User canceled the deletion
        console.log('Deletion canceled');
      }
    
  }




  @ViewChild('fileInput') fileInput: any; // Reference to file input
  fileNames: string[] = []; // Variable to store file names

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const rectangle = event.target as HTMLElement;
    rectangle.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const rectangle = event.target as HTMLElement;
    rectangle.classList.remove('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const rectangle = event.target as HTMLElement;
    rectangle.classList.remove('dragover');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.onFileSelected(event.dataTransfer.files);
    }
  }

  onFileSelected(files: FileList | any): void {
    this.fileNames = []; // Clear previous file names

    if (files instanceof FileList) {
      // If files were selected via the input or dragged
      for (let i = 0; i < files.length; i++) {
        this.fileNames.push(files[i].name); // Store the file names
      }
    }
    console.log(this.fileNames); // Log the file names to the console (optional)
  }


}
