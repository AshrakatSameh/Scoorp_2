import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/getAllServices/Department/department.service';
import { EmployeeService } from 'src/app/services/getAllServices/Employee/employee.service';
import { ManagerService } from 'src/app/services/getAllServices/Managers/manager.service';
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

  constructor(private employeeService: EmployeeService, private fb: FormBuilder,
    private departmentService: DepartmentService, private supervisorService: SupervisorService,
    private managerService: ManagerService, private http:HttpClient
  ) {

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      departmentSupervisorId: ['', Validators.required],
      departmentManagerId: ['', Validators.required],
      departmentId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]

    });
  }
  ngOnInit(): void {
    this.getAllEmployees();
    this.getAllDepartmesnts();
    this.getAllManagers();
    this.getAllSupervisors();
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

  // get All Departments
  getAllDepartmesnts() {
    this.departmentService.getAllDepartments().subscribe(response => {
      this.departments = response.data;
      //console.log(this.departments);
    }, error => {
      console.error('Error fetching Department data:', error)
    })

  }
  getAllSupervisors() {
    this.supervisorService.getAllSupervisors().subscribe(response => {
      this.supervisors = response;
      //console.log(this.supervisors);
    }, error => {
      console.error('Error fetching supervisors data:', error)
    })

  }


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
    if (name) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('jobTitle', jobTitle);
      formData.append('departmentSupervisorId', departmentSupervisorId);
      formData.append('departmentManagerId', departmentManagerId);
      formData.append('departmentId', departmentId);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);

      
    } else {
      console.error('One or more form fields are null');
      return;
    }

    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&JobTitle=${encodeURIComponent(jobTitle)}&DepartmentManagerId=${encodeURIComponent(departmentManagerId)}&DepartmentSupervisorId=${encodeURIComponent(departmentSupervisorId)}&StartDate=${encodeURIComponent(startDate)}&EndDate=${encodeURIComponent(endDate)}`;
    this.http.post<any>(url, formData,{headers}).subscribe(
      (response) => {
        alert('Done');
        console.log('Employee created successfully:', response);
        // Reset form after successful submission
        this.employeeForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating Employee:', error.error);
        // Handle error
      }
    );
  }
  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllEmployees();
  }
}