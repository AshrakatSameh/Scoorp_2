import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { environment } from 'src/environments/environment.development';

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
  paymentTypeList: { key: number; value: string }[] = [];
 
  collectionForm!: FormGroup;

  constructor(private costCenterService: CostCenterService, private representService:RepresentativeService,
     private convenantBoxService: ConvenantBoxService, private contractService:ContractService,
    private paymentService:PaymentMethodService, private clientService:ClientsService,
  private collectionService:CollectionsService, private fb:FormBuilder, private teamService:TeamsService,
  private http:HttpClient, private priceList: PriceListService,
private toast:ToastrService) { 
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
      value:['']

    });

    // this.paymentTypeList = Object.keys(PaymentType)
    // .map((key, index) => ({
    //   key: index,  // Use the index as the numeric key
    //   value: PaymentType[key as keyof typeof PaymentType]  // Get the value from the enum
    // }));
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
    
    this.paymentTypeList = [
      { key: 0, value: 'Cash' },
      { key: 1, value: 'Deferred' },
      { key: 2, value: 'CashOrDeferred' }
    ];
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


 
apiUrl = environment.apiUrl
  onSubmitAdd() {
    const formData = new FormData();
    formData.append('code', this.collectionForm.get('code')?.value);
    formData.append('clientId', this.collectionForm.get('clientId')?.value);
    // formData.append('code', this.collectionForm.get('code')?.value);
    formData.append('representativeId', this.collectionForm.get('representativeId')?.value);
    formData.append('teamId', this.collectionForm.get('teamId')?.value);
    formData.append('paymentMethodId', this.collectionForm.get('paymentMethodId')?.value);
    formData.append('clientPhone', this.collectionForm.get('clientPhone')?.value);
    formData.append('clientEmail', this.collectionForm.get('clientEmail')?.value);
    formData.append('costCenterId', this.collectionForm.get('costCenterId')?.value);
    formData.append('covenantBoxId', this.collectionForm.get('covenantBoxId')?.value);
    formData.append('value', this.collectionForm.get('value')?.value);

  
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl + 'Collections/Create', formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        this.toast.success('submit successfully');
        this.collectionForm.reset();
      }, error => {
        console.error('Error:', error);
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error'); 
      });
  }


  // Update
onCheckboxChange(category: any) {
  this.updateSelectAll();
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
      value: this.selectedCategory.value
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
      (error) => {
        console.error('Error updating collection:', error);
        console.log('Updated collection Data:', updatedCategory);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');       }
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


  // dropdown table columns
columns = [
  // { name: 'id', displayName: 'المسلسل', visible: true },
  { name: 'clientEmail', displayName: 'ايميل العميل', visible: true },
  { name: 'clientPhone', displayName: 'رقم الهاتف', visible: true },
  { name: 'code', displayName: 'كود ', visible: true },
  { name: 'clientName', displayName: 'اسم العميل', visible: true },
  { name: 'representativeName', displayName: 'المندوب', visible: false },
  { name: 'teamName', displayName: 'الفريق', visible: false },
  { name: 'paymentMethodName', displayName: 'طريقة الدفع', visible: false },
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
    this.collections.forEach(item => (item.checked = this.selectAll));
    // Update the selected count
    this.selectedCount = this.selectAll ? this.collections.length : 0;
  }
  
  updateSelectAll() {
    // Update selectAll if all items are checked
    this.selectAll = this.collections.every(item => item.checked);
    // Calculate the number of selected items
    this.selectedCount = this.collections.filter(item => item.checked).length;
  }
}
