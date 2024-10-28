import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/services/getAllServices/unit/unit.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent {

  storesSec:any[] =[];
  unitForm : FormGroup;

  constructor(private unitService: UnitService , private fb: FormBuilder){
    this.unitForm= this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['',Validators.required]
    })

  }

  ngOnInit(): void {

    this.unitService.getAllUnits().subscribe(
     (response) => {
       this.storesSec = response.units; // Assign the fetched Warehouses
       console.log('units :', this.storesSec);
     },
     (error) => {
       console.error('Error fetching units section:', error); // Handle errors
     }
   );
}


onSubmitAdd(): void {
   
  if (this.unitForm.valid) {
    // Call the service to post the data
    const formData = this.unitForm.value; // Get the form data
    this.unitService.createUnits(formData).subscribe(
      response => {
        console.log('Units created successfully!', response);
        // Handle success, show notification, etc.
      },
      error => {
        console.error('Error creating Units :', error);
        console.log(formData)
        // Handle error, show notification, etc.
      }
    );
  } else {
    console.log(this.unitForm);
    console.log('Form is not valid');
    // Handle form validation errors
  }
}
  
  buttons=['المعلومات الشخصية ','معلومات المستخدم','المرفقات','معلومات العمل' ,'الاشعارات','المبيعات','الطلبات و المرفقات','الخطط و المهام','العهد المستلمه','الحساب البنكي']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

}
