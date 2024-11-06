import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { DeliveryStatus } from 'src/app/enums/DeliveryStatus ';
import { GoodsReceiptStatus } from 'src/app/enums/GoodsReceiptStatus';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { LocationService } from 'src/app/services/getAllServices/Location/location.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { SalesService } from 'src/app/services/getAllServices/Sales/sales.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-receive-voucher',
  templateUrl: './receive-voucher.component.html',
  styleUrls: ['./receive-voucher.component.css']
})
export class ReceiveVoucherComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  goods: any[] = [];
  goodsForm: FormGroup;

  receiptStatus = GoodsReceiptStatus;  // Access the PaymentType enum
  receiptStatusList: { key: string, value: string }[] = [];


  apiUrl= environment.apiUrl +'GoodsReceipt'
  buttons = ['الأصناف', 'الملاحظات', 'المهام', 'مرفقات']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }
  constructor(private salesService: SalesService, private fb: FormBuilder, private teamServ: TeamsService,
    private clientServ: ClientsService, private repServ: RepresentativeService,private costServ: CostCenterService,
    private wareSevice:WarehouseService, private locationService:LocationService, private toast:ToastrService,
    private http:HttpClient, private itemService:ItemsService
  ) {
    this.goodsForm = this.fb.group({
      clientId: ['', Validators.required],
      representativeId: ['', Validators.required],
      // code: ['', Validators.required],
      teamId: ['', Validators.required],
      costCenterId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      supplier: ['', Validators.required],
      locationLinkIds: this.fb.array([]),

      items: fb.array([]),

    });
    this.receiptStatusList = Object.keys(this.receiptStatus).map(key => ({
      key: key,
      value: this.receiptStatus[key as keyof typeof GoodsReceiptStatus]
    }));
  }
  ngOnInit(): void {

    this.getAllGoodsReceipt();
    this.getAllClients();
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getAllCostCenters();
    this.getAllWarehouses();
    this.getAllLocationss();
    this.getAllItems();


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

  getAllGoodsReceipt() {
    this.salesService.getGoodsReceipt(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        // this.goods = response.goodsReceipts;
        this.goods = (response.goodsReceipts || []).map((item: any) => ({ ...item, checked: false }));

        this.mapReceiptStatus();
        console.log(this.goods);
      },
      error: (err) => {
        console.error('Error fetching goods reciept data:', err);
      }
    });
  }

  clientList: any[] = [];
  getAllClients() {
    this.clientServ.getCliensts().subscribe({
      next: (response) => {
        this.clientList = response.data;
        // this.mapRequestStage();
        console.log(this.clientList);
      },
      error: (err) => {
        console.error('Error fetching goods reciept data:', err);
      }
    });
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
  representatives: any[] = []

  getAllRepresentatives() {
    this.repServ.getAllRepresentative().subscribe(response => {
      this.representatives = response;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  representatives:', error)
    })
  }

  teamss:any[]=[];
getAllTeams() {
  this.teamServ.getTeams().subscribe(response => {
    this.teamss = response.teams;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  teams:', error)
  })
}
costCenterss:any[]=[]

getAllCostCenters() {
  this.costServ.getAllCostCaners().subscribe(response => {
    this.costCenterss = response.costCenters;
    //console.log(this.costCenters);
  }, error => {
    console.error('Error fetching  costCenters:', error)
  })
}

warehouses:any[]=[]

getAllWarehouses() {
  this.wareSevice.getAllWarehouses().subscribe(response => {
    this.warehouses = response.data;
    //console.log(this.warehouses);
  }, error => {
    console.error('Error fetching  warehouses:', error)
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

onSubmit() {
  const formData = new FormData();
  formData.append('clientId', this.goodsForm.get('clientId')?.value);
  formData.append('representativeId', this.goodsForm.get('representativeId')?.value);
  // formData.append('code', this.goodsForm.get('code')?.value);
  formData.append('teamId', this.goodsForm.get('teamId')?.value);
  formData.append('costCenterId', this.goodsForm.get('costCenterId')?.value);
  formData.append('warehouseId', this.goodsForm.get('warehouseId')?.value);
  formData.append('supplier', this.goodsForm.get('supplier')?.value);
  formData.append('locationLinkIds', this.goodsForm.get('locationLinkIds')?.value);

  this.items.controls.forEach((item, index) => {
    const itemValue = item.value;
    formData.append(`Items[${index}].itemId`, itemValue.itemId);
    formData.append(`Items[${index}].receivedQuantity`, itemValue.receivedQuantity);
    formData.append(`Items[${index}].unitPrice`, itemValue.unitPrice);
    formData.append(`Items[${index}].salesTax`, itemValue.salesTax);
    formData.append(`Items[${index}].discount`, itemValue.discount);
    formData.append(`Items[${index}].unit`, itemValue.unit);
    formData.append(`Items[${index}].notes`, itemValue.notes);
});

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl, formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      // alert('submit successfully');
      this.toast.success('Submit successfully')
      this.getAllGoodsReceipt();
      this.goodsForm.reset();
    }, error => {
      console.error('Error:', error);
      const errorMessage = error.error?.message || 'An unexpected error occurred.';
      this.toast.error(errorMessage, 'Error'); 
    });
}

// Add items table
get items(): FormArray {
  return this.goodsForm.get('items') as FormArray;
}
tableData = [
  {
    selectedItemId: null,
    receivedQuantity: '',
    unit: '',
    unitPrice: 0,
    tax: 0,
    discount: 0,
    note: '',
  },
];
removeItem(index: number) {
  this.items.removeAt(index);
}
addGoodsReceiptItem() {
  const item = this.fb.group({
    itemId: [0],
    receivedQuantity: [0],
    unitPrice: [0],
    salesTax: [0],
    discount: [0],
    unit: [''],
    notes: [''],
  });
  this.items.push(item);
}


// Map the receipt status for each offer
mapReceiptStatus() {
  this.goods.forEach(offer => {
    offer.receiptStatusName = this.getReceiptStatusName(offer.status);
  });
}

// Get the name of the receipt status from the numeric stage number
getReceiptStatusName(stageNumber: number): string {
  // Define a mapping array for the numeric indices to the enum values
  const stageMapping = [
    GoodsReceiptStatus.Draft,        // 0
    GoodsReceiptStatus.InProgress,    // 1
    GoodsReceiptStatus.Completed,     // 2
    GoodsReceiptStatus.Canceled       // 3
  ];

  return stageMapping[stageNumber] ?? 'Unknown';
}


// Update status

receiptStatuses = Object.values(GoodsReceiptStatus);
NewStatus: any;
selectedNoteId!: number;
showPopup: boolean = false;

updatedItems: any[] = [{
  receivedQuantity: 0,
  warehouseId: 0,
  itemId: 0
}];

// constructor(private deliveryNoteService: DeliveryNoteService) {}
selectNoteId(note: any) {
  this.selectedNoteId = note.id;
  this.updatedItems = (note.items || []).map((item: any) => ({
    receivedQuantity: item?.receivedQuantity || 0,
    warehouseId: item?.warehouseId || 0,
    itemId: item?.itemId || 0
  }));
  console.log(note.id)
}
onStatusChange(note: any) {
  this.NewStatus = note.NewStatus; // Capture the new status from the dropdown

  if (note.status !== GoodsReceiptStatus.Draft && this.NewStatus !== GoodsReceiptStatus.Draft && 
    this.NewStatus !== GoodsReceiptStatus.InProgress  && note.id === this.selectedNoteId) {
    this.showPopup = true; // Show popup for entering UpdatedItems
  } else if (note.id === this.selectedNoteId) {
    // Call the updateStatus with the current note and selected NewStatus
    this.updateStatus(note, this.NewStatus, []); // Call API with an empty array for Draft
  } else {
    console.error('No note selected');
    
  }
}
closePopup() {
  this.showPopup = false;
}
submitUpdatedItems() {
  // const updatedItems = [this.updatedItems]; // Array of one item
  // const note = this.goods.find(n => n.id === this.selectedNoteId);
  // if (note) {
  //   // Call updateStatus with the selected NewStatus
  //   this.updateStatus(note, this.NewStatus, updatedItems);
  // }
  // this.closePopup();
  const note = this.goods.find(n => n.id === this.selectedNoteId);
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
  // formData.append('UpdatedItems', JSON.stringify(updatedItems)); // Append updated items as a JSON string
 // Append each updated item only if it is defined and has necessary properties
 updatedItems.forEach((item, index) => {
  if (item && item.itemId !== undefined && item.receivedQuantity !== undefined && item.warehouseId !== undefined) {
    formData.append(`UpdatedItems[${index}].itemId`, item.itemId.toString());
    formData.append(`UpdatedItems[${index}].receivedQuantity`, item.receivedQuantity.toString());
    formData.append(`UpdatedItems[${index}].warehouseId`, item.warehouseId.toString());
  } else {
    console.warn(`Skipping item at index ${index} due to missing fields.`);
  }
});
  this.salesService.updateGoodsReceiptStatus(note.id, formData).subscribe({
    next: (response) => {
      console.log('Goods receipt status updated:', response);
      this.toast.success('Goods receipt status updated');
      this.resetUpdatedItems();
      
    },
    error: (error) => {
      const errorMessage = error.error?.message || 'An unexpected error occurred.';
      this.toast.error(errorMessage, 'Error');
      console.log(updatedItems)
      
    }
  });
}


// add new inputs for new array
addUpdatedItem() {
  // Add a new item to the updatedItems array
  this.updatedItems.push({
    receivedQuantity: 0,
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
    receivedQuantity: 0,
    warehouseId: 0,
    itemId: 0
  }];
}

// For Update
// Update Delivery note
storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;
openModalForSelected() {
  if (this.selectedCategory) {
    this.goodsForm.patchValue({
      clientId: this.selectedCategory.clientId,
      representativeId: this.selectedCategory.representativeId,
      teamId: this.selectedCategory.teamId,
      // code: this.selectedCategory.code,
      // purchaseOrderNumber: this.selectedCategory.purchaseOrderNumber,
      costCenterId: this.selectedCategory.costCenterId,
      warehouseId: this.selectedCategory.warehouseId,
      supplier:this.selectedCategory.supplier,
      locationLinkIds: this.selectedCategory.locationLinkIds,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
  this.goodsForm.reset();
}

updateCategory() {
  if (this.goodsForm.valid) {
    const updatedCategory = { ...this.goodsForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.salesService.updateGoodsReceipt(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Goods receipt updated successfully:', response);
        this.toast.success('Goods receipt updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllGoodsReceipt();
        this.closeModal();  // Close the modal after successful update
        this.goodsForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating Goods receipt:', error);
        console.log('Updated Goods receipt Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An error occurred while updating the Goods receipt.';
        this.toast.error(errorMessage);        
      }
    );
    }
  }

deleteItemType(){
  const confirmed = window.confirm(
    'Are you sure you want to delete this record?'
  );
  if (confirmed){
    this.salesService.deleteGoodsReceiptById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Goods receipt deleted successfully:', response);
        this.toast.success('Goods receipt deleted successfully');
        this.getAllGoodsReceipt();
        this.closeModal(); 
      },(error: HttpErrorResponse) => {
        console.error('Error delete goods receipt category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the goods receipt .');
        const errorMessage = error.error?.message || 'An error occurred while deleting the goods receipt .';
        this.toast.error(errorMessage); 
      }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
}
onCheckboxChange(category: any, event: any) {
  if (event.target.checked) { // Check if the checkbox is checked
    this.updateSelectAll()
    this.selectedCategory = category; // Store the selected category data
    console.log(this.selectedCategory);
  } else {
    // Optionally, handle unchecking behavior here if needed
    this.selectedCategory = null; // Clear the selection if unchecked
    console.log('Checkbox unchecked, category deselected');
    this.updateSelectAll();
  }
}

changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllGoodsReceipt();
}



  // dropdown table columns
  columns = [
    // { name: 'id', displayName: 'المسلسل', visible: true },
    { name: 'supplier', displayName: 'المورد', visible: true },
    { name: 'code', displayName: 'كود ', visible: true },
    { name: 'clientName', displayName: 'اسم العميل', visible: true },
    { name: 'representativeName', displayName: 'المندوب', visible: false },
    { name: 'teamName', displayName: 'الفريق', visible: false },
    { name: 'warehouseName', displayName: 'المستودع', visible: false },
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
      this.goods.forEach(item => (item.checked = this.selectAll));
      // Update the selected count
      this.selectedCount = this.selectAll ? this.goods.length : 0;
    }
    
    updateSelectAll() {
      // Update selectAll if all items are checked
      this.selectAll = this.goods.every(item => item.checked);
      // Calculate the number of selected items
      this.selectedCount = this.goods.filter(item => item.checked).length;
    }
}
