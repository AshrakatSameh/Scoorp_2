import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';
import { WarehouseCatService } from 'src/app/services/getAllServices/WarehouseCategories/warehouse-cat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-storehouse',
  templateUrl: './storehouse.component.html',
  styleUrls: ['./storehouse.component.css']
})
export class StorehouseComponent implements OnInit{

  apiUrl = `${environment.apiUrl}Warehouses/CreateWarehouse`

  public storehouse:any[]=[];
  itemCategory: any[] = [];

  pageNumber: number = 1;
  pageSize: number = 10;

  storeHouseForm: FormGroup;

  constructor(private  storeHouseService: WarehouseService ,private fb:FormBuilder,
    private http:HttpClient , private warehouseCat: WarehouseCatService, private toast: ToastrService){

    this.storeHouseForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      warehouseCategoryId:['',Validators.required]
    })
  }

  ngOnInit(): void {
this.getAllWareHouses();
this.getAllWareHousesCat()
  }

  
  getAllWareHouses(){
    this.storeHouseService.getWarehouses(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.storehouse = data.data;
          console.log(this.storehouse);
        }, error => {
          console.error('Error fetching tenant storehouse:', error);
        });
      }

      getAllWareHousesCat(){
        this.warehouseCat.getWarehouseCategories(this.pageNumber, this.pageSize)
            .subscribe(data => {
              this.itemCategory = data.data;
              console.log(this.itemCategory);
            }, error => {
              console.error('Error fetching tenant storehouse:', error);
            });
          }

      
      onSubmit() {
        const formData = new FormData();
        const name = this.storeHouseForm.get('name')!.value;
        const localName = this.storeHouseForm.get('localName')!.value;
        const description = this.storeHouseForm.get('description')!.value;
        const warehouseCategoryId = this.storeHouseForm.get('warehouseCategoryId')!.value;
  
        
        if (name) {
          formData.append('name', name);
          formData.append('localName', localName);
          formData.append('description', description);
          formData.append('warehouseCategoryId', warehouseCategoryId);
         
          
    
          
        } else {
          console.error('One or more form fields are null');
          return;
        }
    
        const tenantId = localStorage.getItem('tenant');
        const headers = new HttpHeaders({
          tenant: tenantId || '', // Set tenantId header if available
          'Content-Type': 'application/json',
        });
        const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&description=${encodeURIComponent(description)}`;
        this.http.post<any>(url, formData,{headers}).subscribe(
          (response) => {
            // alert('Done');
            console.log('ًWarehouse created successfully:', response);
            this.toast.success('ًWarehouse created successfully')
            // Reset form after successful submission
            this.storeHouseForm.reset();
          },
          (error: HttpErrorResponse) => {
            console.error('Error creating warehouse:', error.error);
            const errorMessage = error.error?.message || 'An unexpected error occurred.';
            this.toast.error(errorMessage, 'Error'); 
            // Handle error
          }
        );
      }
  
      changePage(newPageNumber: number): void {
        this.pageNumber = newPageNumber;
        console.log(this.pageNumber)
        this.getAllWareHouses();
      }

      // Update warehouse

      storesSec:any[] =[];
      isModalOpen = false;
      selectedCategory: any = null;
  isDropdownOpen2: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen2 = !this.isDropdownOpen2;
  }
  
  closeDropdown() {
    this.isDropdownOpen2 = false;
  }
  
  onCheckboxChange(category: any) {
    this.updateSelectAll();
    this.selectedCategory = category;  // Store the selected category data
  }
  
  openModalForSelected() {
    if (this.selectedCategory) {
      this.storeHouseForm.patchValue({
        name: this.selectedCategory.name,
        localName: this.selectedCategory.localName,
        description: this.selectedCategory.clientId,
        warehouseCategoryId: this.selectedCategory.assignedToId
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
    if (this.storeHouseForm.valid) {
      const updatedCategory = { ...this.storeHouseForm.value, id: this.selectedCategory.id };
  
      // Call the update service method using the category's id
      this.storeHouseService.updateWarehouse(this.selectedCategory.id, updatedCategory).subscribe(
        (response) => {
          console.log('Warehouse updated successfully:', response);
          this.toast.success('Warehouse updated successfully')
          // Update the local categories array if necessary
          const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.storesSec[index] = updatedCategory;
          }
  
          this.getAllWareHouses();
          this.closeModal();  // Close the modal after successful update
        },
        (error: HttpErrorResponse) => {
          console.error('Error updating warehouse:', error);
          console.log('Updated warehouse Data:', updatedCategory);
          // alert('An error occurred while updating the item type .');
          this.toast.error('An error occurred while updating the warehouse .')
        }
      );
      }
    }
  
  deleteItemType(){
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed){
      this.storeHouseService.deleteWarehouseById(this.selectedCategory.id).subscribe(
        (response)=>{
          console.log('warehouse deleted successfully:', response);
          this.toast.success('warehouse deleted successfully');
          this.getAllWareHouses();
          this.closeModal(); 
        },error => {
          console.error('Error delete warehouse category:', error);
          console.log(this.selectedCategory.id);
          // alert('An error occurred while updating the warehouse .');
          const errorMessage = error.error || 'An unexpected error occurred.';
          this.toast.error(errorMessage, 'Error'); 
        }
      )
    }else {
        // User canceled the deletion
        console.log('Deletion canceled');
      }
    
  }
  

    // select checkbox
    selectAll = false;

    selectedCount = 0;
    
    toggleAllCheckboxes() {
      // Set each item's checked status to match selectAll
      this.storehouse.forEach(item => (item.checked = this.selectAll));
      // Update the selected count
      this.selectedCount = this.selectAll ? this.storehouse.length : 0;
    }
    
    updateSelectAll() {
      // Update selectAll if all items are checked
      this.selectAll = this.storehouse.every(item => item.checked);
      // Calculate the number of selected items
      this.selectedCount = this.storehouse.filter(item => item.checked).length;
    }
  

}
