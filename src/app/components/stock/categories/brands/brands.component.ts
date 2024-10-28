import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandsService } from 'src/app/services/getAllServices/brands/brands.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {
  storesSec:any[] =[];
  brandForm : FormGroup;

  constructor(private brandServices: BrandsService , private fb: FormBuilder){
    this.brandForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required]
    })

  }

  ngOnInit(): void {

    this.brandServices.getAllbrands().subscribe(
     (response) => {
       this.storesSec = response.brands; // Assign the fetched Warehouses
       console.log('brands :', this.storesSec);
     },
     (error) => {
       console.error('Error fetching brands section:', error); // Handle errors
     }
   );
}


onSubmitAdd(): void {
   
  if (this.brandForm.valid) {
    // Call the service to post the data
    const formData = this.brandForm.value; // Get the form data
    this.brandServices.createbrand(formData).subscribe(
      response => {
        console.log('brands created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating brand :', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.brandForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}
  
}
