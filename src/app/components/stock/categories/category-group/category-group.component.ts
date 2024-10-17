import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemgroupService } from 'src/app/services/getAllServices/itemgroup/itemgroup.service';

@Component({
  selector: 'app-category-group',
  templateUrl: './category-group.component.html',
  styleUrls: ['./category-group.component.css']
})
export class CategoryGroupComponent {
  storesSec:any[] =[];
  GroupForm : FormGroup;

  constructor(private itemGServices: ItemgroupService , private fb: FormBuilder){
    this.GroupForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
    })

  }

  ngOnInit(): void {

    this.itemGServices.getAllitemGroup().subscribe(
     (response) => {
       this.storesSec = response; // Assign the fetched Warehouses
       console.log('item Group :', this.storesSec);
     },
     (error) => {
       console.error('Error fetching item types Group:', error); // Handle errors
     }
   );
}


onSubmitAdd(): void {
   
  if (this.GroupForm.valid) {
    // Call the service to post the data
    const formData = this.GroupForm.value; // Get the form data
    this.itemGServices.createItemGroup(formData).subscribe(
      response => {
        console.log('item Group created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating types Group :', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.GroupForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}
}
