import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentType } from 'src/app/enums/PaymentType';
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
  paymentMethod:any[]=[];
  clients:any[]=[];
  collections:any[]=[];

  isModalOpen = false;
  selectedCategory: any = null;

  paymentType = PaymentType;  // Access the PaymentType enum
  // Convert enum to an array for dropdown
  paymentTypeList: { key: string, value: string }[] = [];

  collectionForm!: FormGroup;

  constructor(private costCenterService: CostCenterService, private representService:RepresentativeService,
     private convenantBoxService: ConvenantBoxService, private contractService:ContractService,
    private paymentService:PaymentMethodService, private clientService:ClientsService,
  private collectionService:CollectionsService, private fb:FormBuilder, private teamService:TeamsService,
private toast:ToastrService) { 
    this.collectionForm= this.fb.group({
      code:['', Validators.required],
      clientId:1,
      representativeId:['', Validators.required],
      teamId:['', Validators.required],
      paymentMethodId:['', Validators.required],
      clientPhone:['', Validators.required],
      clientEmail:['', Validators.required],
      costCenterId:['', Validators.required],
      covenantBoxId:['', Validators.required],

    });

    this.paymentTypeList = Object.keys(this.paymentType).map(key => ({
      key: key,
      value: this.paymentType[key as keyof typeof PaymentType]
    }));
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


  isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
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
      this.convenants = response.covenantBoxes;
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
      this.paymentMethod = response.paymentMethods;
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
      this.collections = response.item1;
      //console.log(this.collections);
    }, error => {
      console.error('Error fetching collections data:', error)
    })

  }
  team:any[]=[];
  getAllTeams() {
    this.teamService.getTeams().subscribe(response => {
      this.team = response.teams;
    console.log(this.team);
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


  // Update
onCheckboxChange(category: any) {
  this.selectedCategory = category;  // Store the selected category data
}

openModalForSelected() {
  if (this.selectedCategory) {
    this.collectionForm.patchValue({
      code: this.selectedCategory.code,
      clientId: this.selectedCategory.clientId,
      representativeId: this.selectedCategory.representativeId,
      teamId: this.selectedCategory.teamId,
      paymentMethodId: this.selectedCategory.paymentMethodId,
      clientPhone: this.selectedCategory.clientPhone,
      clientEmail: this.selectedCategory.clientEmail,
      costCenterId: this.selectedCategory.costCenterId,
      covenantBoxId: this.selectedCategory.covenantBoxId,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

updateCategory() {
  if (this.collectionForm.valid) {
    const updatedCategory = { ...this.collectionForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.collectionService.updateItemType(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Item type updated successfully')
        // Update the local categories array if necessary
        const index = this.collections.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.collections[index] = updatedCategory;
        }

        this.getAllCollections();
        this.closeModal();  // Close the modal after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating collection:', error);
        console.log('Updated collection Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        this.toast.error('An error occurred while updating the item type .')
      }
    );
    }
  }

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllCollections();
  }

  deleteItem(){
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed){
      this.collectionService.deleteItemById(this.selectedCategory.id).subscribe(
        (response)=>{
          console.log('deleted successfully:', response);
          this.toast.success('deleted successfully');
          this.getAllCollections();
          this.closeModal(); 
        },error => {
          console.error('Error delete category:', error);
          console.log(this.selectedCategory.id);
          // alert('An error occurred while updating the item type .');
          this.toast.error('An error occurred while deleting  .')
        }
      )
    }else {
        // User canceled the deletion
        console.log('Deletion canceled');
      }
    
  }
}
