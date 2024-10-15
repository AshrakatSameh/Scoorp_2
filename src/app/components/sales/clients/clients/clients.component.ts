import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { SupervisorService } from 'src/app/services/getAllServices/Supervisors/supervisor.service';
import { TagService } from 'src/app/services/getAllServices/Tag/tag.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  apiUrl = `${environment.apiUrl}Clients/CreateClient`


  pageNumber: number = 1;
  pageSize: number = 10;
  clients:any[]=[];
  supervisors:any[]=[];
  tags:any[]=[];


  clientForm: FormGroup;

  constructor(private clientService: ClientsService, private fb:FormBuilder,
    private supervisorService: SupervisorService, private tagService:TagService, private http:HttpClient
  ){
    this.clientForm = this.fb.group({
      name:['', Validators.required],
      localName:['', Validators.required],
      phone:['', Validators.required],
      email:['', Validators.required],
      code:['', Validators.required],
      tagId:['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getAllClients();
    this. getAllTags();
  }

  buttons = ['المعلومات الأساسية', 'المواقع والفروع', 'المرفقات', 'المهام', 'الحساب البنكي',
    'الأشعارات والتذكير','التقارير','معلومات التواصل', 'بيانات للضريبه','الإستبيانات']
  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }

  getAllClients(){
    this.clientService.getAllCliensts(this.pageNumber, this.pageSize).subscribe(response=>{
        this.clients= response.data;
        console.log(this.clients);
      }, error =>{
        console.error('Error fetching clients data:' , error)
      })
      
    }
    getAllTags(){
      this.tagService.getUserTags().subscribe(response=>{
          this.tags= response;
          console.log(this.tags);
        }, error =>{
          console.error('Error fetching tags data:' , error)
        })
        
      }


    onSubmit() {
      const formData = new FormData();
      const name = this.clientForm.get('name')!.value;
      const localName = this.clientForm.get('localName')!.value;
      const phone = this.clientForm.get('phone')!.value;
      const email = this.clientForm.get('email')!.value;
      const code = this.clientForm.get('code')!.value;
      const tagId = this.clientForm.get('tagId')!.value;
      
      if (name) {
        formData.append('name', name);
        formData.append('localName', localName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('code', code);
        formData.append('tagId', tagId);
        
  
        
      } else {
        console.error('One or more form fields are null');
        return;
      }
  
      const tenantId = localStorage.getItem('tenant');
      const headers = new HttpHeaders({
        tenant: tenantId || '', // Set tenantId header if available
        'Content-Type': 'application/json',
      });
      const url = `${this.apiUrl}?Name=${encodeURIComponent(name)}&LocalName=${encodeURIComponent(localName)}&Phone=${encodeURIComponent(phone)}&Email=${encodeURIComponent(email)}&Code=${encodeURIComponent(code)}&TagId=${encodeURIComponent(tagId)}`;
      this.http.post<any>(url, formData,{headers}).subscribe(
        (response) => {
          alert('Done');
          console.log('Client created successfully:', response);
          // Reset form after successful submission
          this.clientForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Error creating Client:', error.error);
          // Handle error
        }
      );
    }

    changePage(newPageNumber: number): void {
      this.pageNumber = newPageNumber;
      console.log(this.pageNumber)
      this.getAllClients();
    }
}
