import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { ContractService } from 'src/app/services/getAllServices/Contracts/contract.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { UserService } from 'src/app/services/getAllServices/Users/user.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent {

  isFirstButtonClicked = false;
  isSecondButtonClicked = false;

  istableview = true;
  iscardsview=false;

  isMapView = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  contracts:any[]=[];
  contractForm:FormGroup;
  apiUrl= environment.apiUrl;
  clients:any[]=[];
  users:any[]=[];
  teams:any[]=[];

  constructor(private cnotractService:ContractService,private fb:FormBuilder, private http:HttpClient,
    private clientService:ClientsService, private userService:UserService, private teamService:TeamsService
     
  ){

    this.getcontracts();
    this.getAllClients();
    this.getAllUsers(); 
    this.getAllTeams();

    this.contractForm= this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      clientId: ['', Validators.required],
      assignedToId: ['', Validators.required],
      teamId:['',Validators.required],
      userIds:['',Validators.required],
      startDate:['',Validators.required],
      endDate:['',Validators.required],
      code: ['', Validators.required],
      
      });
  }

  getcontracts(){
    this.cnotractService.getPagingContracts(this.pageNumber, this.pageSize)
    .subscribe(data => {
      this.contracts = data.contracts;
     // console.log(this.contracts)
    }, error => {
      console.error('Error fetching employees data:', error);
    });
  }

  getAllClients() {
    this.clientService.getCliensts().subscribe(response => {
      this.clients = response.data;
      //console.log(this.clients);
    }, error => {
      console.error('Error fetching  clients:', error)
    })
  }

  getAllUsers() {
    this.userService.getUsers().subscribe(response => {
      this.users = response;
      //console.log(this.users);
    }, error => {
      console.error('Error fetching  Users:', error)
    })
  }

  getAllTeams() {
    this.teamService.getTeams().subscribe(response => {
      this.teams = response.teams;
      console.log(this.teams);
    }, error => {
      console.error('Error fetching  teams:', error)
    })
  }





  onSubmitAdd() {
    const formData = new FormData();
    const name = this.contractForm.get('name')!.value;
    const localName = this.contractForm.get('localName')!.value;
    const clientId = this.contractForm.get('clientId')!.value;
    const assignedToId = this.contractForm.get('assignedToId')!.value;
    const teamId = this.contractForm.get('teamId')!.value;
    const userIds = this.contractForm.get('userIds')!.value;
    const startDate = this.contractForm.get('startDate')!.value;
    const endDate = this.contractForm.get('endDate')!.value;
    const code = this.contractForm.get('code')!.value;
    if (name) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('clientId', clientId);
      formData.append('assignedToId', assignedToId);
      formData.append('teamId', teamId);
      formData.append('userIds', userIds);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('code', code);
      
    } else {
      console.error('One or more form fields are null');
      return;
    }

    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}Contract/CreateContract`;
    this.http.post<any>(url, formData,{headers}).subscribe(
      (response) => {
        alert('Done');
        console.log('contract created successfully:', response);
        // Reset form after successful submission
        this.contractForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating contract:', error.error);
        // Handle error
      }
    );
  }

  onSubmit(): void {
   
    if (this.contractForm.valid) {
      // Call the service to post the data
      const formData = this.contractForm.value; // Get the form data
      this.cnotractService.createContracts(formData).subscribe(
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
      console.log(this.contractForm);
      console.log('Form is not valid');
      // Handle form validation errors
    }
  }

  toggleMap(){
    this.isMapView = true
  }

  toggleFirstButtonClick() {
    this.isFirstButtonClicked = true;
  this.isSecondButtonClicked = false;
  this.toggleCardsonClick()
  }

  toggleSecondButtonClick() {
    this.isSecondButtonClicked = true;
  this.isFirstButtonClicked = false;
  this.toggleTableonClick();
  }

  toggleTableonClick(){
    this.istableview = true;  // Set table view to true
    this.iscardsview = false; // Set cards view to false
  }

  toggleCardsonClick(){
    this.istableview = false;
    this.iscardsview = true;
  }

  isDropdownOpen = false;
  isRowRemoved = false;

  openDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.removeRow();
    }
  }

  removeRow() {
    this.isRowRemoved = true;
  }

  buttons=['التفاصيل','المهام','الاستبيانات','التعليقات','مالية العقد','اقساط العقد']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

}
