import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { PaymentType } from 'src/app/enums/PaymentType';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { PaymentPeriodsService } from 'src/app/services/getAllServices/PaymentPeriods/payment-periods.service';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { SupervisorService } from 'src/app/services/getAllServices/Supervisors/supervisor.service';
import { TagService } from 'src/app/services/getAllServices/Tag/tag.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  apiUrl = `${environment.apiUrl}Clients/CreateClient`


  pageNumber: number = 1;
  pageSize: number = 10;
  clients:any[]=[];
  supervisors:any[]=[];
  tags:any[]=[];
  paymentType = PaymentType;  // Access the PaymentType enum
  // Convert enum to an array for dropdown
  paymentTypeList: { key: number; value: string }[] = [];

  clientForm: FormGroup;

  constructor(private clientService: ClientsService, private fb:FormBuilder,
    private supervisorService: SupervisorService, private tagService:TagService, private http:HttpClient,
    private priceList:PriceListService, private payments: PaymentPeriodsService, private repre: RepresentativeService,
    private teamService: TeamsService, private costCenterService:CostCenterService, private toast:ToastrService
  ){
    this.clientForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      phone:['', Validators.required],
      email:['', Validators.required],
      code:['', Validators.required],
      priceListId:['', Validators.required],
      tagId:['', Validators.required],
      paymentPeriodId:['', Validators.required],
      paymentMethodId:['', Validators.required],
      deliveryMethod:['', Validators.required],
      representativeId:['', Validators.required],
      teamId:['', Validators.required],
      costCenterId:['', Validators.required],
      creditLimit:['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getAllClients();
    this. getAllTags();
    this.getAllPriceLists();
    this.getAllPaymentsPeriods();
this.getAllRepresentatives();
this.getAllCostCenters();
this.getAllTeams();
    this.paymentTypeList = [
      { key: 0, value: 'Cash' },
      { key: 1, value: 'Deferred' },
      { key: 2, value: 'CashOrDeferred' }
    ];
  }

  buttons = ['المعلومات الأساسية', 'المواقع والفروع', 'المرفقات', 'المهام', 'الحساب البنكي',
    'الأشعارات والتذكير','التقارير','معلومات التواصل', 'بيانات للضريبه','الإستبيانات']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  getAllClients(){
    this.clientService.getAllCliensts(this.pageNumber, this.pageSize).subscribe(response=>{
        this.clients= response.data;
        console.log(this.clients);
      }, error =>{
        console.error('Error fetching clients data:' , error)
      })
      
    }
    getAllTags(){
      this.tagService.getUserTags().subscribe(response=>{
          this.tags= response.item1;
          console.log(this.tags);
        }, error =>{
          console.error('Error fetching tags data:' , error)
        })
        
}

      prices:any[]=[];
      getAllPriceLists() {
        this.priceList.getAllPriceLists().subscribe(response => {
          this.prices = response.data;
          console.log('price lists:',this.costCenters);
        }, error => {
          console.error('Error fetching price lists data:', error)
        })
    
      }

      paymentPeriod:any[]=[];
      getAllPaymentsPeriods() {
        this.payments.getAllPaymentPeriods().subscribe(response => {
          this.paymentPeriod = response.paymentPeriods;
          //console.log(this.costCenters);
        }, error => {
          console.error('Error fetching price lists data:', error)
        })
    
      }

      
      representatives:any[]=[];
      getAllRepresentatives() {
        this.repre.getAllRepresentative().subscribe(response => {
          this.representatives = response;
          //console.log(this.costCenters);
        }, error => {
          console.error('Error fetching price lists data:', error)
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
      costCenters:any[]=[];
      getAllCostCenters() {
        this.costCenterService.getAllCostCaners().subscribe(response => {
          this.costCenters = response.costCenters;
          //console.log(this.costCenters);
        }, error => {
          console.error('Error fetching costCenters data:', error)
        })
    
      }

    onSubmit() {
      const formData = new FormData();
      const name = this.clientForm.get('name')!.value;
      const localName = this.clientForm.get('localName')!.value;
      const phone = this.clientForm.get('phone')!.value;
      const email = this.clientForm.get('email')!.value;
      const code = this.clientForm.get('code')!.value;
      const tagId = this.clientForm.get('tagId')!.value;
      const priceListId = this.clientForm.get('priceListId')!.value;
      const paymentPeriodId = this.clientForm.get('paymentPeriodId')!.value;
      const paymentMethodId = this.clientForm.get('paymentMethodId')!.value;
      const deliveryMethod = this.clientForm.get('deliveryMethod')!.value;
      const representativeId = this.clientForm.get('representativeId')!.value;
      const teamId = this.clientForm.get('teamId')!.value;
      const costCenterId = this.clientForm.get('costCenterId')!.value;
      const creditLimit = this.clientForm.get('creditLimit')!.value;
      
      if (name) {
        formData.append('name', name);
        formData.append('localName', localName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('code', code);
        formData.append('tagId', tagId);
        formData.append('priceListId', priceListId);
        formData.append('paymentPeriodId', paymentPeriodId);
        formData.append('paymentMethodId', paymentMethodId);
        formData.append('deliveryMethod', deliveryMethod);
        formData.append('representativeId', representativeId);
        formData.append('teamId', teamId);
        formData.append('costCenterId', costCenterId);
        formData.append('creditLimit', creditLimit);
        
  
        
      } else {
        console.error('One or more form fields are null');
        return;
      }
  
      const tenantId = localStorage.getItem('tenant');
      const headers = new HttpHeaders({
        tenant: tenantId || '', // Set tenantId header if available
        'Content-Type': 'application/json',
      });
      const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&Phone=${encodeURIComponent(phone)}&Email=${encodeURIComponent(email)}&Code=${encodeURIComponent(code)}&TagId=${encodeURIComponent(tagId)}`;
      this.http.post<any>(url, formData,{headers}).subscribe(
        (response) => {
          // alert('Done');
          console.log('Client created successfully:', response);
          this.toast.success()
          // Reset form after successful submission
          this.clientForm.reset('Client created successfully:');
        },
        (error) => {
          console.error('Error creating Client:', error.error);
          const errorMessage = error.error?.message || 'An unexpected error occurred.';
          this.toast.error(errorMessage, 'Error'); 
          // Handle error
        }
      );
    }

    // ازرار الاجراءات
    isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

   
    changePage(newPageNumber: number): void {
      this.pageNumber = newPageNumber;
      console.log(this.pageNumber)
      this.getAllClients();
    }


  // Update 
  storesSec:any[] =[];
  isModalOpen = false;
  selectedCategory: any = null;

  onCheckboxChange(category: any) {
    this.selectedCategory = category;  // Store the selected category data
  }
  
  openModalForSelected() {
    if (this.selectedCategory) {
      this.clientForm.patchValue({
        name: this.selectedCategory.name,
        localName: this.selectedCategory.localName,
        phone: this.selectedCategory.phone,
        email: this.selectedCategory.email,
        code: this.selectedCategory.code,
        priceListId: this.selectedCategory.priceListId,
        tagId: this.selectedCategory.tagId,
        paymentPeriodId: this.selectedCategory.paymentPeriodId,
        paymentMethodId: this.selectedCategory.paymentMethodId,
        deliveryMethod: this.selectedCategory.deliveryMethod,
        representativeId: this.selectedCategory.representativeId,
        teamId: this.selectedCategory.teamId,
        costCenterId: this.selectedCategory.costCenterId,
        creditLimit: this.selectedCategory.creditLimit,
      });
  
      this.isModalOpen = true;
    } else {
      alert('Please select a client to update.');
    }
  }
  
  closeModal() {
    this.isModalOpen = false;
  }
  
  updateCategory() {
    if (this.clientForm.valid) {
      const updatedCategory = { ...this.clientForm.value, id: this.selectedCategory.id };
  
      // Call the update service method using the category's id
      this.clientService.updateClient(this.selectedCategory.id, updatedCategory).subscribe(
        (response) => {
          console.log('Category updated successfully:', response);
          this.toast.success('Item type updated successfully')
          // Update the local categories array if necessary
          const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.storesSec[index] = updatedCategory;
          }
  
          this.getAllClients();
          this.closeModal();  // Close the modal after successful update
        },
        (error) => {
          console.error('Error updating client:', error);
          console.log('Updated client Data:', updatedCategory);
          // alert('An error occurred while updating the item type .');
          const errorMessage = error.error?.message || 'An unexpected error occurred.';
          this.toast.error(errorMessage, 'Error'); 
              }
      );
      }
    }


    deleteItemType(){
      const confirmed = window.confirm(
        'Are you sure you want to delete this record?'
      );
      if (confirmed){
        this.clientService.deleteClientById(this.selectedCategory.id).subscribe(
          (response)=>{
            console.log('Client deleted successfully:', response);
            this.toast.success('Client deleted successfully');
            this.getAllClients();
            this.closeModal(); 
          },error => {
            console.error('Error delete cllient category:', error);
            console.log(this.selectedCategory.id);
            // alert('An error occurred while updating the cllient .');
            const errorMessage = error.error?.text || 'An unexpected error occurred.';
            this.toast.error(errorMessage, 'Error');       }
        )
      }else {
          // User canceled the deletion
          console.log('Deletion canceled');
        }
      
    }
}
