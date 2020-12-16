import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  data: any;
  assiduidade: any;

  constructor() {
    this.data = {
      labels: ['Executado','Pendente'],
      datasets: [
          {
              data: [220, 80],
              backgroundColor: [
                  
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]    
      };

      this.assiduidade = {
        labels: ['Inadimplente','Satisfatória'],
        datasets: [
            {
                data: [300, 50],
                backgroundColor: [
                    "rgb(7, 204, 204)",
                    "#36A2EB"
                ],
                hoverBackgroundColor: [
                    "rgb(7, 204, 204)",
                    "#36A2EB"
                ]
            }]    
          }
   }

  ngOnInit(): void {
  }

}
