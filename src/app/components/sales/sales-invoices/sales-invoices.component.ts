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
  const formData = new FormData();
  formData.append('clientId', this.salesForm.get('clientId')?.value);
  formData.append('code', this.salesForm.get('code')?.value);
  formData.append('representativeId', this.salesForm.get('representativeId')?.value);
  formData.append('teamId', this.salesForm.get('teamId')?.value);
  formData.append('invoiceNumber', this.salesForm.get('invoiceNumber')?.value);
  formData.append('priceListId', this.salesForm.get('priceListId')?.value);
  formData.append('paymentPeriodId', this.salesForm.get('paymentPeriodId')?.value);
  formData.append('invoiceType', this.salesForm.get('invoiceType')?.value);
  formData.append('costCenterId', this.salesForm.get('costCenterId')?.value);
  formData.append('driver', this.salesForm.get('driver')?.value);

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'SalesInvoice', formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      alert('submit successfully');
    }, error => {
      console.error('Error:', error);
    });
}

  apiUrl=environment.apiUrl;

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllSaleIncoices();
  }


  // onSubmit() {
  //   const formData = new FormData();
  //   formData.append('code', this.salesForm.get('code')?.value);
  //   formData.append('clientId', this.salesForm.get('clientId')?.value);
  //   formData.append('representativeId', this.salesForm.get('representativeId')?.value);
  //   formData.append('teamId', this.salesForm.get('teamId')?.value);
  //   formData.append('invoiceNumber', this.salesForm.get('invoiceNumber')?.value);
  //   formData.append('priceListId', this.salesForm.get('priceListId')?.value);
  //   formData.append('paymentPeriodId', this.salesForm.get('paymentPeriodId')?.value);
  //   formData.append('invoiceType', this.salesForm.get('invoiceType')?.value);
  //   formData.append('costCenterId', this.salesForm.get('costCenterId')?.value);
  //   formData.append('driver', this.salesForm.get('driver')?.value);

    
  //   const headers = new HttpHeaders({
  //     'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
  //   });
  
  //   this.http.post(this.apiUrl+'CovenantBox', formData, { headers })
  //     .subscribe(response => {
  //       console.log('Response:', response);
  //       alert('submit successfully');
  //     }, error => {
  //       console.error('Error:', error);
  //     });
  // }
}
