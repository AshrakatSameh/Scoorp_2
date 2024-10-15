import { Component } from '@angular/core';

@Component({
  selector: 'app-work-serveces-reqs',
  templateUrl: './work-serveces-reqs.component.html',
  styleUrls: ['./work-serveces-reqs.component.css']
})
export class WorkServecesReqsComponent {
  buttons=['التعليقات','المرفقات','وصف العمل']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }
}
