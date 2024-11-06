import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { ContactsService } from 'src/app/services/getAllServices/Contacts/contacts.service';
import { ContractService } from 'src/app/services/getAllServices/Contracts/contract.service';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { NationalityService } from 'src/app/services/getAllServices/Nationality/nationality.service';
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

  isModalOpen = false;
  selectedCategory: any = null;

  apiUrl= environment.apiUrl +'Contact';

  constructor(private contactService:ContactsService, private locationService:LocationService,
    private clientService:ClientsService, private fb:FormBuilder, private http:HttpClient,
    private toast: ToastrService, private nationality: NationalityService
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
    this.getNationalities()
  }

  isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
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
nationalities:any[]=[];
  getNationalities() {
    this.nationality.getAllNationalities()
      .subscribe(data => {
        this.nationalities = data;
        // console.log(this.nationalities);
      }, error => {
        console.error('Error fetching nationalities data:', error);
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
        // alert('submit successfully');
        this.toast.success('Submit successfully')
      }, error => {
        console.error('Error:', error);
      });
  }

  // Update
onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.contactForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      phoneNumber1: this.selectedCategory.phoneNumber1,
      phoneNumber2: this.selectedCategory.phoneNumber2,
      jobTitle: this.selectedCategory.jobTitle,
      email: this.selectedCategory.email,
      locationLinks: this.selectedCategory.locationLinks,
      nationality: this.selectedCategory.nationality,
      clientId: this.selectedCategory.clientId,
      supplier: this.selectedCategory.supplier,
      description: this.selectedCategory.description,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a row to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

storesSec:any[] =[];

updateCategory() {
  if (this.contactForm.valid) {
    const updatedCategory = { ...this.contactForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.contactService.updateItem(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Item type updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllContacts();
        this.closeModal();  // Close the modal after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating category:', error);
        console.log('Updated Category Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the item type .')
      }
    );
    }
    else{
      console.log(this.contactForm)
    }
  }

deleteItemType(){
  const confirmed = window.confirm(
    'Are you sure you want to delete this record?'
  );
  if (confirmed){
    this.contactService.deleteById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Row deleted successfully:', response);
        this.toast.success('Row deleted successfully');
        this.getAllContacts();
        this.closeModal(); 
      },error => {
        console.error('Error delete row:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while deleting the row .',error.error.text)
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
    this.getAllContacts();
  }
}
