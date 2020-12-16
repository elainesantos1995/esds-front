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
            {label: 'Beneficiários', routerLink: ['']},
            {label: 'Programas e Benefícios', url: ''},
            {label: 'Modelos de Formulários', url: ''},
            {label: 'Inscrições e Seleção', url: ''},
            {label: 'Uso de Benefícios', url: ''},
            {label: 'Relatórios', routerLink: ['/relatorios']},
            {label: 'Entrevistadores', routerLink: ['/funcionarios']},
            {label: 'Facilitadores', url: ''},
            {label: 'Assistentes Sociais', url: ''},
            {label: 'Comunicação', url: ''}
            
        ];
    }

}
