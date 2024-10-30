import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
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
    private http:HttpClient
  ) {
    this.goodsForm = this.fb.group({
      clientId: ['', Validators.required],
      representativeId: ['', Validators.required],
      code: ['', Validators.required],
      teamId: ['', Validators.required],
      costCenterId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      supplier: ['', Validators.required],
      locationLinkIds: this.fb.array([]),

      // items: fb.array([]),

    });
  }
  ngOnInit(): void {

    this.getAllGoodsReceipt();
    this.getAllClients();
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getAllCostCenters();
    this.getAllWarehouses();
    this.getAllLocationss();
  }

  isCodeVisible = false;  
  toggleCode(): void {
    this.isCodeVisible = !this.isCodeVisible;  // Toggle the visibility
  }

  getAllGoodsReceipt() {
    this.salesService.getGoodsReceipt(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.goods = response.goodsReceipts;
        // this.mapRequestStage();
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
  formData.append('code', this.goodsForm.get('code')?.value);
  formData.append('teamId', this.goodsForm.get('teamId')?.value);
  formData.append('costCenterId', this.goodsForm.get('costCenterId')?.value);
  formData.append('warehouseId', this.goodsForm.get('warehouseId')?.value);
  formData.append('supplier', this.goodsForm.get('supplier')?.value);
  formData.append('locationLinkIds', this.goodsForm.get('locationLinkIds')?.value);


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
    });
}
}
