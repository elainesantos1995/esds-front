import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Funcionario } from 'src/app/_modelos/funcionario';
import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-listar-funcionarios',
  templateUrl: './listar-funcionarios.component.html',
  styleUrls: ['./listar-funcionarios.component.css']
})
export class ListarFuncionariosComponent implements OnInit {

  funcionarios: Funcionario[];
  displayModal: boolean;
  funcionarioSelecionado: Funcionario = {id: null, nome:'', cpf: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '', admin: false, dataNascimento: null, matricula: '', login: '', matriculaCFESS:'', senha:'', tipo:''};
  items: MenuItem[];

  constructor(
    private funcionarioService: ApiServiceFuncionarios,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.funcionarioService.buscarTodos().subscribe((funcionarios: Funcionario[]) => {
     this.funcionarios = funcionarios;
     console.log(funcionarios);
   });
  }

  setarFuncionario(funcionario: Funcionario): void{
    this.funcionarioSelecionado = funcionario;
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){
    this.funcionarioService.deletar(this.funcionarioSelecionado.id)
      .subscribe(response => {  
        location.reload();
        return false;      
      });
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/funcionarios', icon: 'pi pi-home'}
  ];
  }

showModalDialog() {
    this.displayModal = true;
}

}