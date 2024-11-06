import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { WarehouseTransService } from 'src/app/services/getAllServices/WarehouseTransport/warehouse-trans.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storehouse-transportation',
  templateUrl: './storehouse-transportation.component.html',
  styleUrls: ['./storehouse-transportation.component.css']
})
export class StorehouseTransportationComponent implements OnInit {
  waresTransport:any[]=[];
  pageNumber=1;
  pageSize= 10;
  transportForm:FormGroup;

  apiUrl= environment.apiUrl;

  teams:any[]=[];
  representatives:any[]=[];
  warehouses:any[]=[];

  constructor(private wareTrans: WarehouseTransService, private fb: FormBuilder, private warehouse: WarehouseService,
    private team: TeamsService, private repres: RepresentativeService,private http:HttpClient, private toast:ToastrService
,private itemService : ItemsService
  ){
    this.transportForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      note:['', Validators.required],
      fromWarehouseId:['',Validators.required],
      toWarehouseId:['',Validators.required],
      receivingRequestNumber:['',Validators.required],
      teamId:['',Validators.required],
      representativeId:['',Validators.required],
      items: fb.array([]),

    })
  }
  ngOnInit(): void {
    this.getAllWarehouseTransport() ;
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getAllWarehouses();
    this.getAllItems();
   }
  buttons=['الاصناف','التعليقات','المهام','المرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }


  getAllWarehouseTransport(){
    this.wareTrans.getWarehouseTransport(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.waresTransport = data.transfers;
          console.log(this.waresTransport);
        }, error => {
          console.error('Error fetching tenant storehouse:', error);
        });
  }

  getAllTeams(){
    this.team.getTeams().subscribe(response => {
      this.teams = response.teams;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  teams:', error)
    });
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
  getAllRepresentatives() {
    this.repres.getAllRepresentative().subscribe(response => {
      this.representatives = response;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  representatives:', error)
    })
  }

  getAllWarehouses() {
    this.warehouse.getAllWarehouses().subscribe(response => {
      this.warehouses = response.data;
      //console.log(this.warehouses);
    }, error => {
      console.error('Error fetching  warehouses:', error)
    })
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.transportForm.get('name')!.value);
    formData.append('localName', this.transportForm.get('localName')!.value);
    formData.append('fromWarehouseId', this.transportForm.get('fromWarehouseId')!.value);
    formData.append('toWarehouseId', this.transportForm.get('toWarehouseId')!.value);
    formData.append('receivingRequestNumber', this.transportForm.get('receivingRequestNumber')!.value);
    formData.append('teamId', this.transportForm.get('teamId')!.value);
    formData.append('representativeId', this.transportForm.get('representativeId')!.value);
    formData.append('note', this.transportForm.get('note')!.value);

    this.items.controls.forEach((item, index) => {
      const itemValue = item.value;
      formData.append(`Items[${index}].itemId`, itemValue.itemId);
      formData.append(`Items[${index}].transferredQuantity`, itemValue.transferredQuantity);
      formData.append(`Items[${index}].unit`, itemValue.unit);
  });
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl + 'StoresSection/warehouse-transfer?', formData, { headers })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.toast.success('Submitted successfully');
          this.getAllWarehouseTransport();
          this.closeModal();
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }
  
  // select checkbox
selectAll = false;

selectedCount = 0;

toggleAllCheckboxes() {
  // Set each item's checked status to match selectAll
  this.waresTransport.forEach(item => (item.checked = this.selectAll));
  // Update the selected count
  this.selectedCount = this.selectAll ? this.waresTransport.length : 0;
}

updateSelectAll() {
  // Update selectAll if all items are checked
  this.selectAll = this.waresTransport.every(item => item.checked);
  // Calculate the number of selected items
  this.selectedCount = this.waresTransport.filter(item => item.checked).length;
}

// Update
isModalOpen = false;
storesSec:any[] =[];
selectedCategory: any = null;
onCheckboxChange(category: any) {
  this.updateSelectAll();
  this.selectedCategory = category;  // Store the selected category data
}
openModalForSelected() {
  if (this.selectedCategory) {
    this.transportForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
      fromWarehouseId: this.selectedCategory.fromWarehouseId,
      toWarehouseId: this.selectedCategory.toWarehouseId,
      receivingRequestNumber: this.selectedCategory.receivingRequestNumber,
      teamId: this.selectedCategory.teamId,
      representativeId: this.selectedCategory.representativeId,
    });

    this.isModalOpen = true;
  } else {
    alert('Please select a type category to update.');
  }
}

closeModal() {
  this.isModalOpen = false;
}

updateCategory() {
  if (this.transportForm.valid) {
    const updatedCategory = { ...this.transportForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.wareTrans.updateTransport(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Unit category updated successfully:', response);
        this.toast.success('Unit category updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllWarehouseTransport();
        this.closeModal();  // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating unit category:', error);
        console.log('Updated unit category Data:', updatedCategory);
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
    this.wareTrans.deleteTransportById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Transport deleted successfully:', response);
        this.toast.success('Transport deleted successfully');
        this.getAllWarehouseTransport();
        this.closeModal(); 
      },error => {
        console.error('Error delete Unit category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');   
        console.log(error)   
       }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
}
 
isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

// Add items table
get items(): FormArray {
  return this.transportForm.get('items') as FormArray;
}
tableData = [
  {
    selectedItemId: null,
    receivedQuantity: '',
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
addItem() {
  const item = this.fb.group({
    itemId: [0],
    transferredQuantity: [0],
    unit: ['']
  });
  this.items.push(item);
}

}
