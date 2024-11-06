import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  priceListForm!:FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
  lists:any[]=[];
  apiUrl= environment.apiUrl+'PriceList/Create'

  constructor(private fb:FormBuilder, private priceService:PriceListService, private http:HttpClient,
    private toast: ToastrService, private itemService:ItemsService
  ){
    this.priceListForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      description:['', Validators.required],
      code:['', Validators.required],
      priceListItems:this.fb.array([]),
      
    })
  }

  ngOnInit(): void {
    this.getAllPriceLists();
    this.getAllItems();
  }

  isDropdownOpen: boolean = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}

  buttons = ['الأصناف', 'الملاحظات', 'المهام', 'مرفقات']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  getAllPriceLists() {
    this.priceService.getPriceListsWithPaging(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.lists = data.data;
        //console.log(this.contacts);
      }, error => {
        console.error('Error fetching price lists data:', error);
      });
  } 
  onSubmitAdd(){

    const formData = new FormData();
    const name = this.priceListForm.get('name')!.value;
    const localName = this.priceListForm.get('localName')!.value;
    const code = this.priceListForm.get('code')!.value;
    const description = this.priceListForm.get('description')!.value;

    if (name) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('code', code);
      formData.append('description', description);
    
  
      
    } else {
      console.error('One or more form fields are null');
      return;
    }
     // Append PriceListItems array
  const priceListItems = this.priceListForm.get('priceListItems') as FormArray;
  priceListItems.controls.forEach((item, index) => {
    formData.append(`PriceListItems[${index}].itemId`, item.get('itemId')?.value);
    formData.append(`PriceListItems[${index}].description`, item.get('description')?.value);
    formData.append(`PriceListItems[${index}].unitPrice`, item.get('unitPrice')?.value);
    formData.append(`PriceListItems[${index}].unit`, item.get('unit')?.value);
    formData.append(`PriceListItems[${index}].tax`, item.get('tax')?.value);
    formData.append(`PriceListItems[${index}].discount`, item.get('discount')?.value);
  });

    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenantId header if available
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&Code=${encodeURIComponent(code)}&Description=${encodeURIComponent(description)}`;
    this.http.post<any>(url, formData,{headers}).subscribe(
      (response) => {
        console.log('Price list created successfully:', response);
        // Reset form after successful submission
        this.priceListForm.reset();
        this.getAllPriceLists();
        this.toast.success('Price list created successfully');
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating Client:', error.error);
        this.toast.error(error.error)
        // Handle error
      }
    );
  }
  onSubmit() { 
    const formData = new FormData();
  
    // Basic fields
    const name = this.priceListForm.get('name')?.value;
    const localName = this.priceListForm.get('localName')?.value;
    const code = this.priceListForm.get('code')?.value;
    const description = this.priceListForm.get('description')?.value;
  
    if (name && localName && code && description) {
      formData.append('name', name);
      formData.append('localName', localName);
      formData.append('code', code);
      formData.append('description', description);
    } else {
      console.error('One or more form fields are null');
      return;
    }
  
    // Append PriceListItems array
    const priceListItems = this.priceListForm.get('priceListItems') as FormArray;
    priceListItems.controls.forEach((item, index) => {
      formData.append(`PriceListItems[${index}].itemId`, item.get('itemId')?.value);
      formData.append(`PriceListItems[${index}].description`, item.get('description')?.value);
      formData.append(`PriceListItems[${index}].unitPrice`, item.get('unitPrice')?.value);
      formData.append(`PriceListItems[${index}].unit`, item.get('unit')?.value);
      formData.append(`PriceListItems[${index}].tax`, item.get('tax')?.value);
      formData.append(`PriceListItems[${index}].discount`, item.get('discount')?.value);
    });
  
    // Set headers without Content-Type to let Angular set it automatically for FormData
    const tenantId = localStorage.getItem('tenant');
    const headers = new HttpHeaders({
      tenant: tenantId || '', // Set tenant header if available
    });
  
    const url = `${this.apiUrl}`; // Replace with actual API endpoint
  
    // POST request
    this.http.post<any>(url, formData, { headers }).subscribe(
      (response) => {
        // alert('Done');
        console.log('Price list created successfully:', response);
        this.toast.success('Price list created successfully');
        this.priceListForm.reset();
        this.getAllPriceLists(); // Refresh the list after submission
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating PriceList:', error.error);
        this.toast.error('Failed to create price list');
      }
    );
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

    itemList:any[]=[];
getAllItems(){
  this.itemService.getAllItems().subscribe(response => {
    this.itemList = response.item1;
    console.log(this.itemList);
  }, error => {
    console.error('Error fetching  items:', error)
  })
}

// Method to remove an item from the FormArray
get priceListItems(): FormArray {
  return this.priceListForm.get('priceListItems') as FormArray;
}
tableData = [
  {
    selectedItemId: null,
    quantity: '',
    unit: '',
    unitPrice: 0,
    tax: 0,
    discount: 0,
    note: '',
  },
];
removeItem(index: number) {
  this.priceListItems.removeAt(index);
}
addDeliveryNoteItem() {
  const item = this.fb.group({
    itemId: [0],
    description: [''],
    unitPrice: [0],
    unit: [''],
    tax: [0],
    discount: [0]
  });
  this.priceListItems.push(item);
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
    this.priceListForm.patchValue({
      name: this.selectedCategory.name,
      localName: this.selectedCategory.localName,
      note: this.selectedCategory.note,
      description: this.selectedCategory.code,
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
  if (this.priceListForm.valid) {
    const updatedCategory = { ...this.priceListForm.value, id: this.selectedCategory.id };

    // Call the update service method using the category's id
    this.priceService.updatePriceList(this.selectedCategory.id, updatedCategory).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.toast.success('Item type updated successfully')
        // Update the local categories array if necessary
        const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.storesSec[index] = updatedCategory;
        }

        this.getAllPriceLists();
        this.closeModal();  // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating category:', error);
        console.log('Updated Category Data:', updatedCategory);
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
    this.priceService.deletePriceById(this.selectedCategory.id).subscribe(
      (response)=>{
        console.log('Item type deleted successfully:', response);
        this.toast.success('Item type deleted successfully');
        this.getAllPriceLists();
        this.closeModal(); 
      },error => {
        console.error('Error delete item type category:', error);
        console.log(this.selectedCategory.id);
        // alert('An error occurred while updating the item type .');
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');       }
    )
  }else {
      // User canceled the deletion
      console.log('Deletion canceled');
    }
  
}
selectAll = false;

toggleAllCheckboxes() {
  this.lists.forEach(item => (item.checked = this.selectAll));
}

updateSelectAll() {
  this.selectAll = this.lists.every(item => item.checked);
}
}
