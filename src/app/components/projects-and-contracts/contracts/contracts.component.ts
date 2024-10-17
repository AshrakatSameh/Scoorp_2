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
  contractForm!:FormGroup;
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

  onSubmit(form: any) {
    if (form.valid) {
      const formData = {
        name: form.value.name,
        localName: form.value.localName,
        code: form.value.code,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        clientId: form.value.clientId,
        assignedToId: form.value.assignedToId,
        teamId: form.value.teamId,
        userIds: form.value.userIds,
       
      };

      this.cnotractService.createData(formData).subscribe(response => {
        console.log('Data submitted successfully', response);
        alert('Data submitted successfully')
      }, error => {
        console.error('Error occurred while submitting data', error);
      });
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

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getcontracts();
  }

}
