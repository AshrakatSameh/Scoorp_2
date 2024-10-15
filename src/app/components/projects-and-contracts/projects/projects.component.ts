import { Component, OnInit } from '@angular/core';
import { ProjactService } from 'src/app/services/getAllServices/Projects/projact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 3;
  public projects:any[]=[];
  try:any[]=[];
  names:any[]=[]
  constructor(private projectService:ProjactService){
    this.names= [
      {id: 1 , name: 'ash'},
      {id: 2 , name: 'ash'},
      {id: 3 , name: 'ash'},
      {id: 4 , name: 'ash'}
    ]
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

  //    // Called when the user changes the page number (e.g. via pagination controls)
  // changePage(newPageNumber: number): void {
  //   this.pageNumber = newPageNumber;
  //   console.log(this.pageNumber)
  //   this.getAllProjects();
  // }
}
