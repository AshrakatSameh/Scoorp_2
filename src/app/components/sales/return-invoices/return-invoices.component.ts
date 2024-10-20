import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/getAllServices/Clients/clients.service';
import { CostCenterService } from 'src/app/services/getAllServices/CostCenter/cost-center.service';
import { PriceListService } from 'src/app/services/getAllServices/PriceList/price-list.service';
import { ProjactService } from 'src/app/services/getAllServices/Projects/projact.service';
import { RepresentativeService } from 'src/app/services/getAllServices/Representative/representative.service';
import { TeamsService } from 'src/app/services/getAllServices/Teams/teams.service';

@Component({
  selector: 'app-return-invoices',
  templateUrl: './return-invoices.component.html',
  styleUrls: ['./return-invoices.component.css']
})
export class ReturnInvoicesComponent implements OnInit {

  clients:any[]=[];
  costCenters:any[]=[];
  priceLists:any[]=[];
  representatives:any[]=[];
  teams:any[]=[];
  projects:any[]=[];
  constructor(private clientServ:ClientsService,private teamServ:TeamsService,private repServ:RepresentativeService,
    private priceServ:PriceListService,private costService: CostCenterService,
    private projectServ:ProjactService
  ){

  }
  ngOnInit(): void {
    this.getAllClients();
    this.getAllPriceLists();
    this.getAllProjects();
    this.getAllRepresentatives();
    this.getAllTeams();
    this.getcostCenters();
  }
  // buttons=['الأصناف','الملاحظات','المهام' ,'مرفقات']
  buttons=['الأصناف','الملاحظات','المهام','مرفقات']

  selectedButton: number | null = null; // To track which button is clicked

  // Method to handle button click and show content
  showContent(index: number): void {
    this.selectedButton = index;
  }
  getcostCenters() {
    this.costService.getAllCostCaners().subscribe(response => {
      this.costCenters = response.costCenters;
      //console.log(this.costCenters);
    }, error => {
      console.error('Error fetching costs data:', error)
    })
  }
  getAllPriceLists() {
    this.priceServ.getAllPriceLists().subscribe(response => {
      this.priceLists = response.data;
      //console.log(this.priceLists);
    }, error => {
      console.error('Error fetching price lists data:', error)
    })
  }
  getAllRepresentatives() {
    this.repServ.getAllRepresentative().subscribe(response => {
      this.representatives = response;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  representatives:', error)
    })
  }
  
  getAllTeams() {
    this.teamServ.getTeams().subscribe(response => {
      this.teams = response.teams;
      //console.log(this.representatives);
    }, error => {
      console.error('Error fetching  teams:', error)
    })
  }

  getAllClients() {
    this.clientServ.getCliensts().subscribe(response => {
      this.clients = response.data;
      //console.log(this.clients);
    }, error => {
      console.error('Error fetching  clients:', error)
    })
  }
  getAllProjects() {
    this.projectServ.getProjactsWithoutPag().subscribe(response => {
      this.projects = response.data;
      //console.log(this.clients);
    }, error => {
      console.error('Error fetching  projects:', error)
    })
  }
}
