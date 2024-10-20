import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectTypeService } from 'src/app/services/getAllServices/ProjectTypes/project-type.service';

@Component({
  selector: 'app-type-of-projects',
  templateUrl: './type-of-projects.component.html',
  styleUrls: ['./type-of-projects.component.css']
})
export class TypeOfProjectsComponent {
  
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

  pageNumber: number = 1;
  pageSize: number = 10;
  projectTypes:any[] =[];
  projectTypeForm:FormGroup;

  constructor(private projestService: ProjectTypeService,private fb:FormBuilder){
    this.projectTypeForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      //colorId:['',Validators.required]
    })
  }
  ngOnInit(): void {
this.getAllProjectTypes();
   
}
getAllProjectTypes(){
  this.projestService.getAllProjectTypes(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.projectTypes = data.data;
        // console.log(this.try)
      }, error => {
        console.error('Error fetching projects data:', error);
      });
}

onSubmitAdd(): void {
   
  if (this.projectTypeForm.valid) {
    // Call the service to post the data
    const formData = this.projectTypeForm.value; // Get the form data
    this.projestService.createProjectType(formData).subscribe(
      response => {
        console.log('Project type created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating Project type:', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.projectTypeForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}

changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllProjectTypes();
}
}
