import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { ContactsService } from 'src/app/services/getAllServices/Contacts/contacts.service';
import { ContractService } from 'src/app/services/getAllServices/Contracts/contract.service';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 10;
  contacts:any []=[];
  location:any[]=[];
  contactForm:FormGroup;

  apiUrl= 'https://lawersys-001-site1.etempurl.com/api/Contact';

  constructor(private contactService:ContactsService, private locationService:LocationService,
    private clientService:ClientsService, private fb:FormBuilder, private http:HttpClient
  ){
    
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      phoneNumber1: ['', Validators.required],
      phoneNumber2: ['', Validators.required],
      jobTitle: ['', Validators.required],
      email: ['', Validators.required],
      locationLinks: ['', Validators.required],
      nationality: ['', Validators.required],
      clientId: ['', Validators.required],
      supplier: ['', Validators.required],
      description:['', Validators.required]

    });
  }

  ngOnInit(): void {
    this.getAllContacts();
    this.getLocations();
    this.getClients();
  }
  getAllContacts() {
    this.contactService.getAllContacts(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.contacts = data.contacts;
        //console.log(this.contacts);
      }, error => {
        console.error('Error fetching contacts data:', error);
      });
  }

  
  getLocations() {
    this.locationService.getLocations()
      .subscribe(data => {
        this.location = data.data;
        console.log(this.location);
      }, error => {
        console.error('Error fetching location data:', error);
      });
  }

  clients:any[]=[]
  getClients() {
    this.clientService.getCliensts()
      .subscribe(data => {
        this.clients = data.data;
        console.log(this.clients);
      }, error => {
        console.error('Error fetching clients data:', error);
      });
  }


  onSubmit() {
    const formData = new FormData();
    const name = this.contactForm.get('name')!.value;
    const localName = this.contactForm.get('localName')!.value;
    const jobTitle = this.contactForm.get('jobTitle')!.value;
    const phoneNumber1 = this.contactForm.get('phoneNumber1')!.value;
    const phoneNumber2 = this.contactForm.get('phoneNumber2')!.value;
    const email = this.contactForm.get('email')!.value;
    const locationLinks = this.contactForm.get('locationLinks')!.value;
    const nationality = this.contactForm.get('nationality')!.value;
    const clientId = this.contactForm.get('clientId')!.value;
    const supplier = this.contactForm.get('supplier')!.value;
    const description = this.contactForm.get('description')!.value;

    if (name) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('jobTitle', jobTitle);
      formData.append('phoneNumber1', phoneNumber1);
      formData.append('phoneNumber2', phoneNumber2);
      formData.append('email', email);
      formData.append('locationLinks', locationLinks);
      formData.append('nationality', nationality);
      formData.append('clientId', clientId);
      formData.append('supplier', supplier);
      formData.append('description', description);


      
    } else {
      console.error('One or more form fields are null');
      return;
    }

   
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    // const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&JobTitle=${encodeURIComponent(jobTitle)}&DepartmentManagerId=${encodeURIComponent(departmentManagerId)}&DepartmentSupervisorId=${encodeURIComponent(departmentSupervisorId)}&StartDate=${encodeURIComponent(startDate)}&EndDate=${encodeURIComponent(endDate)}`;
    this.http.post<any>(this.apiUrl, formData,{headers}).subscribe(
      (response) => {
        alert('Done');
        console.log('Contact created successfully:', response);
        // Reset form after successful submission
        this.contactForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating Contact:', error.error);
        // Handle error
      }
    );
  }




  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllContacts();
  }
}
