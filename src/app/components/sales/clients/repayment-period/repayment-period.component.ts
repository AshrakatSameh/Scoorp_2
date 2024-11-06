import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentPeriodsService } from 'src/app/services/getAllServices/PaymentPeriods/payment-periods.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-repayment-period',
  templateUrl: './repayment-period.component.html',
  styleUrls: ['./repayment-period.component.css']
})
export class RepaymentPeriodComponent  implements OnInit{

  apiUrl = environment.apiUrl;
  paymentForm:FormGroup;
  constructor(private payment:PaymentPeriodsService, private http:HttpClient, private fb: FormBuilder,
    private toast:ToastrService
  ){
    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
      invoicePaymentPeriodDays: [0, Validators.required],
      description: ['', Validators.required]
     
    });
  }
  ngOnInit(): void {
    this.getPaymentPeriods();
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
    }}
  



    periods:any[]=[];
  getPaymentPeriods() {
    this.payment.getAllPaymentPeriods()
      .subscribe(data => {
        this.periods = data.paymentPeriods;
        console.log(this.periods);
      }, error => {
        console.error('Error fetching periods data:', error);
      });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.paymentForm.get('name')?.value);
    formData.append('invoicePaymentPeriodDays', this.paymentForm.get('invoicePaymentPeriodDays')?.value);
    formData.append('description', this.paymentForm.get('description')?.value)

  
    const headers = new HttpHeaders({
      'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
    });
  
    this.http.post(this.apiUrl+'PaymentPeriods', formData, { headers })
      .subscribe(response => {
        console.log('Response:', response);
        // alert('submit successfully');
        this.toast.success('Submit successfully')
        this.getPaymentPeriods();
      }, error => {
        console.error('Error:', error);
      });
  }

}
