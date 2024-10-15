import { Component } from '@angular/core';

@Component({
  selector: 'app-storehouse-transportation',
  templateUrl: './storehouse-transportation.component.html',
  styleUrls: ['./storehouse-transportation.component.css']
})
export class StorehouseTransportationComponent {
  buttons=['الاصناف','التعليقات','المهام','المرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }
}
