import { Component, OnInit } from '@angular/core';
import { ProjactService } from 'src/app/services/getAllServices/Projects/projact.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 10;
  public projects:any[]=[];
  try:any[]=[];
  names:any[]=[]
  constructor(private projectService:ProjactService, private http: HttpClient){

   
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

    onSubmit(form: any) {
      if (form.valid) {
        const formData = {
          name: form.value.name,
          localName: form.value.localName,
          //code: form.value.code,
          startDate: form.value.startDate,
          endDate: form.value.endDate,
          clientId: form.value.clientId,
          assignedToId: form.value.assignedToId,
          teamId: form.value.teamId,
          userIds: form.value.userIds,
          size: form.value.size,
          priority: form.value.priority,
        };
  
        this.projectService.createData(formData).subscribe(response => {
          console.log('Data submitted successfully', response);
        }, error => {
          console.error('Error occurred while submitting data', error);
        });
      }

}
changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllProjects();
}
}
