import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private authService: AuthService) {}

  logout() {
    const tenant = localStorage.getItem('tenant');
    localStorage.clear;
    if (tenant) {
      this.authService.logout(tenant).subscribe(
        (response) => {
          console.log('Logged out successfully', response);
          // Perform any additional actions on successful logout
        },
        (error) => {
          console.error('Logout failed', error);
          // Handle error case
        }
      );
    } else {
      console.warn('No tenant found in local storage');
    }};






   // Define the object with string indexing
   isCollapsed: { [key: string]: boolean } = {
    salesMovementSub: true,
    salesManagersSub: true,
    clientsSub: true,
    salesReportsSub: true,
    settingsSub: true,
  };
  
  isCollapsed2: { [key: string]: boolean } = {
    warehouseMovementSub: true,
    warehouseManagersSub: true,
    typeSub: true,
    warehouseReportsSub: true,
    settingsSub2: true,
  };

  openSubmenus: { [key: string]: boolean } = {};

  toggleSubmenu(menuId: string) {
    // Close the currently open submenu if it's different
    for (const key in this.openSubmenus) {
      if (key !== menuId) {
        this.openSubmenus[key] = false;
      }
    }
    // Toggle the clicked submenu
    this.openSubmenus[menuId] = !this.openSubmenus[menuId];
  }

  isSubmenuOpen(menuId: string): boolean {
    return !!this.openSubmenus[menuId];
  }
  
  toggleCollapse(section: string) {
    this.isCollapsed[section] = !this.isCollapsed[section];
  }

 


  
  toggleCollapse2(section: string) {
    this.isCollapsed2[section] = !this.isCollapsed2[section];
  }


  

}
