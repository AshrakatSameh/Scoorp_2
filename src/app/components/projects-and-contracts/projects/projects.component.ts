import { Component, OnInit } from '@angular/core';
import { ProjactService } from 'src/app/services/getAllServices/Projects/projact.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.development';

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
    private fb:FormBuilder
  ){

   
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      clientId: ['', Validators.required],
      assignedToId: ['', Validators.required],
      teamId: ['', Validators.required],
      userIds: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
     // status: ['', Validators.required],
      priority: ['', Validators.required],
      size: ['', Validators.required],



    });
  }

  ngOnInit(): void {
    this.toggleTableonClick();
    this.getAllProjects();
  }

  isMapView = false;

  toggleMap(){
    this.isMapView = true
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

    onSubmit() {
      const formData = new FormData();
    formData.append('name', this.projectForm.get('name')?.value);
    formData.append('localName', this.projectForm.get('localName')?.value);
    formData.append('clientId', this.projectForm.get('clientId')?.value);
    formData.append('assignedToId', this.projectForm.get('assignedToId')?.value);
    formData.append('teamId', this.projectForm.get('teamId')?.value);
    formData.append('userIds', this.projectForm.get('userIds')?.value);
    formData.append('startDate', this.projectForm.get('startDate')?.value);
    formData.append('endDate', this.projectForm.get('endDate')?.value);
    formData.append('priority', this.projectForm.get('priority')?.value);
    formData.append('size', this.projectForm.get('size')?.value);

    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post('https://lawersys-001-site1.etempurl.com/api/Project/CreateProject', formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        alert('submit successfully');
      }, error => {
        console.error('Error:', error);
      });

}
changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllProjects();
}
}
