import { Component, HostListener, OnInit } from '@angular/core';
import { ProjactService } from 'src/app/services/getAllServices/Projects/projact.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { Toast, ToastrService } from 'ngx-toastr';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { UserService } from 'src/app/services/getAllServices/Users/user.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 10;
  projects:any[]=[];
  try:any[]=[];
  names:any[]=[];
  projectForm:FormGroup;
  apiUrl= environment.apiUrl;


  constructor(private projectService:ProjactService, private http: HttpClient,
    private fb:FormBuilder, private toast: ToastrService,private locationServ:LocationService,
    private clientService:ClientsService, private userServ:UserService,
    private teamServ: TeamsService
  ){

   
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      clientId: ['', Validators.required],
      assignedToId: ['', Validators.required],
      teamId: ['', Validators.required],
      userIds:this.fb.array([]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      locations:[],

     // status: ['', Validators.required],
      priority: ['', Validators.required],
      size: ['', Validators.required],



    });
  }

  ngOnInit(): void {
    this.toggleTableonClick();
    this.getAllProjects();
    this.getAllLocations();
    this.getAllClients();
    this.getAllTeams();
    this.getAllUsers();
  }

  isMapView = false;

  toggleMap(){
    this.isMapView = true
  }
  closeMap(){
    this.isMapView=false;
  }
  

  isFirstButtonClicked = false;
  isSecondButtonClicked = false;

  istableview = true;
  iscardsview=false;

  toggleFirstButtonClick() {
    this.isFirstButtonClicked = true;
  this.isSecondButtonClicked = false;
  this.toggleCardsonClick()
  }

  toggleSecondButtonClick() {
    this.isSecondButtonClicked = true;
  this.isFirstButtonClicked = false;
  this.toggleTableonClick();
  }

  toggleTableonClick(){
    this.istableview = true;  // Set table view to true
    this.iscardsview = false; // Set cards view to false
  }

  toggleCardsonClick(){
    this.istableview = false;
    this.iscardsview = true;
  }

  isDropdownOpen = false;
  isRowRemoved = false;

  openDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.removeRow();
    }
  }

  removeRow() {
    this.isRowRemoved = true;
  }

  buttons=['التفاصيل','المهام','الاستبيانات','التعليقات','مالية المشروع']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }


  // get all



 

  getAllProjects(){
  this.projectService.getProjacts(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.try = data.projects;
        // console.log(this.try)
      }, error => {
        console.error('Error fetching projects data:', error);
      });
    }

locations:any[]=[];
getAllLocations(){
  this.locationServ.getLocations().subscribe(
    (response) => {
      this.locations = response.data; // Assign the fetched Warehouses
      console.log('item types :', this.locations);
    },
    (error) => {
      console.error('Error fetching locations section:', error); // Handle errors
    }
  );
}
teamss:any[]=[];
getAllTeams(){
  this.teamServ.getTeams().subscribe(
    (response) => {
      this.teamss = response.teams; // Assign the fetched Warehouses
      console.log('teams:', this.locations);
    },
    (error) => {
      console.error('Error fetching teams section:', error); // Handle errors
    }
  );
}
clients:any[]=[];
getAllClients(){
  this.clientService.getCliensts().subscribe(
    (response) => {
      this.clients = response.data; // Assign the fetched Warehouses
      console.log('clients:', this.locations);
    },
    (error) => {
      console.error('Error fetching clients section:', error); // Handle errors
    }
  );
}
users:any []=[];
getAllUsers(){
  this.userServ.getUsers().subscribe(
    (response) =>{
      this.users = response;
    },
    (error) => {
      console.error('Error fetching users section:', error); // Handle errors
    }
  )
}

api= environment.apiUrl+'Project/CreateProject';
onSubmit() {
  const formData = new FormData();
  
  formData.append('name', this.projectForm.get('name')?.value);
  formData.append('localName', this.projectForm.get('localName')?.value);
  formData.append('clientId', this.projectForm.get('clientId')?.value);
  formData.append('assignedToId', this.projectForm.get('assignedToId')?.value);
  formData.append('teamId', this.projectForm.get('teamId')?.value);
  
  const userIds = this.projectForm.get('userIds')?.value;
  if (Array.isArray(userIds)) {
      userIds.forEach(id => formData.append('userIds', id));
  }

  formData.append('startDate', this.projectForm.get('startDate')?.value);
  formData.append('endDate', this.projectForm.get('endDate')?.value);
  formData.append('locations', this.projectForm.get('locations')?.value);
  formData.append('priority', this.projectForm.get('priority')?.value);
  formData.append('size', this.projectForm.get('size')?.value);

  const headers = new HttpHeaders({
    tenant: localStorage.getItem('tenant') || ''  // Add your tenant value here
  });

  this.http.post(this.api, formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      this.toast.success("submit successfully");
      this.getAllProjects();
      this.projectForm.reset();
    }, error => {
      console.error('Error details:', error);
      if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
      } else {
          console.error(`Backend returned code ${error.status}, body was: `, error.error);
      }
      this.toast.error('Error in submit');
    });
}


changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllProjects();
}


// dropdown table columns
columns = [
  // { name: 'id', displayName: 'المسلسل', visible: true },
  { name: 'name', displayName: 'اسم القسم', visible: true },
  { name: 'localName', displayName: 'اسم القسم باللغه المحليه', visible: true },
  { name: 'code', displayName: 'كود المشروع', visible: true },
  { name: 'clientName', displayName: 'اسم العميل', visible: true },
  { name: 'startDate', displayName: 'تاريخ البدء', visible: false },
  { name: 'endDate', displayName: 'تاريخ الإنتهاء', visible: false }

];
showDropdown= false;
toggleDropdown() {
  this.showDropdown = !this.showDropdown; // Toggle the dropdown visibility
  console.log('Dropdown visibility:', this.showDropdown); // Check if it’s toggling
}

isColumnVisible(columnName: string): boolean {
  const column = this.columns.find(col => col.name === columnName);
  return column ? column.visible : false;
}

toggleColumnVisibility(columnName: string) {
  const column = this.columns.find(col => col.name === columnName);
  if (column) {
    column.visible = !column.visible;
  }
}

  // select checkbox
  onCheckboxChange(category: any) {
    this.updateSelectAll();
    // this.selectedCategory = category;  // Store the selected category data
  }
  selectAll = false;

  selectedCount = 0;
  
  toggleAllCheckboxes() {
    // Set each item's checked status to match selectAll
    this.try.forEach(item => (item.checked = this.selectAll));
    // Update the selected count
    this.selectedCount = this.selectAll ? this.try.length : 0;
  }
  
  updateSelectAll() {
    // Update selectAll if all items are checked
    this.selectAll = this.try.every(item => item.checked);
    // Calculate the number of selected items
    this.selectedCount = this.try.filter(item => item.checked).length;
  }
}
