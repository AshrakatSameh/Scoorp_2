import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvoiceStatus } from 'src/app/enums/InvoiceStatus';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { PaymentPeriodsService } from 'src/app/services/getAllServices/PaymentPeriods/payment-periods.service';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { ProjactService } from 'src/app/services/getAllServices/Projects/projact.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { SalesService } from 'src/app/services/getAllServices/Sales/sales.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-return-invoices',
  templateUrl: './return-invoices.component.html',
  styleUrls: ['./return-invoices.component.css']
})
export class ReturnInvoicesComponent implements OnInit {

  clients:any[]=[];
  costCenters:any[]=[];
  priceLists:any[]=[];
  representatives:any[]=[];
  teams:any[]=[];
  projects:any[]=[];

  pageNumber =1;
  pageSize =10;

  invoiceStatus = InvoiceStatus;  // Access the PaymentType enum
  // Convert enum to an array for dropdown
  invoiceStatusList: { key: string, value: string }[] = [];

  invoiceFrom: FormGroup
  constructor(private clientServ:ClientsService,private teamServ:TeamsService,private repServ:RepresentativeService,
    private priceServ:PriceListService,private costService: CostCenterService,
    private projectServ:ProjactService, private salesService:SalesService,
    private http:HttpClient, private toast: ToastrService, private fb:FormBuilder,
    private payPeriodService: PaymentPeriodsService, private itemService: ItemsService
  ){

    this.invoiceFrom= this.fb.group({
      returnInvoiceNumber: ['', Validators.required],
      clientId: ['', Validators.required],
      representativeId: ['', Validators.required],
      teamId: ['', Validators.required],
      code:['',Validators.required],
      costCenterId: ['', Validators.required],
      clientReturnReference:['',Validators.required],
      projectId:['',Validators.required],
      priceListId:['',Validators.required],
      paymentPeriodId:['', Validators.required],
      // costCenterId:['', Validators.required],
      // paymentPeriodId:['', Validators.required],
      driver:['', Validators.required],

      items: fb.array([]),


      // purchaseOrderNumber: ['', Validators.required],
     
      // note:[],
      // AttachmentFiles:[],
      // saleOfferId:[],
      // deliveryNoteId:[],
      
      });

      this.invoiceStatusList = Object.keys(this.invoiceStatus).map(key => ({
        key: key,
        value: this.invoiceStatus[key as keyof typeof InvoiceStatus]
      }));
  }
  ngOnInit(): void {
    this.getAllClients();
    this.getAllPriceLists();
    this.getAllProjects();
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getcostCenters();
    // this.getAllReturnInvoices();
    this.loadInvoices();
    this.getPaymentPeriods();
    this.getAllItems();
  }
  // buttons=['الأصناف','الملاحظات','المهام' ,'مرفقات']
  buttons=['الأصناف','الملاحظات','المهام','مرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
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
  getcostCenters() {
    this.costService.getAllCostCaners().subscribe(response => {
      this.costCenters = response.costCenters;
      //console.log(this.costCenters);
    }, error => {
      console.error('Error fetching costs data:', error)
    })
  }
  payPeriods:any[]=[];
  getPaymentPeriods() {
    this.payPeriodService.getAllPaymentPeriods().subscribe(response => {
      this.payPeriods = response.paymentPeriods;
      //console.log(this.costCenters);
    }, error => {
      console.error('Error fetching payment data:', error)
    })
  }
  getAllPriceLists() {
    this.priceServ.getAllPriceLists().subscribe(response => {
      this.priceLists = response.data;
      //console.log(this.priceLists);
    }, error => {
      console.error('Error fetching price lists data:', error)
    })
  }
  getAllRepresentatives() {
    this.repServ.getAllRepresentative().subscribe(response => {
      this.representatives = response;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  representatives:', error)
    })
  }
  
  getAllTeams() {
    this.teamServ.getTeams().subscribe(response => {
      this.teams = response.teams;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  teams:', error)
    })
  }

  getAllClients() {
    this.clientServ.getCliensts().subscribe(response => {
      this.clients = response.data;
      //console.log(this.clients);
    }, error => {
      console.error('Error fetching  clients:', error)
    })
  }
  getAllProjects() {
    this.projectServ.getProjactsWithoutPag().subscribe(response => {
      this.projects = response.projects;
      //console.log(this.clients);
    }, error => {
      console.error('Error fetching  projects:', error)
    })
  }

  invoices:any[]=[];


clientss:any[]=[];
loadClients() {
  this.clientServ.getCliensts().subscribe({
    next: (data) => {
      this.clients = data.returnInvoices;
      // Load invoices only after clients are successfully fetched
      this.loadInvoices();
    },
    error: (err) => {
      console.error('Error fetching clients:', err);
      this.clients = []; // Ensure it's initialized as an empty array
    }
  });
}

loadInvoices() {
  this.salesService.getReturnInvoices(this.pageNumber, this.pageSize).subscribe({
    next: (data) => {
      this.invoices = data.returnInvoices;
      // Map client names only when both invoices and clients are loaded
      this.mapClientNames();
      this.mapInvoiceStatus();
    },
    error: (err) => {
      console.error('Error fetching invoices:', err);
      this.invoices = []; // Ensure it's initialized as an empty array
    }
  });
}

mapClientNames() {
  if (this.clients.length && this.invoices.length) {
    this.invoices.forEach(invoice => {
      const client = this.clients.find(c => c.id === invoice.clientId);
      invoice.clientName = client ? client.name : 'Unknown'; // Handle missing client cases
    });
  }
}

apiUrl= environment.apiUrl;
onSubmit() {
  const formData = new FormData();
  formData.append('clientId', this.invoiceFrom.get('clientId')?.value);
  formData.append('returnInvoiceNumber', this.invoiceFrom.get('returnInvoiceNumber')?.value);
  formData.append('representativeId', this.invoiceFrom.get('representativeId')?.value);
  formData.append('teamId', this.invoiceFrom.get('teamId')?.value);
  formData.append('code', this.invoiceFrom.get('code')?.value);
  formData.append('costCenterId', this.invoiceFrom.get('costCenterId')?.value);

  formData.append('clientReturnReference', this.invoiceFrom.get('clientReturnReference')?.value);
  formData.append('projectId', this.invoiceFrom.get('projectId')?.value);
  formData.append('priceListId', this.invoiceFrom.get('priceListId')?.value);
  // formData.append('costCenterId', this.invoiceFrom.get('costCenterId')?.value);
  formData.append('paymentPeriodId', this.invoiceFrom.get('paymentPeriodId')?.value);
  formData.append('driver', this.invoiceFrom.get('driver')?.value);

  this.items.controls.forEach((item, index) => {
    const itemValue = item.value;
    formData.append(`Items[${index}].itemId`, itemValue.itemId);
    formData.append(`Items[${index}].quantity`, itemValue.quantity);
    formData.append(`Items[${index}].unitPrice`, itemValue.unitPrice);
    formData.append(`Items[${index}].salesTax`, itemValue.salesTax);
    formData.append(`Items[${index}].discount`, itemValue.discount);
    formData.append(`Items[${index}].unit`, itemValue.unit);
    formData.append(`Items[${index}].notes`, itemValue.notes);
});
  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'ReturnInvoice', formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      // alert('submit successfully');
      this.toast.success(('submit successfully'))
    }, error => {
      console.error('Error:', error);
      const errorMessage = error.error?.message || 'An unexpected error occurred.';
      this.toast.error(errorMessage, 'Error');     });
}


// Add items table
get items(): FormArray {
  return this.invoiceFrom.get('items') as FormArray;
}
tableData = [
  {
    itemId: null,
    quantity: '',
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
addreturnInvoiceItem() {
  const item = this.fb.group({
    itemId: [0],
    quantity: [0],
    unitPrice: [0],
    salesTax: [0],
    discount: [0],
    unit: [''],
    notes: [''],
  });
  this.items.push(item);
}

changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.loadInvoices();
}


// Map the invoice status for each offer
mapInvoiceStatus() {
  this.invoices.forEach(offer => {
    offer.invoiceStatusName = this.getInvoiceStatusName(offer.invoiceStatus);
    console.log(offer.invoiceStatus)
  });
}

// Get the name of the receipt status from the numeric stage number
getInvoiceStatusName(stageNumber: number): string {
  // Define a mapping array for the numeric indices to the enum values
  const stageMapping = [
    InvoiceStatus.Draft,        // 0
    InvoiceStatus.Approved,    // 1
    InvoiceStatus.Staged,     // 2
    InvoiceStatus.Closed ,      // 3
    InvoiceStatus.Reviewed       // 4
  ];

  return stageMapping[stageNumber] ?? 'Unknown';
}

// Update status
requestId: number = 0; // Store selected request ID
requestStag: any // Store selected request stage
selectedNoteId!: number;

selectNoteId(note: any) {
  this.requestId = note.id;
  console.log(note.id)
}
// Map the InvoiceStatus enum values to numeric keys
 InvoiceStatusMap: { [key in InvoiceStatus]: number } = {
  [InvoiceStatus.Draft]: 0,
  [InvoiceStatus.Approved]: 1,
  [InvoiceStatus.Staged]: 2,
  [InvoiceStatus.Closed]: 3,
  [InvoiceStatus.Reviewed]: 4
};

onUpdateStatus(item: any): void {
  const invoiceId = item.id;
  const selectedStatus = item.invoiceStatus as InvoiceStatus;  // Cast to ensure type safety
  const statusNumber = this.InvoiceStatusMap[selectedStatus];  // Map to the corresponding number

  this.salesService.updateInvoiceStatus(invoiceId, statusNumber)
    .subscribe({
      next: (response) => {console.log('Status updated successfully', response);
        this.toast.success('Status updated successfully');
      },
      error: (error) => {
        console.error('Error updating status', error);
        console.log('Selected status (number):', statusNumber);
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error'); 
      }
    });
}

  // dropdown table columns
  onCheckboxChange(category: any) {
    this.updateSelectAll();
  }
  columns = [
    // { name: 'id', displayName: 'المسلسل', visible: true },
    { name: 'code', displayName: 'كود ', visible: true },
    { name: 'clientName', displayName: 'اسم العميل', visible: true },
    { name: 'representativeName', displayName: 'المندوب', visible: false },
    { name: 'teamName', displayName: 'الفريق', visible: false },
    { name: 'notes', displayName: 'ملاحظات', visible: false },
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
      this.invoices.forEach(item => (item.checked = this.selectAll));
      // Update the selected count
      this.selectedCount = this.selectAll ? this.invoices.length : 0;
    }
    
    updateSelectAll() {
      // Update selectAll if all items are checked
      this.selectAll = this.invoices.every(item => item.checked);
      // Calculate the number of selected items
      this.selectedCount = this.invoices.filter(item => item.checked).length;
    }



}
