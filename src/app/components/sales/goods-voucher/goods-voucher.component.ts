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
import { error } from 'jquery';
import { popup } from 'leaflet';

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
    // code: ['', Validators.required],
    teamId: ['', Validators.required],
    purchaseOrderNumber: ['', Validators.required],
    costCenterId: ['', Validators.required],
    warehouseId: ['', Validators.required],
    locationLinkIds: this.fb.array([]),

    deliveryNoteItems:this.fb.array([]),
    
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

costCenterss:any[]=[]

getAllCostCenters() {
  this.costCenterService.getAllCostCaners().subscribe(response => {
    this.costCenterss = response.costCenters;
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

teamss:any[]=[];
getAllTeams() {
  this.teamService.getTeams().subscribe(response => {
    this.teamss = response.teams;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  teams:', error)
  })
}

 // Get the form array
 get locationLinkIds(): FormArray {
  return this.deliveryVoucherForm.get('locationLinkIds') as FormArray;
}
addLocationId() {
  const locationIdControl = this.fb.control(''); // Create a control for a new location ID
  this.locationLinkIds.push(locationIdControl); // Add the new control to the locationIds array
}
onSubmit() {
   
  if (this.deliveryVoucherForm.valid) {
    
    const formData = new FormData();
    formData.append('clientId', this.deliveryVoucherForm.get('clientId')?.value);
    formData.append('representativeId', this.deliveryVoucherForm.get('representativeId')?.value);
    // formData.append('code', this.deliveryVoucherForm.get('code')?.value);
    formData.append('teamId', this.deliveryVoucherForm.get('teamId')?.value);
    formData.append('purchaseOrderNumber', this.deliveryVoucherForm.get('purchaseOrderNumber')?.value);
    formData.append('costCenterId', this.deliveryVoucherForm.get('costCenterId')?.value);
    formData.append('warehouseId', this.deliveryVoucherForm.get('warehouseId')?.value);
    
   this.deliveryNoteItems.controls.forEach((item, index) => {
    const itemValue = item.value;
    formData.append(`Items[${index}].itemId`, itemValue.itemId);
    formData.append(`Items[${index}].requestedQuantity`, itemValue.requestedQuantity);
    formData.append(`Items[${index}].unitPrice`, itemValue.unitPrice);
    formData.append(`Items[${index}].salesTax`, itemValue.salesTax);
    formData.append(`Items[${index}].discount`, itemValue.discount);
    formData.append(`Items[${index}].unit`, itemValue.unit);
    formData.append(`Items[${index}].notes`, itemValue.notes);
});

  // Iterate over locationIds and append to FormData
  this.locationLinkIds.controls.forEach(locationId => {
    formData.append('locationLinkIds', locationId.value); // Append each location ID
  });
 const headers = new HttpHeaders({
   'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
 });

 this.http.post(this.apiUrl, formData, { headers })
   .subscribe(response => {
     console.log('Response:', response);
     // alert('submit successfully');
     this.toast.success('submit successfully')
     console.log(this.deliveryVoucherForm.value);
     this.getAllDeliveryVouchers();
   }, error => {
     console.error('Error:', error);
     const errorMessage = error.error?.message || 'An unexpected error occurred.';
     this.toast.error(errorMessage, 'Error');    });
  }
}

// Update Delivery note
storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;


onCheckboxChange(category: any, event: any) {
  if (event.target.checked) { // Check if the checkbox is checked
    this.selectedCategory = category; // Store the selected category data
    this.updateSelectAll();
    console.log(this.selectedCategory);
  } else {
    // Optionally, handle unchecking behavior here if needed
    this.selectedCategory = null; // Clear the selection if unchecked
    this.updateSelectAll();
    console.log('Checkbox unchecked, category deselected');
    // this.toast.error('Checkbox unchecked, category deselected');
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

// items table
// Method to remove an item from the FormArray
get deliveryNoteItems(): FormArray {
  return this.deliveryVoucherForm.get('deliveryNoteItems') as FormArray;
}
tableData = [
  {
    selectedItemId: null,
    quantity: '',
    unit: '',
    unitPrice: 0,
    tax: 0,
    discount: 0,
    note: '',
  },
];
removeItem(index: number) {
  this.deliveryNoteItems.removeAt(index);
}
addDeliveryNoteItem() {
  const item = this.fb.group({
    itemId: [0],
    requestedQuantity: [0],
    unitPrice: [0],
    salesTax: [0],
    discount: [0],
    unit: [''],
    notes: [''],
  });
  this.deliveryNoteItems.push(item);
}


// For Update
// Helper function to get client name by ID
locationName:any;
getClientNameById(clientId: number): string {
  const client = this.clients.find(c => c.id === clientId);
  return client ? client.name : 'Unknown Client';
}
getLocationNamesByIds(locationIds: string[] | undefined): string {
  if (!locationIds || !Array.isArray(locationIds)) {
    return ''; // Return empty string if locationIds is undefined or not an array
  }

  return locationIds
    .map(id => {
      const location = this.locations.find(loc => loc.id === id);
      return location ? location.locationName : 'Unknown';
    })
    .join(', '); // Join names with a comma for display
}
itemName: any;
getItemNameById(itemId: number): string { 
  const item = this.itemList.find(i => i.itemId === itemId);
  return item ? item.itemName : '';
}
openModalForSelected() {
  const clientName = this.getClientNameById(this.selectedCategory.clientId);
  const locationName = this.getLocationNamesByIds(this.selectedCategory.locationLinkIds);

  if (this.selectedCategory) {
    this.deliveryVoucherForm.patchValue({
      clientId: this.selectedCategory.clientId,
      clientName: clientName,
      representativeId: this.selectedCategory.representativeId,
      teamId: this.selectedCategory.teamId,
      // code: this.selectedCategory.code,
      purchaseOrderNumber: this.selectedCategory.purchaseOrderNumber,
      costCenterId: this.selectedCategory.costCenterId,
      warehouseId: this.selectedCategory.warehouseId,
      locationName:locationName,
    });
     // Clear existing deliveryNoteItems in form array
    // this.deliveryNoteItems.clear();

     // Populate the deliveryNoteItems array with selected item's data
     this.selectedCategory.deliveryNoteItems.forEach((item: any) => {
      const itemName = this.getItemNameById(item.itemId); 
       const deliveryNoteItem = this.fb.group({
         itemId: [item.itemId],
         itemName: itemName,
         requestedQuantity: [item.requestedQuantity],
         unitPrice: [item.unitPrice],
         salesTax: [item.salesTax],
         discount: [item.discount],
         unit: [item.unit],
         notes: [item.notes]
       });
       this.deliveryNoteItems.push(deliveryNoteItem);
     });
    this.isModalOpen = true;
  } else {
    alert('Please select a category to update.');
  }
}

// Method to add a new delivery note item
updateDeliveryNoteItem() {
  const newDeliveryNoteItem = this.fb.group({
    itemId: [null],               // Default value, can be selected later
    itemName: [''],               // To be filled based on selection
    requestedQuantity: [0],       // Default quantity
    unitPrice: [0],               // Default price
    salesTax: [0],                // Default sales tax
    discount: [0],                 // Default discount
    unit: [''],                   // Default unit
    notes: [''],                  // Default notes
  });
  
  this.deliveryNoteItems.push(newDeliveryNoteItem);
}

// Example of how to call addDeliveryNoteItem on a button click
onAddItemButtonClick() {
  this.addDeliveryNoteItem();
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
      (error) => {
        console.error('Error updating delivery note:', error);
        console.log('Updated delivery note Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');       }
    );
    }
    console.log(this.deliveryVoucherForm)
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
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');       }
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

// post items
  // Helper function to create an item form group
  createItem(): FormGroup {
    return this.fb.group({
      itemId: ['', Validators.required],
      requestedQuantity: [0, Validators.required],
      unitPrice: [0, Validators.required],
      salesTax: [0, Validators.required],
      discount: [0],
      unit: ['', Validators.required],
      notes: ['']
    });
  }


 
// Update status
deliveryStatuses = Object.values(DeliveryStatus);
NewStatus: any;
selectedNoteId!: number;
showPopup: boolean = false;

updatedItems: any[] = [{
  loadedQuantity: 0,
  warehouseId: 0,
  itemId: 0
}];


selectNoteId(note: any) {
  this.selectedNoteId = note.id;
  // Initialize updatedItems based on note.deliveryNoteItems, ensuring each entry is valid
  this.updatedItems = (note.deliveryNoteItems || []).map((item: any) => ({
    loadedQuantity: item?.loadedQuantity || 0,
    warehouseId: item?.warehouseId || 0,
    itemId: item?.itemId || 0
  }));
  console.log(note.id);
}

onStatusChange(note: any) {
  this.NewStatus = note.NewStatus; // Capture the new status from the dropdown

  if (note.status !== DeliveryStatus.Draft && this.NewStatus !== DeliveryStatus.Draft && 
      this.NewStatus !== this.deliveryStatus.InProgress && 
      note.id === this.selectedNoteId) {
    this.showPopup = true; // Show popup for entering UpdatedItems
    console.log(note.deliveryNoteItems);
  } else if (note.id === this.selectedNoteId) {
    // Call updateStatus with an empty array if status is Draft
    this.updateStatus(note, this.NewStatus, []);
  } else {
    console.error('No note selected');
  }
}

closePopup() {
  this.showPopup = false;
}

submitUpdatedItems() {
  const note = this.deliveryVouchers.find(n => n.id === this.selectedNoteId);
  if (note) {
    // Call updateStatus with the selected NewStatus and populated updatedItems
    this.updateStatus(note, this.NewStatus, this.updatedItems);
  }
  this.closePopup();
}

updateStatus(note: any, newStatus: any, updatedItems: any[]) {
  if (!note.id) {
    console.error('Note ID is required to update status.');
    return;
  }

  // Create FormData object
  const formData = new FormData();
  formData.append('NewStatus', newStatus); // Append the new status

  // Append each updated item only if it is defined and has necessary properties
  updatedItems.forEach((item, index) => {
    if (item && item.itemId !== undefined && item.loadedQuantity !== undefined && item.warehouseId !== undefined) {
      formData.append(`UpdatedItems[${index}].itemId`, item.itemId.toString());
      formData.append(`UpdatedItems[${index}].loadedQuantity`, item.loadedQuantity.toString());
      formData.append(`UpdatedItems[${index}].warehouseId`, item.warehouseId.toString());
    } else {
      console.warn(`Skipping item at index ${index} due to missing fields.`);
    }
  });

  this.salesService.updateDeliveryNoteStatus(note.id, formData).subscribe({
    next: (response) => {
      console.log('Delivery note status updated:', response);
      this.toast.success('Delivery note status updated');
      this.resetUpdatedItems();
      this.getAllDeliveryVouchers();

    },
    error: (error) => {
      const errorMessage = error.error?.message || 'An unexpected error occurred.';
      this.toast.error(errorMessage, 'Error');
      console.log(error);
      console.log(updatedItems);
      this.getAllDeliveryVouchers();

    }
  });
}


// add new inputs for new array
addUpdatedItem() {
  // Add a new item to the updatedItems array
  this.updatedItems.push({
    loadedQuantity: 0,
    warehouseId: 0,
    itemId: 0
  });
}

removeUpdatedItem(index: number) {
  // Remove the item at the specified index
  if (this.updatedItems.length > 1) {
    this.updatedItems.splice(index, 1);
  } else {
    console.log('At least one item must remain.');
  }
}
resetUpdatedItems() {
  // Reset the updatedItems array to the initial state
  this.updatedItems = [{
    loadedQuantity: 0,
    warehouseId: 0,
    itemId: 0
  }];
}

  // dropdown table columns
  columns = [
  
    { name: 'code', displayName: 'كود ', visible: true },
    { name: 'clientName', displayName: 'اسم العميل', visible: true },
    { name: 'representativeName', displayName: 'المندوب', visible: true },
    { name: 'teamName', displayName: 'الفريق', visible: false },
    { name: 'purchaseOrderNumber', displayName: 'رقم طلب الشراء', visible: false },
    { name: 'costCenterName', displayName: 'مركز التكلفة', visible: false }
  
  ];
  showDropdownCol= false;
  toggleDropdownCol() {
    this.showDropdownCol = !this.showDropdownCol; // Toggle the dropdown visibility
    console.log('Dropdown visibility:', this.showDropdownCol); // Check if it’s toggling
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
      this.deliveryVouchers.forEach(item => (item.checked = this.selectAll));
      // Update the selected count
      this.selectedCount = this.selectAll ? this.deliveryVouchers.length : 0;
    }
    
    updateSelectAll() {
      // Update selectAll if all items are checked
      this.selectAll = this.deliveryVouchers.every(item => item.checked);
      // Calculate the number of selected items
      this.selectedCount = this.deliveryVouchers.filter(item => item.checked).length;
    }
}
