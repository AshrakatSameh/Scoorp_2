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
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { DeliveryStatus } from 'src/app/enums/DeliveryStatus ';

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

  deliveryStatus = DeliveryStatus;  // Access the PaymentType enum
// Convert enum to an array for dropdown
deliveryStatusList: { key: string, value: string }[] = [];
  
  constructor(private salesService:SalesService,private clientService:ClientsService,
    private representServece:RepresentativeService, private fb: FormBuilder, private  http:HttpClient,
    private teamService: TeamsService, private costCenterService:CostCenterService,
    private warehouseService:WarehouseService,private locationService:LocationService,
    private itemService: ItemsService,
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
    locationLinkIds: this.fb.array([]),

    items:fb.array([]),
    
    });

    
    // this.locationForm = this.fb.group({
    //   locationName: ['', Validators.required],
    //   locationAddress: ['', Validators.required],
    //   latitude: ['', Validators.required],
    //   linelongitude3: ['', Validators.required]
    // }) 

    this.deliveryStatusList = Object.keys(this.deliveryStatus).map(key => ({
      key: key,
      value: this.deliveryStatus[key as keyof typeof DeliveryStatus]
    }));
  }

 
 
  ngOnInit(): void {
    this.getAllDeliveryVouchers();
    this.getAllClients();
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getAllCostCenters();
    this.getAllWarehouses();
    this.getAllLocationss();
    this.getAllItems();
    
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
    this.salesService.getDeliveryVoucher(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.deliveryVouchers = data;
        // Map client names only when both invoices and clients are loaded
        this.mapDeliveryStatus();
        // this.mapDeliveryStatus();
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
        // this.sales = []; // Ensure it's initialized as an empty array
      }
    });
    }
    //   this.deliveryVouchers = response;
    //   const x =this.deliveryVouchers.map(dVouche=> 
    //   {
    //     this.ClientById(dVouche.clientId);
    //   }
    //   );
    // }, error => {
    //   console.error('Error fetching delivery vouchers data:', error)
    // })


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

}

// Update Delivery note
storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;

// onCheckboxChange(category: any) {
//   this.selectedCategory = category;  // Store the selected category data
//   console.log(this.selectedCategory);
 
// }
onCheckboxChange(category: any, event: any) {
  if (event.target.checked) { // Check if the checkbox is checked
    this.selectedCategory = category; // Store the selected category data
    console.log(this.selectedCategory);
  } else {
    // Optionally, handle unchecking behavior here if needed
    this.selectedCategory = null; // Clear the selection if unchecked
    console.log('Checkbox unchecked, category deselected');
  }
}
item:any
ItemsById(id: number){
  this.itemService.getItemDetails(id).subscribe(
    (data) => {
      this.item = data;
      console.log('Fetched item:', this.item);
    },
    (error) => {
      console.error('Error fetching item:', error);
    }
  );
}
itemList:any[]=[];
getAllItems(){
  this.itemService.getAllItems().subscribe(response => {
    this.itemList = response.item1;
    console.log(this.itemList);
  }, error => {
    console.error('Error fetching  items:', error)
  })
}

// items tabke
// Method to remove an item from the FormArray
get items(): FormArray {
  return this.deliveryVoucherForm.get('items') as FormArray;
}
tableData = [
  {
    selectedItemId: null,
    code: '',
    unit: '',
    unitPrice: 0,
    tax: 0,
    discount: 0,
    total: 0,
  },
];
removeItem(index: number) {
  this.items.removeAt(index);
}
addItem() {
  const itemGroup = this.fb.group({
    itemId: [''],
    quantity: [0, Validators.required],
    unitPrice: [0, Validators.required],
    discount: [0],
    salesTax: [0],
    unit: [''],
    notes: [''],
  });

  this.items.push(itemGroup);
}

// items table methods
onItemSelect(event: any, rowIndex: number) {
  const selectedItemId = event.target.value;

  // Fetch details for the selected item
  this.itemService.getItemDetails(selectedItemId).subscribe((itemDetails: any) => {
    // Update the specific row with the item details
    this.tableData[rowIndex].code = itemDetails.code;
    this.tableData[rowIndex].unit = itemDetails.unit;
    this.tableData[rowIndex].unitPrice = itemDetails.unitPrice;
    this.tableData[rowIndex].tax = itemDetails.tax;
    this.tableData[rowIndex].discount = itemDetails.discount;
    this.tableData[rowIndex].total = this.calculateTotal(itemDetails);
  });
}

calculateTotal(itemDetails: any) {
  // Example calculation of total price (modify based on your logic)
  return itemDetails.unitPrice - itemDetails.discount + itemDetails.tax;
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
        console.log('Delivery note updated successfully:', response);
        this.toast.success('Delivery note updated successfully')
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
        console.error('Error updating delivery note:', error);
        console.log('Updated delivery note Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the delivery note .')
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


mapDeliveryStatus() {
  this.deliveryVouchers.forEach(offer => {
    // Assuming each offer has a `requestStage` property that is a number
    offer.delivetStatusName = this.getDeliveryStatusName(offer.deliveryStatus);
  });
}

// Get the name of the request stage from the number
getDeliveryStatusName(stageNumber: number): string {
  // Define a mapping array for the numeric indices to the enum values
  const stageMapping: string[] = [
    DeliveryStatus.Draft,        // 0
    DeliveryStatus.InProgress,   // 1
    DeliveryStatus.Completed,    // 2
    DeliveryStatus.Canceled ,     // 3
  ];

  return stageMapping[stageNumber] || 'Unknown';
}

// Change Status

showItemPopup = false; // Controls the visibility of the item popup
  selectedStatuses: (DeliveryStatus | null)[] = []; // Array to hold selected statuses for each row
  itemss: { value: string }[] = []; // Array to hold item values
  selectedItemId: number | null = null; // To hold the selected item ID
  // deliveryStatusList = Object.keys(DeliveryStatus).map(key => ({ key, value: DeliveryStatus[key] })); // Get enum keys and values for dropdown


  onStatusChange(index: number, status: string | null) {
    if (status) {
      this.selectedStatuses[index] = DeliveryStatus[status as keyof typeof DeliveryStatus]; // Map string to enum

      // Check if the selected status requires showing the popup
      if (this.selectedStatuses[index] === DeliveryStatus.InProgress || this.selectedStatuses[index] === DeliveryStatus.Canceled) {
        this.showItemPopup = true;
        this.itemss = []; // Reset items for new entry
      }
    }else{
      console.log(this.selectedStatuses[index])
    }
  }

  openPopup(id: number) {
    this.selectedItemId = id; // Set the selected item ID
    this.showItemPopup = true; // Show the popup
    this.itemss = []; // Reset items for new entry
  }

  addItem2() {
    this.items.push({ value: '' }); // Add a new item input
  }

submitStatusChange() {
  if (this.selectedItemId === null || this.selectedItemId === undefined) {
    console.error('No item selected');
    return;
  }

  // Check if selectedStatuses is defined and contains the selectedItemId
  const selectedStatus = this.selectedStatuses?.[this.selectedItemId];

  // Ensure selectedStatus is not null or undefined before converting to string
  const newStatusString = selectedStatus ? selectedStatus.toString() : '';

  const payload = {
    newStatus: newStatusString, // Now always a string
    items: this.itemss.map(item => item.value) // Extract item values
  };

  this.salesService.updateStatus(this.selectedItemId, payload).subscribe({
    next: (response) => {
      console.log('Status changed successfully:', response);
      // Handle successful response
    },
    error: (err) => {
      console.error('Error changing status:', err);
    }
  });

  this.closePopup(); // Close the popup after submitting
}


  closePopup() {
    this.showItemPopup = false; // Hide the popup
    this.selectedItemId = null; // Reset the selected item ID
    this.itemss = []; // Reset items array
  }
}
