import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandsService } from 'src/app/services/getAllServices/brands/brands.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { ItemcategoryService } from 'src/app/services/getAllServices/itemcategory/itemcategory.service';
import { ItemgroupService } from 'src/app/services/getAllServices/itemgroup/itemgroup.service';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';
import { UnitService } from 'src/app/services/getAllServices/unit/unit.service';
import { environment } from 'src/environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';

@Component({
  selector: 'app-cateogries',
  templateUrl: './cateogries.component.html',
  styleUrls: ['./cateogries.component.css'],
})
export class CateogriesComponent {
  storesSec: any[] = [];
  units: any[] = [];
  types: any[] = [];
  brands: any[] = [];
  itemCategory: any[] = [];
  costs: any[] = [];
  selectedCategory: any = null;

  isModalOpen = false;
  isDropdownOpen: boolean = false;


  ItemsForm: FormGroup;

  selectedGender: string = '';
  selectedStatus: string = '';
  selectedSales: string = '';

  apiUrl = environment.apiUrl + 'Items';


  buttons = [
    'المعلومات العامة ',
    'المبيعات ',
    'المرفقات',
    'المقاس',
    'المهام',
    'الحركات',
    'الانشطه',
    'الأرصدة الإفتتاحية'
  ];

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  constructor(
    private itemServices: ItemsService,
    private fb: FormBuilder,
    private itemCat: ItemcategoryService,
    private itemType: ItemTypeService,
    private unit: UnitService,
    private brand: BrandsService,
    private http: HttpClient,
    private cost: CostCenterService,
    private toast: ToastrService,
    private wareService: WarehouseService,
  ) {
    this.ItemsForm = this.fb.group({
      name: ['', Validators.required],
      localName: ['', Validators.required],
      canBeSold: ['', Validators.required],
      canBePurchased: ['', Validators.required],
      canBeConsumed: ['', Validators.required],
      itemCategoryId: ['', Validators.required],
      barcode: ['', Validators.required],
      code: ['', Validators.required],
      itemTypeId: ['', Validators.required],
      unitId: ['', Validators.required],
      salesPrice: ['', Validators.required],
      salesTax: ['', Validators.required],
      costCenterId: ['', Validators.required],
      brandId: ['', Validators.required],
      note: ['', Validators.required],
      localNote: ['', Validators.required],
      totalSoldQuantity: ['', Validators.required],
      totalPurchasedQuantity: ['', Validators.required],
      totalCurrentStock: ['', Validators.required],
      width: ['', Validators.required],
      length: ['', Validators.required],
      height: ['', Validators.required],
      pallet: ['', Validators.required],
      palletHeight: ['', Validators.required],
      thickness: ['', Validators.required],
      weight: ['', Validators.required],
      customField: ['', Validators.required],
      itemWarehouses: this.fb.array([]),

    });
  }

  ngOnInit(): void {
    this.getAllBrands();
    this.getAllCategories();
    this.getAllItemCategory();
    this.getAllItemType();
    this.getAllUnit();
    this.getAllcosts();
    this.getAllWarehouses();

  }

  get itemWarehouses(): FormArray {
    return this.ItemsForm.get('itemWarehouses') as FormArray;
  }

  removeItem(index: number) {
    this.itemWarehouses.removeAt(index);
  }
  addDeliveryNoteItem() {
    const item = this.fb.group({
      warehouseId: [null, Validators.required],
      openingBalance: [null, Validators.required],
      openingPrice: [null, Validators.required],
      unit: ['', Validators.required],
      unitPrice: [null, Validators.required]
    });
    this.itemWarehouses.push(item);
  }



  getAllCategories() {
    this.itemServices.getAllItemsWithoutPaging(this.pageNumber, this.pageSize).subscribe(
      (response) => {
        this.storesSec = response.item1; // Assign the fetched Warehouses
        console.log('items :', this.storesSec);
      },
      (error) => {
        console.error('Error fetching item types Items:', error); // Handle errors
      }
    );
  }


  getAllcosts() {
    this.cost.getAllCostCaners().subscribe(
      (response) => {
        this.costs = response.costCenters; // Assign the fetched Warehouses
        console.log('costs :', this.costs);
      },
      (error) => {
        console.error('Error fetching item costs:', error); // Handle errors
      }
    );
  }

  getAllItemCategory() {
    this.itemCat.getAllitemCat().subscribe(data => {
      this.itemCategory = data.categories;
      console.log(this.itemCategory);
    }, error => {
      console.error('Error fetching itemCategory data:', error);
    })
  }

  getAllItemType() {
    this.itemType.getAllitemType().subscribe(data => {
      this.types = data.types;
      console.log(this.types);
    }, error => {
      console.error('Error fetching itemType data:', error);
    })
  }

  getAllUnit() {
    this.unit.getAllUnits().subscribe(data => {
      this.units = data.units;
      console.log(this.unit);
    }, error => {
      console.error('Error fetching unit data:', error);
    })
  }

  getAllBrands() {
    this.brand.getAllbrands().subscribe(data => {
      this.brands = data.brands;
      console.log(this.brands);
    }, error => {
      console.error('Error fetching brand data:', error);
    })
  }
  warehouses: any[] = [];
  getAllWarehouses() {
    this.wareService.getAllWarehouses().subscribe(data => {
      this.warehouses = data.data;
      console.log(this.warehouses);
    }, error => {
      console.error('Error fetching warehouse data:', error);
    })
  }

  onSubmitAdd(): void {
    const formData = new FormData();
    formData.append('name', this.ItemsForm.get('name')?.value);
    formData.append('localName', this.ItemsForm.get('localName')?.value);
    formData.append('canBeSold', this.ItemsForm.get('canBeSold')?.value);
    formData.append('canBePurchased', this.ItemsForm.get('canBePurchased')?.value);
    formData.append('canBeConsumed', this.ItemsForm.get('canBeConsumed')?.value);
    formData.append('itemCategoryId', this.ItemsForm.get('itemCategoryId')?.value);
    formData.append('barcode', this.ItemsForm.get('barcode')?.value);
    formData.append('code', this.ItemsForm.get('code')?.value);
    formData.append('itemTypeId', this.ItemsForm.get('itemTypeId')?.value);
    formData.append('unitId', this.ItemsForm.get('unitId')?.value);
    formData.append('salesPrice', this.ItemsForm.get('salesPrice')?.value);
    formData.append('salesTax', this.ItemsForm.get('salesTax')?.value);
    formData.append('costCenterId', this.ItemsForm.get('costCenterId')?.value);
    formData.append('brandId', this.ItemsForm.get('brandId')?.value);
    formData.append('note', this.ItemsForm.get('note')?.value);
    formData.append('localNote', this.ItemsForm.get('localNote')?.value);
    formData.append('totalSoldQuantity', this.ItemsForm.get('totalSoldQuantity')?.value);
    formData.append('totalPurchasedQuantity', this.ItemsForm.get('totalPurchasedQuantity')?.value);
    formData.append('totalCurrentStock', this.ItemsForm.get('totalCurrentStock')?.value);
    formData.append('width', this.ItemsForm.get('width')?.value);
    formData.append('length', this.ItemsForm.get('length')?.value);
    formData.append('height', this.ItemsForm.get('height')?.value);
    formData.append('pallet', this.ItemsForm.get('pallet')?.value);
    formData.append('palletHeight', this.ItemsForm.get('palletHeight')?.value);
    formData.append('thickness', this.ItemsForm.get('thickness')?.value);
    formData.append('weight', this.ItemsForm.get('weight')?.value);
    formData.append('customField', this.ItemsForm.get('customField')?.value);

    this.itemWarehouses.controls.forEach((control, index) => {
      formData.append(`ItemWarehouses[${index}].warehouseId`, control.value.warehouseId);
      formData.append(`ItemWarehouses[${index}].openingBalance`, control.value.openingBalance);
      formData.append(`ItemWarehouses[${index}].openingPrice`, control.value.openingPrice);
      formData.append(`ItemWarehouses[${index}].unit`, control.value.unit);
      formData.append(`ItemWarehouses[${index}].unitPrice`, control.value.unitPrice);
    });

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });


    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant') || ''  // Add your tenant value here
    });

    this.http.post(this.apiUrl, formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        // alert('submit successfully');
        this.toast.success('submit successfully');
        this.getAllCategories()
      }, error => {
        console.error('Error:', error);
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.toast.error(errorMessage, 'Error');
      });

  }

  onCheckboxChange(category: any) {
    this.updateSelectAll();
    this.selectedCategory = category;  // Store the selected category data
  }

  openModalForSelected() {
    if (this.selectedCategory) {
      this.ItemsForm.patchValue({
        name: this.selectedCategory.name,
        localName: this.selectedCategory.localName,
        canBeSold: this.selectedCategory.canBeSold,
        canBePurchased: this.selectedCategory.canBePurchased,
        canBeConsumed: this.selectedCategory.canBeConsumed,
        itemCategoryId: this.selectedCategory.itemCategoryId,
        barcode: this.selectedCategory.barcode,
        code: this.selectedCategory.code,
        itemTypeId: this.selectedCategory.itemTypeId,
        unitId: this.selectedCategory.unitId,
        salesPrice: this.selectedCategory.salesPrice,
        salesTax: this.selectedCategory.salesTax,
        costCenterId: this.selectedCategory.costCenterId,
        brandId: this.selectedCategory.brandId,
        note: this.selectedCategory.note,
        localNote: this.selectedCategory.localNote,
        totalSoldQuantity: this.selectedCategory.totalSoldQuantity,
        totalPurchasedQuantity: this.selectedCategory.totalPurchasedQuantity,
        totalCurrentStock: this.selectedCategory.totalCurrentStock,
        width: this.selectedCategory.width,
        length: this.selectedCategory.length,
        height: this.selectedCategory.height,
        pallet: this.selectedCategory.pallet,
        palletHeight: this.selectedCategory.palletHeight,
        thickness: this.selectedCategory.thickness,
        weight: this.selectedCategory.weight,
        customField: this.selectedCategory.customField,


      });

      this.isModalOpen = true;
    } else {
      alert('Please select a category to update.');
    }
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateCategory() {
    if (this.ItemsForm.valid) {
      const updatedCategory = { ...this.ItemsForm.value, id: this.selectedCategory.id };

      // Call the update service method using the category's id
      this.itemCat.updateItemType(this.selectedCategory.id, updatedCategory).subscribe(
        (response) => {
          console.log('Category updated successfully:', response);
          this.toast.success('Item type updated successfully')
          // Update the local categories array if necessary
          const index = this.storesSec.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.storesSec[index] = updatedCategory;
          }

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
    } else {
      console.log(this.ItemsForm)
    }
  }


  deleteCategory() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed){
      const headers = new HttpHeaders().set('tenant', localStorage.getItem('tenant') || ''); // Replace 'your-tenant-id' with the actual tenant value
  
      this.itemCat.deleteCategoryById(this.selectedCategory.id, headers).subscribe(
        (response)=>{
          console.log('Item deleted successfully:', response);
          this.toast.success('Item deleted successfully');
          this.getAllCategories();
          this.closeModal(); 
        },error => {
          console.error('Error delete item :', error);
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

  pageNumber = 1
  pageSize = 10;

  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllCategories();
  }

  // select checkbox
selectAll = false;

selectedCount = 0;

toggleAllCheckboxes() {
  // Set each item's checked status to match selectAll
  this.storesSec.forEach(item => (item.checked = this.selectAll));
  // Update the selected count
  this.selectedCount = this.selectAll ? this.storesSec.length : 0;
}

updateSelectAll() {
  // Update selectAll if all items are checked
  this.selectAll = this.storesSec.every(item => item.checked);
  // Calculate the number of selected items
  this.selectedCount = this.storesSec.filter(item => item.checked).length;
}

}