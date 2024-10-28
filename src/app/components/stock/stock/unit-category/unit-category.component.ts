import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoresSectionService } from 'src/app/services/getAllServices/StoresSection/stores-section.service';

@Component({
  selector: 'app-unit-category',
  templateUrl: './unit-category.component.html',
  styleUrls: ['./unit-category.component.css']
})
export class UnitCategoryComponent {

  storesSec:any[] =[];
  unitCatForm : FormGroup;

  constructor(private mysrv: StoresSectionService , private fb: FormBuilder){
    this.unitCatForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required]
    })

  }

  ngOnInit(): void {

    this.mysrv.getAllUnitCategories().subscribe(
     (response) => {
       this.storesSec = response.categories; // Assign the fetched Warehouses
       console.log('store section:', this.storesSec);
     },
     (error) => {
       console.error('Error fetching stores section:', error); // Handle errors
     }
   );
}

onSubmitAdd(): void {
   
  if (this.unitCatForm.valid) {
    // Call the service to post the data
    const formData = this.unitCatForm.value; // Get the form data
    this.mysrv.createUnitCategory(formData).subscribe(
      response => {
        console.log('store Sec created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating store Sec:', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.unitCatForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}


}
