import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandsService } from 'src/app/services/getAllServices/brands/brands.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { ItemcategoryService } from 'src/app/services/getAllServices/itemcategory/itemcategory.service';
import { ItemgroupService } from 'src/app/services/getAllServices/itemgroup/itemgroup.service';
import { ItemsService } from 'src/app/services/getAllServices/Items/items.service';
import { ItemTypeService } from 'src/app/services/getAllServices/itemType/item-type.service';
import { UnitService } from 'src/app/services/getAllServices/unit/unit.service';
import { environment } from 'src/environments/environment.development';

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
  costs:any[] = [];

  ItemsForm: FormGroup;

  selectedGender: string = '';
  selectedStatus: string = '';
  selectedSales: string = '';

  apiUrl= environment.apiUrl +'Items';


  buttons = [
    'المعلومات العامة ',
    'المبيعات ',
    'المرفقات',
    'المقاس',
    'المهام',
    'الحركات',
    'الانشطه',
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
    private http:HttpClient,
    private cost :CostCenterService
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
    });
  }

  ngOnInit(): void {
    this.getAllBrands();
    this.getAllCategories();
    this.getAllItemCategory();
    this.getAllItemType();
    this.getAllUnit();
    this.getAllcosts();
   
  }


getAllCategories(){
  this.itemServices.getAllItems().subscribe(
    (response) => {
      this.storesSec = response.item1; // Assign the fetched Warehouses
      console.log('items :', this.storesSec);
    },
    (error) => {
      console.error('Error fetching item types Items:', error); // Handle errors
    }
  );
}


getAllcosts(){
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

  getAllItemCategory(){
    this.itemCat.getAllitemCat().subscribe(data => {
      this.itemCategory = data.categories;
      console.log(this.itemCategory);
    }, error => {
      console.error('Error fetching itemCategory data:', error);
    })
  }

  getAllItemType(){
    this.itemType.getAllitemType().subscribe(data => {
      this.types = data.types;
      console.log(this.types);
    }, error => {
      console.error('Error fetching itemType data:', error);
    })
  }

  getAllUnit(){
    this.unit.getAllUnits().subscribe(data => {
      this.units = data.units;
      console.log(this.unit);
    }, error => {
      console.error('Error fetching unit data:', error);
    })
  }

  getAllBrands(){
    this.brand.getAllbrands().subscribe(data => {
      this.brands = data.brands;
      console.log(this.brands);
    }, error => {
      console.error('Error fetching brand data:', error);
    })
  }


  onSubmitAdd(): void {
    const formData = new FormData();
    formData.append('name', this.ItemsForm.get('name')?.value);
    formData.append('localName', this.ItemsForm.get('localName')?.value);
    formData.append('canBeSold',this.ItemsForm.get('canBeSold')?.value);
    formData.append('canBePurchased',this.ItemsForm.get('canBePurchased')?.value);
    formData.append('canBeConsumed',this.ItemsForm.get('canBeConsumed')?.value);
    formData.append('itemCategoryId',this.ItemsForm.get('itemCategoryId')?.value);
    formData.append('barcode',this.ItemsForm.get('barcode')?.value);
    formData.append('code',this.ItemsForm.get('code')?.value);
    formData.append('itemTypeId',this.ItemsForm.get('itemTypeId')?.value);
    formData.append('unitId',this.ItemsForm.get('unitId')?.value);
    formData.append('salesPrice',this.ItemsForm.get('salesPrice')?.value);
    formData.append('salesTax',this.ItemsForm.get('salesTax')?.value);
    formData.append('costCenterId',this.ItemsForm.get('costCenterId')?.value);
    formData.append('brandId',this.ItemsForm.get('brandId')?.value);
    formData.append('note',this.ItemsForm.get('note')?.value);
    formData.append('localNote',this.ItemsForm.get('localNote')?.value);
    formData.append('totalSoldQuantity',this.ItemsForm.get('totalSoldQuantity')?.value);
    formData.append('totalPurchasedQuantity',this.ItemsForm.get('totalPurchasedQuantity')?.value);
    formData.append('totalCurrentStock',this.ItemsForm.get('totalCurrentStock')?.value);
    formData.append('width',this.ItemsForm.get('width')?.value);
    formData.append('length',this.ItemsForm.get('length')?.value);
    formData.append('height',this.ItemsForm.get('height')?.value);
    formData.append('pallet',this.ItemsForm.get('pallet')?.value);
    formData.append('palletHeight',this.ItemsForm.get('palletHeight')?.value);
    formData.append('thickness',this.ItemsForm.get('thickness')?.value);
    formData.append('weight',this.ItemsForm.get('weight')?.value);
    formData.append('customField',this.ItemsForm.get('customField')?.value);


    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  

    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl, formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        alert('submit successfully');
      }, error => {
        console.error('Error:', error);
      });
    
  }
}
