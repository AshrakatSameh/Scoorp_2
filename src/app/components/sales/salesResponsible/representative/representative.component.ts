import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { JobType } from 'src/app/enums/JobType';
import { UserAccessType } from 'src/app/enums/UserAccessType';
import { EmployeeService } from 'src/app/services/getAllServices/Employee/employee.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { TestService } from 'src/app/services/getAllServices/Test/test.service';
import { UserTypesService } from 'src/app/services/getAllServices/UserTypes/user-types.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrls: ['./representative.component.css']
})
export class RepresentativeComponent implements OnInit {

  representativeForm: FormGroup;
  representative: any[] = [];
  teams:any[]=[];
  userTypes:any[]=[];
  employees:any[]=[];

  jobType= JobType;  
  // Convert enum to an array for dropdown
  jobTypeList: { key: string, value: string }[] = [];

  userAccessType= UserAccessType; 
  // Convert enum to an array for dropdown
  userAccessTypeList: { key: string, value: string }[] = [];

  
  constructor(private representService: RepresentativeService,private teamService:TeamsService,
    private userTypeService:UserTypesService,
    private http: HttpClient, private fb: FormBuilder, private testService:TestService,
  private empService:EmployeeService, private toast:ToastrService) {
    this.representativeForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password:['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      // userTypeId: ['', Validators.required],
      description: [],
      jobType: [],
      accessTypes: this.fb.array([]),
      employeeId:['', Validators.required] // Initialize accessTypes as a FormArray

    });

    this.jobTypeList = Object.keys(this.jobType).map(key => ({
      key: key,
      value: this.jobType[key as keyof typeof JobType]
    }));

    this.userAccessTypeList = Object.keys(this.userAccessType).map(key => ({
      key: key,
      value: this.userAccessType[key as keyof typeof UserAccessType]
    }));
  }
  userData:any;
  ngOnInit(): void {
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getAllUserTypes();
    this.getAllEmpoyees();

    
    this.testService.getTest().subscribe({
      next: (data) => {
        this.userData = data;
        console.log('User Data:', this.userData);
      },
      error: (error) => {
        console.error('Error fetching user data or permission denied', error);
      }
    });
  }
  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
  apiUrl = environment.apiUrl;

  getAllTeams(){
    this.teamService.getTeams().subscribe(response =>{
      this.teams = response.teams;

    },error=>{
      console.log('Error in fetch data : ' , error)
    }
  )
  }

  getAllUserTypes(){
    this.userTypeService.getUserTypes().subscribe(response =>{
      this.userTypes = response.data;

    },error=>{
      console.log('Error in fetch data : ' , error)
    }
  )
  }

  getAllRepresentatives() {
    this.representService.getAllRepresentative().subscribe(response => {
      this.representative = response;
      //console.log(this.salesOffers);
    }, error => {
      console.error('Error fetching representative data:', error)
    })
  }

  getAllEmpoyees() {
    this.empService.getAllEmployeesWithoutPaging().subscribe(response => {
      this.employees = response.data;
      //console.log(this.salesOffers);
    }, error => {
      console.error('Error fetching representative data:', error)
    })
  }

  onSubmitAdd(): void {
   
    if (this.representativeForm.valid) {
      // Call the service to post the data
      const formData = this.representativeForm.value; // Get the form data
      this.representService.createRepresentative(formData).subscribe(
        response => {
          console.log('Representative created successfully!', response);
          // alert('Representative created successfully!')
          this.toast.success("Representative created successfully!",'Success');
        },
        (error) => {
          // const errorMessage = error.error?.message || error.message || 'An error occurred!';
          // console.error('Error creating Representative:', error);
          this.toast.error(error.error);
          console.log(formData)
          // Handle error, show notification, etc.
        }
      );
    } else {
      console.log(this.representativeForm);
      this.toast.error('Form is not valid');

      console.log('Form is not valid');
      // Handle form validation errors
    }
  }

  

}
