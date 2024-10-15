import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from 'src/app/enums/PaymentType';
import { RequestStage } from 'src/app/enums/RequestStage';

import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { SalesService } from 'src/app/services/getAllServices/Sales/sales.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { WarehouseCatService } from 'src/app/services/getAllServices/WarehouseCategories/warehouse-cat.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  saleOfferForm:FormGroup;

  paymentType = PaymentType;  // Access the PaymentType enum
// Convert enum to an array for dropdown
paymentTypeList: { key: string, value: string }[] = [];


requestStage = RequestStage;  // Access the PaymentType enum
// Convert enum to an array for dropdown
requestStageList: { key: string, value: string }[] = [];



  constructor(private salesService:SalesService,private clientService:ClientsService,
    private teamService:TeamsService,private representative:RepresentativeService,
     private wareService:WarehouseService, private fb:FormBuilder,
     private pricelistService:PriceListService, private costService:CostCenterService
  ){

    this.saleOfferForm= this.fb.group({
      clientId: ['', Validators.required],
      representativeId: ['', Validators.required],
      code: ['', Validators.required],
      teamId: ['', Validators.required],
      purchaseOrderNumber: ['', Validators.required],
      costCenterId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      priceListId:['',Validators.required],
      offerExpiryDate:['',Validators.required],
      paymentPeriod:['',Validators.required],
      paymentType:['',Validators.required],
      requestStage:['',Validators.required],

      // clientPurchaseOrder:['',Validators.required],
      // priceOfferTemplate:['',Validators.required],
      // offerValidityDays:['',Validators.required],
      // locationLinkIds: this.fb.array([])
  
      
      });

      

    this.paymentTypeList = Object.keys(this.paymentType).map(key => ({
      key: key,
      value: this.paymentType[key as keyof typeof PaymentType]
    }));

    this.requestStageList = Object.keys(this.requestStage).map(key => ({
      key: key,
      value: this.requestStage[key as keyof typeof RequestStage]
    }));
  }

  ngOnInit(): void {
    this. getAllSaleOffers();
    this.getAllPriceLists() ;
    this.getAllWarehouses();
    this.getAllTeams();
    this.getAllRepresentatives();
    this.getcostCenters();
    this.getAllClients();
    }
  // buttons=['المعلومات الأساسية','المواقع و الفروع','المرفقات','المهام' ,'الحساب البنكي','الأشعارات والتذكير','التقارير','معلومات التواصل','بيانات الضريبه','الاستبيانات']
  buttons=['الأصناف','الملاحظات','المهام' ,'مرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }











  // Handle file selection via input click
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  // Handle file dropped via drag-and-drop
  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;  // Cast to HTMLElement
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    // Remove the hover effect class on drag leave
    event.preventDefault();
    const target = event.target as HTMLElement;  // Cast EventTarget to HTMLElement
    target.classList.add('drag-over');  }

  // Handle file logic (validate and upload)
  handleFile(file: File): void {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size exceeds 10MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, or PDF files are allowed');
      return;
    }

    // Perform file upload or further processing here
    console.log('File selected:', file);
    // You could upload the file to the server here using an API service
  }

  salesOffers:any[]=[];
  getAllSaleOffers() {
    this.salesService.getSalesOffers().subscribe(response => {
      this.salesOffers = response;
      //console.log(this.salesOffers);
    }, error => {
      console.error('Error fetching sales data:', error)
    })
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

warehouses:any[]=[]
getAllWarehouses() {
  this.wareService.getAllWarehouses().subscribe(response => {
    this.warehouses = response.data;
    //console.log(this.warehouses);
  }, error => {
    console.error('Error fetching  warehouses:', error)
  })
}

representatives:any[]=[]
getAllRepresentatives() {
  this.representative.getAllRepresentative().subscribe(response => {
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


priceLists:any[]=[];
  getAllPriceLists() {
    this.pricelistService.getAllPriceLists().subscribe(response => {
      this.priceLists = response.data;
      console.log(this.priceLists);
    }, error => {
      console.error('Error fetching price lists data:', error)
    })
  }


  costCenters:any[]=[];
  getcostCenters() {
    this.costService.getAllCostCaners().subscribe(response => {
      this.costCenters = response.data;
      console.log(this.costCenters);
    }, error => {
      console.error('Error fetching costs data:', error)
    })
  }


}
