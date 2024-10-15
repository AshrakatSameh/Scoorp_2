import { Component } from '@angular/core';

@Component({
  selector: 'app-return-invoices',
  templateUrl: './return-invoices.component.html',
  styleUrls: ['./return-invoices.component.css']
})
export class ReturnInvoicesComponent {

  // buttons=['الأصناف','الملاحظات','المهام' ,'مرفقات']
  buttons=['الأصناف','الملاحظات','المهام','مرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }
}
