import { Component, OnInit, ViewChild } from '@angular/core';
import { ConvenantService } from 'src/app/services/getAllServices/Convenants/convenant.service';

@Component({
  selector: 'app-received-covenant',
  templateUrl: './received-covenant.component.html',
  styleUrls: ['./received-covenant.component.css']
})
export class ReceivedCovenantComponent implements OnInit{

  pageNumber: number = 1;
  pageSize: number = 10;
  convenants:any[]=[];
  constructor(private ConvenantService:ConvenantService){}
  ngOnInit(): void {
    this.getAllConvenants();
  }


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


  getAllConvenants(){
    this.ConvenantService.getAllConvenants(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.convenants = data.data;
          // console.log(this.try)
          console.log(this.convenants);
        }, error => {
          console.error('Error fetching convenants data:', error);
        });
      }
}
