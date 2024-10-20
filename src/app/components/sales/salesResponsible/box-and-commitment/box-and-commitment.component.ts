import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvenantBoxService } from 'src/app/services/getAllServices/ConvenantBox/convenant-box.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-box-and-commitment',
  templateUrl: './box-and-commitment.component.html',
  styleUrls: ['./box-and-commitment.component.css']
})
export class BoxAndCommitmentComponent {

  // conBoxForm={
  //   CovenantBoxName:'',
  //   Code:'',
  //   Description:''
  // }
  convBoxForm:FormGroup;
  constructor(private convenantBox:ConvenantBoxService,private http:HttpClient, private fb:FormBuilder){
    this.convBoxForm= this.fb.group({
      covenantBoxName: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      
  });


this.getAllConvenantBoxes();

}
 
apiUrl=environment.apiUrl;


onSubmit() {
  const formData = new FormData();
  formData.append('covenantBoxName', this.convBoxForm.get('covenantBoxName')?.value);
  formData.append('code', this.convBoxForm.get('code')?.value);
  formData.append('description', this.convBoxForm.get('description')?.value);

  const headers = new HttpHeaders({
    'tenant': localStorage.getItem('tenant')||''  // Add your tenant value here
  });

  this.http.post(this.apiUrl+'CovenantBox', formData, { headers })
    .subscribe(response => {
      console.log('Response:', response);
      alert('submit successfully');
    }, error => {
      console.error('Error:', error);
    });
}
convenantBoxes:any[]=[];
getAllConvenantBoxes() {
  this.convenantBox.getConvenantBoxes().subscribe(response => {
    this.convenantBoxes = response;
    //console.log(this.salesOffers);
  }, error => {
    console.error('Error fetching sales data:', error)
  })
}


}
