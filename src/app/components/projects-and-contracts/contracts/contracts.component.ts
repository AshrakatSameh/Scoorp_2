import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { ContractService } from 'src/app/services/getAllServices/Contracts/contract.service';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { UserService } from 'src/app/services/getAllServices/Users/user.service';
import { environment } from 'src/environments/environment.development';
import * as L from 'leaflet';


@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  isFirstButtonClicked = false;
  isSecondButtonClicked = false;

  istableview = true;
  iscardsview = false;

  isMapView = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  contracts: any[] = [];
  contractForm!: FormGroup;
  apiUrl = environment.apiUrl;
  clients: any[] = [];
  users: any[] = [];
  teams: any[] = [];
  locations: any[] = [];

  longitude!: number;
  latitude!: number;
  locationName!: string;
  locationAddress!: string;
  google: any;
  map: L.Map | undefined;
  locationLinks: string[] = []; // Initialize an array to hold location links

  constructor(private cnotractService: ContractService, private fb: FormBuilder, private http: HttpClient,
    private clientService: ClientsService, private userService: UserService, private teamService: TeamsService
    , private locarionService: LocationService
  ) {



    this.contractForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      clientId: ['', Validators.required],
      assignedToId: ['', Validators.required],
      teamId: ['', Validators.required],
      userIds: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      code: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.getcontracts();
    this.getAllClients();
    this.getAllUsers();
    this.getAllTeams();
    this.getLocations();

    // this.initializeMap();

  }

  isCodeVisible = false;
  toggleCode(): void {
    this.isCodeVisible = !this.isCodeVisible;  // Toggle the visibility
  }

  // initializeMap(): void {
  //   this.map = L.map('map').setView([51.505, -0.09], 13); // Set initial view

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '© OpenStreetMap'
  //   }).addTo(this.map);

  //   this.map.on('click', (event: L.LeafletMouseEvent) => {
  //     this.latitude = event.latlng.lat;
  //     this.longitude = event.latlng.lng;
  //     console.log('Latitude:', this.latitude, 'Longitude:', this.longitude);
  //   });
  // }

  getcontracts() {
    this.cnotractService.getPagingContracts(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.contracts = data.contracts;
        // console.log(this.contracts)
      }, error => {
        console.error('Error fetching employees data:', error);
      });
  }
  getLocations() {
    this.locarionService.getLocations().subscribe(response => {
      this.locations = response.data;
      //console.log(this.clients);
    }, error => {
      console.error('Error fetching  locations:', error)
    })
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


  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.contractForm.get('name')?.value);
    formData.append('localName', this.contractForm.get('localName')?.value);
    formData.append('clientId', this.contractForm.get('clientId')?.value);
    formData.append('assignedToId', this.contractForm.get('assignedToId')?.value);
    formData.append('teamId', this.contractForm.get('teamId')?.value);
    formData.append('userIds', this.contractForm.get('userIds')?.value);
    formData.append('startDate', this.contractForm.get('startDate')?.value);
    formData.append('endDate', this.contractForm.get('endDate')?.value);
    formData.append('code', this.contractForm.get('code')?.value);

    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl+'Contract/CreateContract', formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        alert('submit successfully');
      }, error => {
        console.error('Error:', error);
      });
  }
  // onSubmit(form: any) {
  //   if (form.valid) {
  //     const formData = {
  //       name: form.value.name,
  //       localName: form.value.localName,
  //       code: form.value.code,
  //       startDate: form.value.startDate,
  //       endDate: form.value.endDate,
  //       clientId: form.value.clientId,
  //       assignedToId: form.value.assignedToId,
  //       teamId: form.value.teamId,
  //       userIds: form.value.userIds,

  //       locationLinks: this.locationLinks, // Include locationLinks here

  //       contractTypeId: form.value.contractTypeId,
  //       costCenterId: form.value.costCenterId,
  //       description: form.value.description,
  //       autoRenewal: form.value.autoRenewal,
  //       contacts: []

  //     };

  //     this.cnotractService.createData(formData).subscribe(response => {
  //       console.log('Data submitted successfully', response);
  //       alert('Data submitted successfully')
  //     }, error => {
  //       console.error('Error occurred while submitting data', error);
  //     });
  //   }

  // }

  onSubmitLocation(form: any) {
    if (form.valid) {
      const formData = {
        locationName: form.value.locationName,
        locationAddress: form.value.locationAddress,
        latitude: form.value.latitude,
        longitude: form.value.longitude,


      };

      this.locarionService.createLocation(formData).subscribe(response => {
        console.log('Data submitted successfully', response);
        alert('Data submitted successfully')
      }, error => {
        console.error('Error occurred while submitting data', error);
      });
    }

  }





  addLocationLink() {
    this.locationLinks.push(''); // Add an empty string to allow user to input a new location link
  }

  removeLocationLink(index: number) {
    this.locationLinks.splice(index, 1); // Remove the specified location link
  }

  toggleMap() {
    this.isMapView = true
  }
  toggleMapClose() {
    this.isMapView = false;
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

  toggleTableonClick() {
    this.istableview = true;  // Set table view to true
    this.iscardsview = false; // Set cards view to false
  }

  toggleCardsonClick() {
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

  buttons = ['التفاصيل', 'المهام', 'الاستبيانات', 'التعليقات', 'مالية العقد', 'اقساط العقد']

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
