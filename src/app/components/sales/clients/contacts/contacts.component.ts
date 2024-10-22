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

  apiUrl= environment.apiUrl +'Contact';

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
      description:['', Validators.required],
      attachments:[]
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
    formData.append('name', this.contactForm.get('name')?.value);
    formData.append('localName', this.contactForm.get('localName')?.value);
    formData.append('phoneNumber1', this.contactForm.get('phoneNumber1')?.value);
    formData.append('phoneNumber2', this.contactForm.get('phoneNumber2')?.value);
    formData.append('jobTitle', this.contactForm.get('jobTitle')?.value);
    formData.append('email', this.contactForm.get('email')?.value);
    formData.append('locationLinks', this.contactForm.get('locationLinks')?.value);
    formData.append('nationality', this.contactForm.get('nationality')?.value);
    formData.append('clientId', this.contactForm.get('clientId')?.value);
    formData.append('supplier', this.contactForm.get('supplier')?.value);
    formData.append('description', this.contactForm.get('description')?.value);
    formData.append('attachments', this.contactForm.get('attachments')?.value);

  
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl, formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        alert('submit successfully');
      }, error => {
        console.error('Error:', error);
      });
  }


  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllContacts();
  }
}
