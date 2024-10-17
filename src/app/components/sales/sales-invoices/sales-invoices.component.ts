import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/getAllServices/Sales/sales.service';
import { SalesComponent } from '../sales.component';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPeriodsService } from 'src/app/services/getAllServices/PaymentPeriods/payment-periods.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { InvoiceStatus } from 'src/app/enums/InvoiceStatus';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { InvoiceType } from 'src/app/enums/InvoiceType';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.css']
})
export class SalesInvoicesComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 10;
  salesForm:FormGroup;

  priceLists:any[]=[];
  salesIvoices:any[]=[];
  representatives:any[]=[]
  clients:any[]=[];
  payPeriods:any[]=[];
  teams:any[]=[];
  items:any[]=[];
  costCenters:any[]=[];


  invoiceStatus = InvoiceStatus;  // Access the PaymentType enum
  // Convert enum to an array for dropdown
  invoiceStatusList: { key: string, value: string }[] = [];

  invoiceType= InvoiceType;  // Access the PaymentType enum
  // Convert enum to an array for dropdown
  invoiceTypeList: { key: string, value: string }[] = [];


  constructor(private salesInvoiceService: SalesService, private clientService:ClientsService,
    private representService: RepresentativeService, private fb:FormBuilder, private payService:PaymentPeriodsService,
    private teamService:TeamsService, private itemServices:ItemsService,
    private costService:CostCenterService,private priceService:PriceListService,
    private http:HttpClient
  ){
    this.salesForm= this.fb.group({
      code: ['', Validators.required],
      clientId: ['', Validators.required],
      representativeId: ['', Validators.required],
      teamId: ['', Validators.required],
      invoiceNumber:['',Validators.required],
      priceListId:['',Validators.required],
      paymentPeriodId:['',Validators.required],
      invoiceType:['',Validators.required],
      costCenterId: ['', Validators.required],
      driver:['', Validators.required],

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
      this.invoiceTypeList = Object.keys(this.invoiceType).map(key => ({
        key: key,
        value: this.invoiceType[key as keyof typeof InvoiceType]
      }));

  }
  ngOnInit(): void {
  this.getAllSaleIncoices();
  this.getAllClients();
  this.getAllTeams();
  this.getAllRepresentatives();
  this.getAllCostcenters();
  this.getAllPayPeriods();
  this.getAllPriceLists();

  }

  buttons=['الأصناف','الملاحظات','المهام' ,'مرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  getAllSaleIncoices() {
    this.salesInvoiceService.getSalesInvoices(this.pageNumber, this.pageSize).subscribe(response => {
      this.salesIvoices = response.salesInvoices;
      console.log(this.salesIvoices);
    }, error => {
      console.error('Error fetching sales data:', error)
    })
  }


getAllRepresentatives() {
  this.representService.getAllRepresentative().subscribe(response => {
    this.representatives = response;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  representatives:', error)
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

getAllPayPeriods() {
  this.payService.getAllPaymentPeriods().subscribe(response => {
    this.payPeriods = response.paymentPeriods;
    //console.log(this.clients);
  }, error => {
    console.error('Error fetching  payments:', error)
  })
}

getAllTeams() {
  this.teamService.getTeams().subscribe(response => {
    this.teams = response.teams;
    //console.log(this.clients);
  }, error => {
    console.error('Error fetching  teams:', error)
  })
}


getAllItems() {
  this.itemServices.getAllItems().subscribe(response => {
    this.items = response;
    //console.log(this.clients);
  }, error => {
    console.error('Error fetching  items:', error)
  })
}

getAllCostcenters() {
  this.costService.getAllCostCaners().subscribe(response => {
    this.costCenters = response.costCenters;
    //console.log(this.clients);
  }, error => {
    console.error('Error fetching  costCenters:', error)
  })
}


getAllPriceLists() {
  this.priceService.getAllPriceLists().subscribe(response => {
    this.priceLists = response.data;
    //console.log(this.clients);
  }, error => {
    console.error('Error fetching  priceLists:', error)
  })
}

onSubmit() {

  if (this.salesForm.valid) {
    this.salesInvoiceService.postSalesInvoice(this.salesForm.value).subscribe(
      response => {
        console.log('Form successfully submitted', response);
      },
      error => {
        console.error('Error submitting form', error);
      }
    );
  } else {
    console.log('Form is invalid');
  }}
  onSubmitAdd() {
    const formData = new FormData();
    const code = this.salesForm.get('code')!.value;
    const clientId = this.salesForm.get('clientId')!.value;
    const representativeId = this.salesForm.get('representativeId')!.value;
    const teamId = this.salesForm.get('teamId')!.value;
    const invoiceNumber = this.salesForm.get('invoiceNumber')!.value;
    const priceListId = this.salesForm.get('priceListId')!.value;
    const paymentPeriodId = this.salesForm.get('paymentPeriodId')!.value;
    const invoiceType = this.salesForm.get('invoiceType')!.value;
    const costCenterId = this.salesForm.get('costCenterId')!.value;
    const driver = this.salesForm.get('driver')!.value;
    if (code) {
      formData.append('code', code);
      formData.append('clientId', clientId);
      formData.append('representativeId', representativeId);
      formData.append('teamId', teamId);
      formData.append('invoiceNumber', invoiceNumber);
      formData.append('priceListId', priceListId);
      formData.append('paymentPeriodId', paymentPeriodId);
      formData.append('invoiceType', invoiceType);
      formData.append('costCenterId', costCenterId);
      formData.append('driver', driver);
      
    } else {
      console.error('One or more form fields are null');
      return;
    }

    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}SalesInvoice`;
    this.http.post<any>(url, formData,{headers}).subscribe(
      (response) => {
        alert('Done');
        console.log('Employee created successfully:', response);
        // Reset form after successful submission
        this.salesForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating Employee:', error.error);
        // Handle error
      }
    );
  }

  apiUrl=environment.apiUrl;

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllSaleIncoices();
  }
}
