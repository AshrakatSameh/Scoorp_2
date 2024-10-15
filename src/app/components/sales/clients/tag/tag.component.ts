import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagService } from 'src/app/services/getAllServices/Tag/tag.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit{
  tags: any[] = [];
  tagForm : FormGroup;
  constructor(private tagService: TagService, private fb: FormBuilder){
    this.tagForm= this.fb.group({
      name:['', Validators.required],
      description:['', Validators.required]
    })
  }

  
  ngOnInit(): void {
   this.getAllTags();

}

getAllTags(){
  this.tagService.getUserTags().subscribe(response=>{
      this.tags= response;
      console.log(this.tags);
    }, error =>{
      console.error('Error fetching tags data:' , error)
    })
    
  }

  onSubmitAdd(): void {
   
    if (this.tagForm.valid) {
      // Call the service to post the data
      const formData = this.tagForm.value; // Get the form data
      this.tagService.createTag(formData).subscribe(
        response => {
          console.log('Tag created successfully!', response);
          // Handle success, show notification, etc.
        },
        error => {
          console.error('Error creating tag:', error);
          console.log(formData)
          // Handle error, show notification, etc.
        }
      );
    } else {
      console.log(this.tagForm);
      console.log('Form is not valid');
      // Handle form validation errors
    }
  }








   // Handle file selection via input click
   onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  // Handle file dropped via drag-and-drop
  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;  // Cast to HTMLElement
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    // Remove the hover effect class on drag leave
    event.preventDefault();
    const target = event.target as HTMLElement;  // Cast EventTarget to HTMLElement
    target.classList.add('drag-over');  }

  // Handle file logic (validate and upload)
  handleFile(file: File): void {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size exceeds 10MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, or PDF files are allowed');
      return;
    }

    // Perform file upload or further processing here
    console.log('File selected:', file);
    // You could upload the file to the server here using an API service
  }
}