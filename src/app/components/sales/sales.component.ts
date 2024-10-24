import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentType } from 'src/app/enums/PaymentType';
import { RequestStage } from 'src/app/enums/RequestStage';

import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { SalesService } from 'src/app/services/getAllServices/Sales/sales.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { WarehouseCatService } from 'src/app/services/getAllServices/WarehouseCategories/warehouse-cat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 10;
  
  costCenters:any[]=[];
  salesOffers:any[]=[];
  clients:any[]=[];
  warehouses:any[]=[];
  representatives:any[]=[]
  teams:any[]=[];
  priceLists:any[]=[];
  saleOfferForm:FormGroup;
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

  paymentType = PaymentType;  // Access the PaymentType enum
// Convert enum to an array for dropdown
paymentTypeList: { key: string, value: string }[] = [];


requestStage = RequestStage;  // Access the PaymentType enum
// Convert enum to an array for dropdown
requestStageList: { key: string, value: string }[] = [];



apiUrl=environment.apiUrl;
  constructor(private salesService:SalesService,private clientService:ClientsService,
    private teamService:TeamsService,private representative:RepresentativeService,
     private wareService:WarehouseService, private fb:FormBuilder,
     private pricelistService:PriceListService, private costService:CostCenterService,
     private http:HttpClient, private toast:ToastrService, private itemService:ItemsService
  ){

    this.saleOfferForm= this.fb.group({
      clientId: ['', Validators.required],
      representativeId: ['', Validators.required],
      code: ['', Validators.required],
      teamId: ['', Validators.required],
      clientPurchaseOrder: ['', Validators.required],
      costCenterId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      // priceListId:['',Validators.required],
      offerExpiryDate:['',Validators.required],
      paymentPeriod:['',Validators.required],
      paymentType:['',Validators.required],
      items: this.fb.array([]), // FormArray for the items

      // requestStage:['',Validators.required],

      // clientPurchaseOrder:['',Validators.required],
      // priceOfferTemplate:['',Validators.required],
      // offerValidityDays:['',Validators.required],
      // locationLinkIds: this.fb.array([])
  
      
      });

      this.addItem(); 
      

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
    this.getAllItems();
    }
    get items(): FormArray {
      return this.saleOfferForm.get('items') as FormArray;
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

  getAllSaleOffers(){
    this.salesService.getSalesOffers(this.pageNumber, this.pageSize).subscribe(response=>{
        this.salesOffers= response.saleOffers;
        console.log(this.salesOffers);
      }, error =>{
        console.error('Error fetching salesOffers data:' , error)
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
itemss:any[]=[];
getAllItems(){
  this.itemService.getAllItems().subscribe(response=>{
    this.itemss = response.item1;
    console.log(this.itemss)
  },error=>{
    console.error('Error fetching items: ' , error)
  }
)
}
getAllWarehouses() {
  this.wareService.getAllWarehouses().subscribe(response => {
    this.warehouses = response.data;
    //console.log(this.warehouses);
  }, error => {
    console.error('Error fetching  warehouses:', error)
  })
}

getAllRepresentatives() {
  this.representative.getAllRepresentative().subscribe(response => {
    this.representatives = response;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  representatives:', error)
  })
}

getAllTeams() {
  this.teamService.getTeams().subscribe(response => {
    this.teams = response.teams;
    //console.log(this.representatives);
  }, error => {
    console.error('Error fetching  teams:', error)
  })
}


  getAllPriceLists() {
    this.pricelistService.getAllPriceLists().subscribe(response => {
      this.priceLists = response.data;
      //console.log(this.priceLists);
    }, error => {
      console.error('Error fetching price lists data:', error)
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

   // Method to remove an item from the FormArray
   removeItem(index: number) {
    this.items.removeAt(index);
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('clientId', this.saleOfferForm.get('clientId')?.value);
    formData.append('representativeId', this.saleOfferForm.get('representativeId')?.value);
    formData.append('code', this.saleOfferForm.get('code')?.value);
    formData.append('teamId', this.saleOfferForm.get('teamId')?.value);
    formData.append('clientPurchaseOrder', this.saleOfferForm.get('clientPurchaseOrder')?.value);
    formData.append('costCenterId', this.saleOfferForm.get('costCenterId')?.value);
    formData.append('warehouseId', this.saleOfferForm.get('warehouseId')?.value);
    formData.append('offerExpiryDate', this.saleOfferForm.get('offerExpiryDate')?.value);
    formData.append('paymentPeriod', this.saleOfferForm.get('paymentPeriod')?.value);
    formData.append('paymentType', this.saleOfferForm.get('paymentType')?.value);


      // Access the items FormArray
  // const itemsArray = this.saleOfferForm.get('items') as FormArray;

  // // Loop through the items FormArray to append each item to FormData
  // itemsArray.controls.forEach((itemGroup: AbstractControl, index: number) => {
  //   const item = itemGroup as FormGroup;

  //   // Append each property of the item with index-based keys
  //   formData.append(`items[${index}][id]`, item.get('id')?.value);
  //   formData.append(`items[${index}][quantity]`, item.get('quantity')?.value);
  //   formData.append(`items[${index}][unitPrice]`, item.get('unitPrice')?.value);
  //   formData.append(`items[${index}][discount]`, item.get('discount')?.value);
  //   formData.append(`items[${index}][salesTax]`, item.get('salesTax')?.value);
  //   formData.append(`items[${index}][unit]`, item.get('unit')?.value);
  //   formData.append(`items[${index}][notes]`, item.get('notes')?.value);
  // });
    //  // Convert items FormArray to JSON string and append it
     const itemsArray = this.saleOfferForm.get('items')?.value;
     formData.append('items', JSON.stringify(itemsArray));
  
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl+'SaleOffer', formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        // alert('submit successfully');
        this.toast.success('submit successfully')
      }, error => {
        console.error('Error:', error);
        this.toast.error('An error accured')
      });
  }
changePage(newPageNumber: number): void {
  this.pageNumber = newPageNumber;
  console.log(this.pageNumber)
  this.getAllSaleOffers();
}

isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

}