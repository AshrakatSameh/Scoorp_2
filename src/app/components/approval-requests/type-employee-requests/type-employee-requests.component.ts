import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-type-employee-requests',
  templateUrl: './type-employee-requests.component.html',
  styleUrls: ['./type-employee-requests.component.css']
})
export class TypeEmployeeRequestsComponent {

  @ViewChild('fileInput') fileInput: any; // Reference to file input
  fileNames: string[] = []; // Variable to store file names

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const rectangle = event.target as HTMLElement;
    rectangle.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const rectangle = event.target as HTMLElement;
    rectangle.classList.remove('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const rectangle = event.target as HTMLElement;
    rectangle.classList.remove('dragover');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.onFileSelected(event.dataTransfer.files);
    }
  }

  onFileSelected(files: FileList | any): void {
    this.fileNames = []; // Clear previous file names

    if (files instanceof FileList) {
      // If files were selected via the input or dragged
      for (let i = 0; i < files.length; i++) {
        this.fileNames.push(files[i].name); // Store the file names
      }
    }
    console.log(this.fileNames); // Log the file names to the console (optional)
  }

}
