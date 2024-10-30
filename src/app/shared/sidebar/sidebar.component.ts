import { Component, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  // isCollapsed: { [key: string]: boolean } = {};

  // constructor() {
  //   // Initialize all sub-items to collapsed
  //   this.isCollapsed['salesMovementSub'] = true;
  //   this.isCollapsed['salesManagersSub'] = true;
  //   this.isCollapsed['clientsSub'] = true;
  //   this.isCollapsed['salesReportsSub'] = true;
  //   this.isCollapsed['settingsSub'] = true;
  //   // Add more as needed...
  // }

  // toggleCollapse(item: string) {
  //   this.isCollapsed[item] = !this.isCollapsed[item];
  // }

  constructor(private authService: AuthService,    private renderer: Renderer2,
  ) {
   
  }

  isCollapsed: { [key: string]: boolean } = {
    salesMovementSub: true,
    salesManagersSub: true,
    clientsSub: true,
    salesReportsSub: true,
    settingsSub: true
  };

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
  //  isCollapsed: { [key: string]: boolean } = {
  //   salesMovementSub: true,
  //   salesManagersSub: true,
  //   clientsSub: true,
  //   salesReportsSub: true,
  //   settingsSub: true,
  // };
  
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

  isSidebarCollapsed: boolean = false;

  // toggleSidebar() {
  //   this.isSidebarCollapsed = !this.isSidebarCollapsed;
  // }


  

 


  
  toggleCollapse2(section: string) {
    this.isCollapsed2[section] = !this.isCollapsed2[section];
  }


   // Track collapsed states
   isCollapsed3: { [key: string]: boolean } = {
    mainMenu: true,
    projectsMovementSub: true,
    contractsMovementSub: true
  };

  // Toggle collapse based on section key
  toggleCollapse3(section: string) {
    this.isCollapsed3[section] = !this.isCollapsed3[section];
  }

  // Track collapsed states
  isCollapsed4: { [key: string]: boolean } = {
    charts: true,

    warehouseMovementSub: true,
    warehouseManagersSub: true,
    typeSub: true,
    warehouseReportsSub: true,
    settingsSub2: true,
  };

  // Toggle collapse based on section key
  toggleCollapse4(section: string) {
    this.isCollapsed4[section] = !this.isCollapsed4[section];
  }

  // isSidebarVisible: boolean = true;

  // toggleSidebar() {
  //   this.isSidebarVisible = !this.isSidebarVisible;

  //   const contentElement = document.getElementById('main-content');
  //   if (this.isSidebarVisible) {
  //     this.renderer.addClass(contentElement, 'expanded');
  //   } else {
  //     this.renderer.removeClass(contentElement, 'expanded');
  //   }
  // }
}
