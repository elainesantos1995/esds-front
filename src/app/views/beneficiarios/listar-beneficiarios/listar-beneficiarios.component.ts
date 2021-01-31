import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Beneficiario } from 'src/app/_modelos/beneficiario';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-listar-beneficiarios',
  templateUrl: './listar-beneficiarios.component.html',
  styleUrls: ['./listar-beneficiarios.component.css']
})
export class ListarBeneficiariosComponent implements OnInit {

  beneficiarios: Beneficiario[];
  genero: any = null;
  estadoCivil: any = null;
  displayModal: boolean;
  beneficiarioSelecionado: Beneficiario = {id: null, nome:'', cpf: '', rg: '', rgDataEmissao: ''
  , rgOrgaoEmissor: '', dataNascimento: null,  beneficiarioTitular: null,
  estadoCivil: this.estadoCivil, sexo: this.genero, endereco: null};
  items: MenuItem[];
  home: MenuItem;

  constructor(
    private beneficiariosService: ApiServiceBeneficiarios,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.beneficiariosService.buscarTodos().subscribe((beneficiarios: Beneficiario[]) => {
     this.beneficiarios = beneficiarios;
   });
  }

  setarBeneficiario(beneficiario: Beneficiario): void{
    this.beneficiarioSelecionado = beneficiario;
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){
    this.beneficiariosService.deletar(this.beneficiarioSelecionado.id)
      .subscribe(response => {  
        location.reload();
        return false;      
      });
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/beneficiarios', icon: 'pi pi-home'}
  ];
  }

showModalDialog() {
    this.displayModal = true;
}

}
