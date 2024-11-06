import { HttpClient, HttpHeaders } from '@angular/common/http';  // Import HttpClient
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/services/getAllServices/Department/department.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent {

  deps: any[] = [];
  depForm: FormGroup;
  isModalOpen = false;
  selectedDep: any = null;
  isDropdownOpen: boolean = false;

  apiUrl = `${environment.apiUrl}Departments/CreateDepartment`;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private http: HttpClient ,
    private toast: ToastrService // Inject HttpClient here
  ) {
    this.depForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllDeps();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  onCheckboxChange(category: any) {
    this.selectedDep = category;  // Store the selected category data
  }

  openModalForSelected() {
    if (this.selectedDep) {
      this.depForm.patchValue({
        name: this.selectedDep.name,
        localName: this.selectedDep.localName,
        description: this.selectedDep.description,
      });

      this.isModalOpen = true;
    } else {
      alert('Please select a Job des to update.');
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }



 

  onSubmitUpdate() {
    if (this.selectedDep) {
      const formData = new FormData();
      formData.append('name', this.depForm.get('name')?.value);
      formData.append('localName', this.depForm.get('localName')?.value);
      formData.append('description', this.depForm.get('description')?.value);
  
      const departmentId = this.selectedDep.id;  // Assuming your department object has an `id` property
  
      this.departmentService.updateDepartment(departmentId, formData).subscribe(
        (response: any) => {
          console.log('Update Response:', response);
          this.getAllDeps();  // Refresh the department list
          this.closeModal();  // Close the modal
          // alert('Updated successfully');
          this.toast.success('Updated successfully')
        },
        (error: any) => {
          console.error('Update Error:', error);
          const errorMessage = error.error?.message || 'An unexpected error occurred.';
          this.toast.error(errorMessage, 'Error'); 
        }
      );
    } else {
      this.toast.error('Please select a department to update.');
    }
  }

  deleteItemType() {
    if (this.selectedDep) {
      const departmentId = this.selectedDep.id;  // Assuming your department object has an `id` property
  
      if (confirm('Are you sure you want to delete this department?')) {
        this.departmentService.deleteDepartment(departmentId).subscribe(
          (response: any) => {
            console.log('Delete Response:', response);
            this.getAllDeps();  // Refresh the department list
            alert('Deleted successfully');
          },
          (error: any) => {
            console.error('Delete Error:', error);
          }
        );
      }
    } else {
      alert('Please select a department to delete.');
    }
  }
  
  



  getAllDeps() {
    this.departmentService.getAllDepartments().subscribe(response => {
      this.deps = response.data;
      console.log(this.deps);
    }, error => {
      console.error('Error fetching Dep data:', error);
    });
  }

  onSubmitAdd() {
    const formData = new FormData();
    formData.append('name', this.depForm.get('name')?.value);
    formData.append('localName', this.depForm.get('localName')?.value);
    formData.append('description', this.depForm.get('description')?.value);

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });

    this.http.post(this.apiUrl, formData, { headers })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.toast.success('Submitted successfully ')
          this.getAllDeps();
          // alert('Submit successfully');
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }

}
