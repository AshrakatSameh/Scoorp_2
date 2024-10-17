import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent {
  storesSec:any[] =[];
  TypeForm : FormGroup;

  constructor(private itemTypeServices: ItemTypeService , private fb: FormBuilder){
    this.TypeForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
      code:['',Validators.required]
    })

  }

  ngOnInit(): void {

    this.itemTypeServices.getAllitemType().subscribe(
     (response) => {
       this.storesSec = response; // Assign the fetched Warehouses
       console.log('item types :', this.storesSec);
     },
     (error) => {
       console.error('Error fetching item types section:', error); // Handle errors
     }
   );
}


onSubmitAdd(): void {
   
  if (this.TypeForm.valid) {
    // Call the service to post the data
    const formData = this.TypeForm.value; // Get the form data
    this.itemTypeServices.createItemType(formData).subscribe(
      response => {
        console.log('item type created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating types :', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.TypeForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}
}
