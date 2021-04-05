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
            {label: 'Programas e Benefícios', routerLink: ['/programas'], routerLinkActiveOptions: {exact: false}},
            {label: 'Formulário Socioeconômico', routerLink: ['/dados'], routerLinkActiveOptions: {exact: false}},
            {label: 'Inscrições e Seleção', routerLink: ['/inscricoes'], routerLinkActiveOptions: {exact: false}},
            {label: 'Uso de Benefícios', routerLink: ['usos'], routerLinkActiveOptions: {exact: false}},
            {label: 'Relatórios', routerLink: ['/relatorios'], routerLinkActiveOptions: {exact: false}},
            {label: 'Funcionários', routerLink: ['/funcionarios'], routerLinkActiveOptions: {exact: false}},
            {label: 'Comunicação', url: ''}
            
        ];
    }

}
