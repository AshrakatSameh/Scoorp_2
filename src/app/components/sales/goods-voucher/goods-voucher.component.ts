import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { SalesService } from 'src/app/services/getAllServices/Sales/sales.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { environment } from 'src/environments/environment.development';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goods-voucher',
  templateUrl: './goods-voucher.component.html',
  styleUrls: ['./goods-voucher.component.css']
})
export class GoodsVoucherComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 10; 
  deliveryVouchers:any[]=[]

  
  apiUrl= environment.apiUrl +'DeliveryNotes/Create';
  clientData:any;
  deliveryVoucherForm!:FormGroup;
  // locationForm!:FormGroup;
  
  constructor(private salesService:SalesService,private clientService:ClientsService,
    private representServece:RepresentativeService, private fb: FormBuilder, private  http:HttpClient,
    private teamService: TeamsService, private costCenterService:CostCenterService,
    private warehouseService:WarehouseService,private locationService:LocationService,
    private toast: ToastrService
  ){
    this.deliveryVoucherForm= this.fb.group({
    clientId: ['', Validators.required],
    representativeId: ['', Validators.required],
    code: ['', Validators.required],
    teamId: ['', Validators.required],
    purchaseOrderNumber: ['', Validators.required],
    costCenterId: ['', Validators.required],
    warehouseId: ['', Validators.required],
    locationLinkIds: this.fb.array([])

    
    });

    
    // this.locationForm = this.fb.group({
    //   locationName: ['', Validators.required],
    //   locationAddress: ['', Validators.required],
    //   latitude: ['', Validators.required],
    //   linelongitude3: ['', Validators.required]
    // }) 
  }

 
 
  ngOnInit(): void {
    this.getAllDeliveryVouchers();
    this.getAllClients();
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getAllCostCenters();
    this.getAllWarehouses();
    this.getAllLocationss();

    
  }
  // buttons=['الأصناف','الملاحظات','المهام' ,'مرفقات']

  buttons = ['الأصناف', 'الملاحظات', 'المهام', 'مرفقات']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  isCodeVisible = false;  
  toggleCode(): void {
    this.isCodeVisible = !this.isCodeVisible;  // Toggle the visibility
  }

  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown() {
    this.isDropdownOpen = false;
  }



  clientN: any[] = [];  //arrNames:any ;
  clientName:any;
  getAllDeliveryVouchers() {
    this.salesService.getDeliveryVoucher(this.pageNumber, this.pageSize).subscribe(response => {
      this.deliveryVouchers = response;
      const x =this.deliveryVouchers.map(dVouche=> 
      {
        this.ClientById(dVouche.clientId);
      }
      );
    }, error => {
      console.error('Error fetching delivery vouchers data:', error)
    })
  }


  cliName:any;
  ClientById(id: number){
    this.clientService.getClietById(id).subscribe(
      (data) => {
        this.clientData = data;
        this.cliName = this.clientData.name;
      return this.cliName;
      
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
}






clients:any[]=[]

getAllClients() {
  this.clientService.getCliensts().subscribe(response => {
    this.clients = response.data;
    //console.log(this.clients);
  }, error => {
    console.error('Error fetching  clients:', error)
  })
}


locations:any[]=[]

getAllLocationss() {
  this.locationService.getLocations().subscribe(response => {
    this.locations = response.data;
    //console.log(this.locations);
  }, error => {
    console.error('Error fetching  locations:', error)
  })
}

warehouses:any[]=[]

getAllWarehouses() {
  this.warehouseService.getAllWarehouses().subscribe(response => {
    this.warehouses = response.data;
    //console.log(this.warehouses);
  }, error => {
    console.error('Error fetching  warehouses:', error)
  })
}

costCenters:any[]=[]

getAllCostCenters() {
  this.costCenterService.getAllCostCaners().subscribe(response => {
    this.costCenters = response.costCenters;
    //console.log(this.costCenters);
  }, error => {
    console.error('Error fetching  costCenters:', error)
  })
}

representatives:any[]=[]

getAllRepresentatives() {
  this.representServece.getAllRepresentative().subscribe(response => {
    this.representatives = response;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  representatives:', error)
  })
}

teams:any[]=[];
getAllTeams() {
  this.teamService.getTeams().subscribe(response => {
    this.teams = response.teams;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  teams:', error)
  })
}

 // Get the form array
 get locationLinkIds(): FormArray {
  return this.deliveryVoucherForm.get('locationLinkIds') as FormArray;
}
// Method to add new locationLink input
// addLocationLink(): void {
//   const locationForm = this.fb.group({
//       locationName: ['', Validators.required],
//       locationAddress: ['', Validators.required],
//       latitude: ['', Validators.required],
//       linelongitude3: ['', Validators.required]
//   });
//   this.locationLinkIds.push(locationForm);
//   this.locationLinkIds.push(this.locationLinkIds);
// }
onSubmit() {

  if (this.deliveryVoucherForm.valid) {
    this.salesService.postDeliveryNote(this.deliveryVoucherForm.value).subscribe(
      response => {
        console.log('Form successfully submitted', response);
        // alert('Form successfully submitted')
        this.toast.success('Form successfully submitted')
      },
      error => {
        console.error('Error submitting form', error);
        this.toast.error('Error in submit form')
      }
    );
  } else {
    console.log('Form is invalid');
  }
  // const formData = new FormData();
  // const clientId = this.deliveryVoucherForm.get('clientId')!.value;
  // const representativeId = this.deliveryVoucherForm.get('representativeId')!.value;
  // const code = this.deliveryVoucherForm.get('code')!.value;
  // const teamId = this.deliveryVoucherForm.get('teamId')!.value;
  // const purchaseOrderNumber = this.deliveryVoucherForm.get('purchaseOrderNumber')!.value;
  // const costCenterId = this.deliveryVoucherForm.get('costCenterId')!.value;
  // const warehouseId = this.deliveryVoucherForm.get('warehouseId')!.value;
  // // const locationLinkIds = this.deliveryVoucherForm.get('locationLinkIds')!.value;
  // if (code) {
  //   formData.append('clientId', clientId);
  //   formData.append('representativeId', representativeId);
  //   formData.append('code', code);
  //   formData.append('teamId', teamId);
  //   formData.append('purchaseOrderNumber', purchaseOrderNumber);
  //   formData.append('costCenterId', costCenterId);
  //   formData.append('warehouseId', warehouseId);
  //   // formData.append('locationLinkIds', locationLinkIds);
    
  //   const locationLinks = this.deliveryVoucherForm.get('locationLinkIds')?.value;
  // if (locationLinks && locationLinks.length > 0) {
  //     locationLinks.forEach((linkId:string) => {
  //         formData.append('locationLinkIds', linkId); // Append each location ID
  //     });}
    
  // } else {
  //   console.error('One or more form fields are null');
  //   return;
  // }

  // const tenantId = localStorage.getItem('tenant');
  // const headers = new HttpHeaders({
  //   tenant: tenantId || '', // Set tenantId header if available
  //   'Content-Type': 'application/json',
  // });
  // //const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&JobTitle=${encodeURIComponent(jobTitle)}&DepartmentManagerId=${encodeURIComponent(departmentManagerId)}&DepartmentSupervisorId=${encodeURIComponent(departmentSupervisorId)}&StartDate=${encodeURIComponent(startDate)}&EndDate=${encodeURIComponent(endDate)}`;
  // this.http.post<any>(this.apiUrl, formData,{headers}).subscribe(
  //   (response) => {
  //     alert('Done');
  //     console.log('Delivery voucher created successfully:', response);
  //     // Reset form after successful submission
  //     this.deliveryVoucherForm.reset();
  //   },
  //   (error: HttpErrorResponse) => {
  //     console.error('Error creating delivery voucher:', error.error);
  //     // Handle error
  //   }
  // );
}

// Update Delivery note
storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;
onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.deliveryVoucherForm.patchValue({
      clientId: this.selectedCategory.clientId,
      representativeId: this.selectedCategory.representativeId,
      teamId: this.selectedCategory.teamId,
      code: this.selectedCategory.code,
      purchaseOrderNumber: this.selectedCategory.purchaseOrderNumber,
      costCenterId: this.selectedCategory.costCenterId,
      warehouseId: this.selectedCategory.warehouseId,
      locationLinkIds: this.selectedCategory.locationLinkIds,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
  this.deliveryVoucherForm.reset();
}

updateCategory() {
  if (this.deliveryVoucherForm.valid) {
    const updatedCategory = { ...this.deliveryVoucherForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.salesService.update(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Item type updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllDeliveryVouchers();
        this.closeModal();  // Close the modal after successful update
        this.deliveryVoucherForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating category:', error);
        console.log('Updated Category Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the item type .')
      }
    );
    }
  }

deleteItemType(){
  const confirmed = window.confirm(
    'Are you sure you want to delete this record?'
  );
  if (confirmed){
    this.salesService.deleteById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item type deleted successfully:', response);
        this.toast.success('Item type deleted successfully');
        this.getAllDeliveryVouchers();
        this.closeModal(); 
      },error => {
        console.error('Error delete item type category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while deleting the item type .')
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
  this.getAllDeliveryVouchers();
}


}
