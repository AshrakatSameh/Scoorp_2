import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemcategoryService } from 'src/app/services/getAllServices/itemcategory/itemcategory.service';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';

@Component({
  selector: 'app-type-category',
  templateUrl: './type-category.component.html',
  styleUrls: ['./type-category.component.css']
})
export class TypeCategoryComponent {
  storesSec:any[] =[];
  TypeCatForm : FormGroup;

  constructor(private itemCatServices: ItemcategoryService , private fb: FormBuilder){
    this.TypeCatForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required],
    })

  }

  ngOnInit(): void {

    this.itemCatServices.getAllitemCat().subscribe(
     (response) => {
       this.storesSec = response.categories; // Assign the fetched Warehouses
       console.log('item cat :', this.storesSec);
     },
     (error) => {
       console.error('Error fetching item cat section:', error); // Handle errors
     }
   );
}


onSubmitAdd(): void {
   
  if (this.TypeCatForm.valid) {
    // Call the service to post the data
    const formData = this.TypeCatForm.value; // Get the form data
    this.itemCatServices.createItemCat(formData).subscribe(
      response => {
        console.log('item cat created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating item cat :', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.TypeCatForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}
}
