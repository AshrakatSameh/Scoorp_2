import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showHeaderFooter = true;
  constructor(private router: Router){
   // Listen to routing events
   this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // Check if the current route is 'dashboard' and hide the header/footer if true
      this.showHeaderFooter = this.router.url !== '/forgetPassword' &&
     this.router.url !== '/login'&&
     this.router.url !== '/';

    }
  });
  }
  // constructor(private translate: TranslateService, private router: Router) {
  //   translate.use('ar')
  // }
  title = 'scoorp';


   
}
