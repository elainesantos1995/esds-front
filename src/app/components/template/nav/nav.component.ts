import { Component, OnInit } from '@angular/core';

import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  items: MenuItem[];

  constructor() { }  

    ngOnInit() {
        this.items = [
            {label: 'Beneficiários', routerLink: ['/beneficiarios'], routerLinkActiveOptions: {exact: false}},
            {label: 'Programas e Benefícios', url: ''},
            {label: 'Modelos de Formulários', url: ''},
            {label: 'Inscrições e Seleção', url: ''},
            {label: 'Uso de Benefícios', url: ''},
            {label: 'Relatórios', routerLink: ['/relatorios'], routerLinkActiveOptions: {exact: true}},
            {label: 'Funcionários', routerLink: ['/funcionarios'], routerLinkActiveOptions: {exact: false}},
            {label: 'Comunicação', url: ''}
            
        ];
    }

}
