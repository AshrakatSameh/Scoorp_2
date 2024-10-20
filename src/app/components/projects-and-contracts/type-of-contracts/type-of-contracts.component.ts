import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractTypeService } from 'src/app/services/getAllServices/ContractType/contract-type.service';

@Component({
  selector: 'app-type-of-contracts',
  templateUrl: './type-of-contracts.component.html',
  styleUrls: ['./type-of-contracts.component.css']
})
export class TypeOfContractsComponent {
  contractTypeForm:FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
contractTypes:any[]=[];
  constructor(private http: HttpClient, private fb:FormBuilder,private contractService:ContractTypeService){
    this.contractTypeForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      //colorId:['',Validators.required]
    });
    this.getAllContractTypes();
  }

  getAllContractTypes(){
    this.contractService.getAllContractTypes(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.contractTypes = data.data;
          // console.log(this.try)
        }, error => {
          console.error('Error fetching contracts data:', error);
        });
  }
  
  onSubmitAdd(): void {
     
    if (this.contractTypeForm.valid) {
      // Call the service to post the data
      const formData = this.contractTypeForm.value; // Get the form data
      this.contractService.createContractType(formData).subscribe(
        response => {
          console.log('contract type created successfully!', response);
          alert('contract type created successfully!')
          // Handle success, show notification, etc.
        },
        error => {
          console.error('Error creating contract type:', error);
          console.log(formData)
          // Handle error, show notification, etc.
        }
      );
    } else {
      console.log(this.contractTypeForm);
      console.log('Form is not valid');
      // Handle form validation errors
    }
  }
  
  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllContractTypes();
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
}
