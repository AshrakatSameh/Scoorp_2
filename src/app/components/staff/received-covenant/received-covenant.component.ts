import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvenantService } from 'src/app/services/getAllServices/Convenants/convenant.service';
import { EmployeeService } from 'src/app/services/getAllServices/Employee/employee.service';
import { EquipmentService } from 'src/app/services/getAllServices/Equipment/equipment.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-received-covenant',
  templateUrl: './received-covenant.component.html',
  styleUrls: ['./received-covenant.component.css']
})
export class ReceivedCovenantComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 10;
  convenants: any[] = [];
  convenantForm!:FormGroup;
  employees:any[]=[];
  equips:any[]=[];
  api = environment.apiUrl +'Covenants/CreateCovenant'
  constructor(private ConvenantService: ConvenantService, private fb:FormBuilder,
    private employeeService:EmployeeService,private equipService: EquipmentService,
  private http: HttpClient ) {
      this.convenantForm=this.fb.group({
        name:['',Validators.required],
        localName:['',Validators.required],
        receivingStartDate:['',Validators.required],
        receivingEndDate:['',Validators.required],
        employeeId:['',Validators.required],
        equipmentId:['',Validators.required],
         description:[],
  
      })
    }
  ngOnInit(): void {
    this.getAllConvenants();
    this.getAllEmployees();
    this.getAllEquipmqnts(); 
   

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


  getAllConvenants() {
    this.ConvenantService.getAllConvenants(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.convenants = data.data;
        // console.log(this.try)
        console.log(this.convenants);
      }, error => {
        console.error('Error fetching convenants data:', error);
      });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployeesWithoutPaging().subscribe(response => {
      this.employees = response.data;
      //console.log(this.managers);
    }, error => {
      console.error('Error fetching employees data:', error)
    })
  }


  getAllEquipmqnts() {
    this.equipService.getEquipments().subscribe(response => {
      this.equips = response.data;
      //console.log(this.managers);
    }, error => {
      console.error('Error fetching employees data:', error)
    })
  }
  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllConvenants();
  }
  onSubmit() {
    const formData = new FormData();
    const name = this.convenantForm.get('name')!.value;
    const localName = this.convenantForm.get('localName')!.value;
    const employeeId = this.convenantForm.get('employeeId')!.value;
    const receivingStartDate = this.convenantForm.get('receivingStartDate')!.value;
    const receivingEndDate = this.convenantForm.get('receivingEndDate')!.value;
    const description = this.convenantForm.get('description')!.value;
    const equipmentId = this.convenantForm.get('equipmentId')!.value;

    if (name) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('employeeId', employeeId);
      formData.append('receivingStartDate', receivingStartDate);
      formData.append('receivingEndDate', receivingEndDate);
      formData.append('description', description);
      formData.append('equipmentId', equipmentId);


      
    } else {
      console.error('One or more form fields are null');
      return;
    }

    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      'tenant': tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    const url = `${this.api}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&ReceivingStartDate=${encodeURIComponent(receivingStartDate)}&ReceivingEndDate=${encodeURIComponent(receivingEndDate)}&Description=${encodeURIComponent(description)}&EmployeeId=${encodeURIComponent(employeeId)}&EquipmentId=${encodeURIComponent(equipmentId)}`;

    this.http.post<any>(url, formData,{headers}).subscribe(
      (response) => {
        alert('Done');
        console.log('Convenant created successfully:', response);
        // Reset form after successful submission
        this.convenantForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating Convenant:', error.error);
        // Handle error
      }
    );
  }
}
