import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  items: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
  //  this.gerarGraficoUm();
  //  this.gerarGraficoDois();
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/relatorios', icon: 'pi pi-home'}
    ];
  }

  // gerarGraficoUm(): void{
  //   this.data = {
  //     labels: ['Executado','Pendente'],
  //     datasets: [
  //         {
  //             data: [this.numero, 20],
  //             backgroundColor: [
                  
  //                 "#36A2EB",
  //                 "#FFCE56"
  //             ],
  //             hoverBackgroundColor: [
                  
  //                 "#36A2EB",
  //                 "#FFCE56"
  //             ]
  //         }]    
  //     };
  // }

  // gerarGraficoDois(): void{
  //   this.assiduidade = {
  //     labels: ['Inadimplente','Satisfatória'],
  //     datasets: [
  //         {
  //             data: [300, 50],
  //             backgroundColor: [
  //                 "rgb(7, 204, 204)",
  //                 "#36A2EB"
  //             ],
  //             hoverBackgroundColor: [
  //                 "rgb(7, 204, 204)",
  //                 "#36A2EB"
  //             ]
  //         }]    
  //       }
  // }

}
