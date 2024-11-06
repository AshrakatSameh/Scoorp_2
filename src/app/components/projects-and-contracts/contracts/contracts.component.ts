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
import { ToastrService } from 'ngx-toastr';


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

  storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;

  constructor(private cnotractService: ContractService, private fb: FormBuilder, private http: HttpClient,
    private clientService: ClientsService, private userService: UserService, private teamService: TeamsService
    , private locarionService: LocationService, private toast:ToastrService
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
      locationLinks: fb.array([]),

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
        // alert('submit successfully');
        this.toast.success('submit successfully');
      }, error => {
        console.error('Error:', error);
        this.toast.error('error:' , error)
      });
  }


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

  // Update contract
  isDropdownOpen2: boolean = false;

toggleDropdown() {
  this.isDropdownOpen2 = !this.isDropdownOpen2;
}

closeDropdown() {
  this.isDropdownOpen2 = false;
}

onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.contractForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      clientId: this.selectedCategory.clientId,
      assignedToId: this.selectedCategory.assignedToId,
      teamId: this.selectedCategory.teamId,
      userIds: this.selectedCategory.userIds,
      startDate: this.selectedCategory.startDate,
      endDate: this.selectedCategory.endDate,
      code: this.selectedCategory.code,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

updateCategory() {
  if (this.contractForm.valid) {
    const updatedCategory = { ...this.contractForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.cnotractService.updateItem(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Contract updated successfully:', response);
        this.toast.success('Contract updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getcontracts();
        this.closeModal();  // Close the modal after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating contract:', error);
        console.log('Updated contract Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the contract .')
      }
    );
    }
  }

deleteItemType(){
  const confirmed = window.confirm(
    'Are you sure you want to delete this record?'
  );
  if (confirmed){
    this.cnotractService.deleteItemById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('contract deleted successfully:', response);
        this.toast.success('contract deleted successfully');
        this.getcontracts();
        this.closeModal(); 
      },error => {
        console.error('Error delete contract category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the contract .');
        this.toast.error('An error occurred while deleting the contract .')
      }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
}


  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getcontracts();
  }


  // dropdown table columns
columns = [
  // { name: 'id', displayName: 'المسلسل', visible: true },
  { name: 'name', displayName: 'اسم القسم', visible: true },
  { name: 'localName', displayName: 'اسم القسم باللغه المحليه', visible: true },
  { name: 'code', displayName: 'كود المشروع', visible: true },
  { name: 'clientName', displayName: 'اسم العميل', visible: true },
  { name: 'startDate', displayName: 'تاريخ البدء', visible: false },
  { name: 'endDate', displayName: 'تاريخ الإنتهاء', visible: false },
  { name: 'teamName', displayName: 'الفريق', visible: false },
  { name: 'assignedToName', displayName: 'موقع العقد', visible: false },

];


showDropdownCols= false;
toggleDropdownCols() {
  this.showDropdownCols = !this.showDropdownCols; // Toggle the dropdown visibility
  console.log('Dropdown visibility:', this.showDropdownCols); // Check if it’s toggling
}

isColumnVisible(columnName: string): boolean {
  const column = this.columns.find(col => col.name === columnName);
  return column ? column.visible : false;
}

toggleColumnVisibility(columnName: string) {
  const column = this.columns.find(col => col.name === columnName);
  if (column) {
    column.visible = !column.visible;
  }
}

  // select checkbox

  selectAll = false;

  selectedCount = 0;
  
  toggleAllCheckboxes() {
    // Set each item's checked status to match selectAll
    this.contracts.forEach(item => (item.checked = this.selectAll));
    // Update the selected count
    this.selectedCount = this.selectAll ? this.contracts.length : 0;
  }
  
  updateSelectAll() {
    // Update selectAll if all items are checked
    this.selectAll = this.contracts.every(item => item.checked);
    // Calculate the number of selected items
    this.selectedCount = this.contracts.filter(item => item.checked).length;
  }
}
