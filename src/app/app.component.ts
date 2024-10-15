import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  names:any[]=[]
  constructor(){
    this.names= [
      {id: 1 , name: 'ash'},
      {id: 2 , name: 'ash'},
      {id: 3 , name: 'ash'},
      {id: 4 , name: 'ash'}
    ]
  }
  // constructor(private translate: TranslateService, private router: Router) {
  //   translate.use('ar')
  // }
  title = 'scoorp';
}
