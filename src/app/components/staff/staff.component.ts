import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/services/getAllServices/Department/department.service';
import { EmployeeService } from 'src/app/services/getAllServices/Employee/employee.service';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { ManagerService } from 'src/app/services/getAllServices/Managers/manager.service';
import { NationalityService } from 'src/app/services/getAllServices/Nationality/nationality.service';
import { SupervisorService } from 'src/app/services/getAllServices/Supervisors/supervisor.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent {



  tenp = environment.apiUrl
  private apiUrl = `${this.tenp}Employees/CreateEmployee`;


  buttons = ['المعلومات الشخصية ', 'معلومات المستخدم', 'المرفقات', 'معلومات العمل', 'الاشعارات', 'المبيعات', 'الطلبات و المرفقات', 'الخطط و المهام', 'العهد المستلمه', 'الحساب البنكي']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  pageNumber: number = 1;
  pageSize: number = 10;
  employees: any[] = [];
  departments: any[] = [];
  supervisors: any[] = [];
  managers: any[] = [];
  employeeForm: FormGroup;

  // for Update
  selectedCategory: any = null;
  isModalOpen = false;
  storesSec: any[] = [];


  dropdownSettings = {};

  constructor(private employeeService: EmployeeService, private fb: FormBuilder,
    private departmentService: DepartmentService, private supervisorService: SupervisorService,
    private managerService: ManagerService, private http: HttpClient, private toast: ToastrService,
    private nationality: NationalityService, private locationServ: LocationService
  ) {

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      departmentSupervisorId: ['', Validators.required],
      departmentManagerId: ['', Validators.required],
      departmentId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      passportNumber: [''],
      passportExpiryDate: [''],
      driverLicenseNumber: [''],
      driverLicenseExpiryDate: [''],
      nationality: [''],
      borderNumber: [''],
      homeLocationIds: this.fb.array([]),
      genderType: ['']

    });
  }
  ngOnInit(): void {
    this.getAllEmployees();
    this.getAllDepartmesnts();
    this.getAllManagers();
    this.getAllSupervisors();
    this.getAllNationalities();
    this.getAllLocations();


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'locationName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      placeholder: 'قم باختيار السكن',
      closeDropDownOnSelection: false,
      enableCheckAll: true // Disables "Select All" option to match the standard <select> functionality
    };
  }

  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }


  getAllEmployees() {
    this.employeeService.getAllEmployees(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.employees = data.data;
        // console.log(this.try)
        //console.log(this.employees);
      }, error => {
        console.error('Error fetching employees data:', error);
      });
  }

  locations: any[] = [];
  getAllLocations() {
    this.locationServ.getLocations()
      .subscribe(data => {
        this.locations = data.data;
        // console.log(this.try)
        //console.log(this.employees);
      }, error => {
        console.error('Error fetching locations data:', error);
      });
  }

  // get All Departments
  getAllDepartmesnts() {
    this.departmentService.getAllDepartments().subscribe(response => {
      this.departments = response.data;
      //console.log(this.departments);
    }, error => {
      console.error('Error fetching Department data:', error)
    })

  }
  // get all supervicors
  getAllSupervisors() {
    this.supervisorService.getAllSupervisors().subscribe(response => {
      this.supervisors = response;
      //console.log(this.supervisors);
    }, error => {
      console.error('Error fetching supervisors data:', error)
    })

  }
  // getall managers
  getAllManagers() {
    this.managerService.getAllManagers().subscribe(response => {
      this.managers = response;
      //console.log(this.managers);
    }, error => {
      console.error('Error fetching managers data:', error)
    })
  }
  // Method to submit the form

  onSubmit() {
    const formData = new FormData();
    const name = this.employeeForm.get('name')!.value;
    const localName = this.employeeForm.get('localName')!.value;
    const jobTitle = this.employeeForm.get('jobTitle')!.value;
    const departmentSupervisorId = this.employeeForm.get('departmentSupervisorId')!.value;
    const departmentManagerId = this.employeeForm.get('departmentManagerId')!.value;
    const departmentId = this.employeeForm.get('departmentId')!.value;
    const startDate = this.employeeForm.get('startDate')!.value;
    const endDate = this.employeeForm.get('endDate')!.value;
    const passportNumber = this.employeeForm.get('passportNumber')!.value;
    const passportExpiryDate = this.employeeForm.get('passportExpiryDate')!.value;
    const driverLicenseNumber = this.employeeForm.get('driverLicenseNumber')!.value;
    const driverLicenseExpiryDate = this.employeeForm.get('driverLicenseExpiryDate')!.value;
    const nationality = this.employeeForm.get('nationality')!.value;
    const borderNumber = this.employeeForm.get('borderNumber')!.value;
    const homeLocationIds = this.employeeForm.get('homeLocationIds')!.value; // Array of IDs
    const genderType = this.employeeForm.get('genderType')!.value;
  
    // Check for required fields
    if (!name || !localName || !jobTitle || !departmentSupervisorId || !departmentManagerId || !departmentId) {
      console.error('One or more form fields are missing');
      return;
    }
  
    // Adding values to FormData
    formData.append('name', name);
    formData.append('localName', localName);
    formData.append('jobTitle', jobTitle);
    formData.append('departmentSupervisorId', departmentSupervisorId);
    formData.append('departmentManagerId', departmentManagerId);
    formData.append('departmentId', departmentId);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('passportNumber', passportNumber);
    formData.append('passportExpiryDate', passportExpiryDate);
    formData.append('driverLicenseNumber', driverLicenseNumber);
    formData.append('driverLicenseExpiryDate', driverLicenseExpiryDate);
    formData.append('nationality', nationality);
    formData.append('borderNumber', borderNumber);
    formData.append('genderType', genderType);
  
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || ''
    });
  
    // Construct the URL with `HomeLocationIds` as repeated query parameters
    let url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&JobTitle=${encodeURIComponent(jobTitle)}&DepartmentManagerId=${encodeURIComponent(departmentManagerId)}&DepartmentSupervisorId=${encodeURIComponent(departmentSupervisorId)}&StartDate=${encodeURIComponent(startDate)}&EndDate=${encodeURIComponent(endDate)}&DepartmentId=${encodeURIComponent(departmentId)}&PassportNumber=${encodeURIComponent(passportNumber)}&PassportExpiryDate=${encodeURIComponent(passportExpiryDate)}&DriverLicenseNumber=${encodeURIComponent(driverLicenseNumber)}&DriverLicenseExpiryDate=${encodeURIComponent(driverLicenseExpiryDate)}&Nationality=${encodeURIComponent(nationality)}&BorderNumber=${encodeURIComponent(borderNumber)}&GenderType=${encodeURIComponent(genderType)}`;
  
    // Append each `homeLocationIds` as a separate `HomeLocationIds` parameter
    homeLocationIds.forEach((id: number) => {
      url += `&HomeLocationIds=${encodeURIComponent(id)}`;
    });
  
    // Make the HTTP POST request
    this.http.post<any>(url, formData, { headers }).subscribe(
      (response) => {
        console.log('Employee created successfully:', response);
        this.toast.success('Employee created successfully');
        this.employeeForm.reset();
      },
      (error) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');
        console.log(this.employeeForm);
        console.log(error);
      }
    );
  }
  
  

  // Method for handling item selection
  selectedItems = [];
  // Getter for homeLocationIds FormArray
  get homeLocationIds(): FormArray {
    return this.employeeForm.get('homeLocationIds') as FormArray;
  }

  addHomeLocation(key: string): void {
    // Add only the key to the FormArray
    this.homeLocationIds.push(new FormControl(key));
  }

  removeHomeLocation(key: string): void {
    const index = this.homeLocationIds.controls.findIndex(
      (control) => control.value === key
    );
    if (index >= 0) {
      this.homeLocationIds.removeAt(index);
    }
  }

 // Add a selected item's ID to homeLocationIds
onItemSelect(item: any): void {
  console.log('Selected item:', item);
  this.addHomeLocation(item.id); // Use item.id instead of item.key
}

// Remove a selected item's ID from homeLocationIds
onItemDeselect(item: any): void {
  console.log('Deselected item:', item);
  this.removeHomeLocation(item.id); // Use item.id instead of item.key
}

// Add all selected items' IDs to homeLocationIds
onSelectAll(items: any[]): void {
  this.homeLocationIds.clear();
  items.forEach((item) => this.addHomeLocation(item.id)); // Use item.id instead of item.key
}

// Clear all selected items from homeLocationIds
onDeselectAll(): void {
  this.homeLocationIds.clear();
}

  nationalities: any[] = [];
  getAllNationalities() {
    this.nationality.getAllNationalities().subscribe(response => {
      this.nationalities = response;
      //console.log(this.departments);
    }, error => {
      console.error('Error fetching nationalites data:', error)
    })
  }
  // Update
  onCheckboxChange(category: any) {
    this.selectedCategory = category;  // Store the selected category data
  }
  openModalForSelected() {
    if (this.selectedCategory) {
      this.employeeForm.patchValue({
        name: this.selectedCategory.name,
        localName: this.selectedCategory.localName,
        jobTitle: this.selectedCategory.jobTitle,
        departmentSupervisorId: this.selectedCategory.departmentSupervisorId,
        departmentManagerId: this.selectedCategory.departmentManagerId,
        departmentId: this.selectedCategory.departmentId,
        startDate: this.selectedCategory.startDate,
        endDate: this.selectedCategory.endDate,
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
    if (this.employeeForm.valid) {
      const updatedCategory = { ...this.employeeForm.value, id: this.selectedCategory.id };

      // Call the update service method using the category's id
      this.employeeService.updateEmployee(this.selectedCategory.id, updatedCategory).subscribe(
        (response) => {
          console.log('Employee updated successfully:', response);
          this.toast.success('Employee updated successfully')
          // Update the local categories array if necessary
          const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.storesSec[index] = updatedCategory;
          }

          this.getAllEmployees();
          this.closeModal();  // Close the modal after successful update
          this.employeeForm.reset();
        },
        (error) => {
          console.error('Error updating category:', error);
          console.log('Updated Category Data:', updatedCategory);
          const errorMessage = error.error?.message || 'An unexpected error occurred.';
          this.toast.error(errorMessage, 'Error');
          // alert('An error occurred while updating the item type .');
          this.toast.error('An error occurred while updating the item type .')
        }
      );
    }
  }

  deleteItemType() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed) {
      this.employeeService.deleteEmployeeById(this.selectedCategory.id).subscribe(
        (response) => {
          console.log('Employee deleted successfully:', response);
          this.toast.success('Employee deleted successfully');
          this.getAllEmployees();
          this.closeModal();
        }, error => {
          console.error('Error delete employeecategory:', error);
          console.log(this.selectedCategory.id);
          // alert('An error occurred while updating the employee.');
          this.toast.error('An error occurred while deleting the employee.')
        }
      )
    } else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }

  }

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllEmployees();
  }

  selectAll = false;

  toggleAllCheckboxes() {
    this.employees.forEach(item => (item.checked = this.selectAll));
  }

  updateSelectAll() {
    this.selectAll = this.employees.every(item => item.checked);
  }
}
