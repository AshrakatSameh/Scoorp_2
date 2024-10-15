import { Component } from '@angular/core';

@Component({
  selector: 'app-receive-voucher',
  templateUrl: './receive-voucher.component.html',
  styleUrls: ['./receive-voucher.component.css']
})
export class ReceiveVoucherComponent {
  buttons = ['الأصناف', 'الملاحظات', 'المهام', 'مرفقات']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }
}
