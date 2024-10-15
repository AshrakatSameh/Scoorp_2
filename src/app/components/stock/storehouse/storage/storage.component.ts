import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WarehouseService } from 'src/app/services/getAllServices/Warehouse/warehouse.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit{

  myForm!: FormGroup;
  pageNumber: number = 1;
  pageSize: number = 3;
  public wares:any[]=[];
  constructor(private servvice: WarehouseService){}
  ngOnInit(): void {
    this.getAllWares()
  }

  getAllWares(){
  this.servvice.getWarehouses(this.pageNumber, this.pageSize)
      .subscribe(data => {
        this.wares = data.data;
        console.log(this.wares);
      }, error => {
        console.error('Error fetching tenant data:', error);
      });
    }

     // Called when the user changes the page number (e.g. via pagination controls)
  changePage(newPageNumber: number): void {
    this.pageNumber = newPageNumber;
    console.log(this.pageNumber)
    this.getAllWares();
  }
}
