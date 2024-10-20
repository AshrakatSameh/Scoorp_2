import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CollectionsService } from 'src/app/services/getAllServices/Collections/collections.service';
import { ContractService } from 'src/app/services/getAllServices/Contracts/contract.service';
import { ConvenantBoxService } from 'src/app/services/getAllServices/ConvenantBox/convenant-box.service';
import { ConvenantService } from 'src/app/services/getAllServices/Convenants/convenant.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { PaymentMethodService } from 'src/app/services/getAllServices/PaymentMethods/payment-method.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {


  pageNumber: number = 1;
  pageSize: number = 10;

  costCenters: any[] = [];
  convenants: any[] = [];
  representatives:any[]=[];
  contracts:any[]=[];
  paymentMethods:any[]=[];
  clients:any[]=[];
  collections:any[]=[];


  collectionForm!: FormGroup;

  constructor(private costCenterService: CostCenterService, private representService:RepresentativeService,
     private convenantBoxService: ConvenantBoxService, private contractService:ContractService,
    private paymentService:PaymentMethodService, private clientService:ClientsService,
  private collectionService:CollectionsService, private fb:FormBuilder, private teamService:TeamsService) { 
    this.collectionForm= this.fb.group({
      code:['', Validators.required],
      clientId:['', Validators.required],
      representativeId:['', Validators.required],
      teamId:['', Validators.required],
      paymentMethodId:['', Validators.required],
      clientPhone:['', Validators.required],
      clientEmail:['', Validators.required],
      costCenterId:['', Validators.required],
      covenantBoxId:['', Validators.required],

    })
  }

  ngOnInit(): void {
    this.getAllCostCenters();
    this.getAllConvenantBoxes();
    this.getAllRepresentative();
    this.getAllContracts();
    this.getAllPaymentMethods();
    this.getAllClients();
    this.getAllCollections();
    this.getAllTeams();

  }



  buttons = ['التعليقات', 'المهام', 'المرفقات', 'الارتباطات', 'التوقيع', 'الختم']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }


  getAllCostCenters() {
    this.costCenterService.getAllCostCaners().subscribe(response => {
      this.costCenters = response.costCenters;
      //console.log(this.costCenters);
    }, error => {
      console.error('Error fetching costCenters data:', error)
    })

  }
  getAllConvenantBoxes() {
    this.convenantBoxService.getConvenantBoxes().subscribe(response => {
      this.convenants = response;
      //console.log(this.convenants);
    }, error => {
      console.error('Error fetching convenants data:', error)
    })

  }
  getAllRepresentative() {
    this.representService.getAllRepresentative().subscribe(response => {
      this.representatives = response;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching representatives data:', error)
    })

  }
  getAllContracts() {
    this.contractService.getAllContracts().subscribe(response => {
      this.contracts = response.contracts;
      //console.log(this.contracts);
    }, error => {
      console.error('Error fetching contracts data:', error)
    })

  }
  getAllPaymentMethods() {
    this.paymentService.getAllPaymentMethods().subscribe(response => {
      this.paymentMethods = response.paymentMethods;
     // console.log(this.paymentMethods);
    }, error => {
      console.error('Error fetching paymentMethods data:', error)
    })

  }
  getAllClients() {
    this.clientService.getCliensts().subscribe(response => {
      this.clients = response.data;
    //  console.log(this.clients);
    }, error => {
      console.error('Error fetching clients data:', error)
    })

  }

  getAllCollections() {
    this.collectionService.getAllCollections(this.pageNumber, this.pageSize).subscribe(response => {
      this.collections = response;
      console.log(this.collections);
    }, error => {
      console.error('Error fetching collections data:', error)
    })

  }
  teams:any[]=[];
  getAllTeams() {
    this.teamService.getTeams().subscribe(response => {
      this.teams = response.teams;
    //  console.log(this.collections);
    }, error => {
      console.error('Error fetching teams data:', error)
    })

  }

 

  onSubmitAdd(): void {
   
    if (this.collectionForm.valid) {
      // Call the service to post the data
      const formData = this.collectionForm.value; // Get the form data
      this.collectionService.createCollection(formData).subscribe(
        response => {
          console.log('collection created successfully!', response);
          alert('collection created successfully!')
          // Handle success, show notification, etc.
        },
        error => {
          console.error('Error creating collection:', error);
          console.log(formData)
          // Handle error, show notification, etc.
        }
      );
    } else {
      console.log(this.collectionForm);
      console.log('Form is not valid');
      // Handle form validation errors
    }
  }

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllCollections();
  }
}
