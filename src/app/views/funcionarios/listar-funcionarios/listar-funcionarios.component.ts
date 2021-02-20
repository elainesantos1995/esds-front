import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Funcionario } from 'src/app/_modelos/funcionario';
import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';
import {MenuItem} from 'primeng/api';
import { FuncionarioEnderecoDTO } from 'src/app/dto/funcionarioEnderecoDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-funcionarios',
  templateUrl: './listar-funcionarios.component.html',
  styleUrls: ['./listar-funcionarios.component.css']
})
export class ListarFuncionariosComponent implements OnInit {

  funcionariosDTO: FuncionarioEnderecoDTO[];
  displayModal: boolean;
  funcionarioSelecionado: Funcionario = {id: null, nome:'', cpf: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '', admin: false, dataNascimento: null, matricula: '', login: '', matriculaCFESS:'', senha:'', tipo:''};
  genero: any = null;
  valorSelecionadoAdmin: boolean = false;

  funcionarioSelecionadoDTO: FuncionarioEnderecoDTO = {
    id: null, nome: '', matricula: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '',
    cpf: '', dataNascimento: null, login: '', senha: '', admin: this.valorSelecionadoAdmin, 
    matriculaCFESS: '', sexo: this.genero, tipo: '', logradouro: '', numero: '', complemento: '', bairro: '', 
    cidade: '', cep: '', pontoDeReferencia: '', email: '', telefone1: '', telefone2: '', idEndereco: null
  }
  items: MenuItem[];

  constructor(
    private funcionarioService: ApiServiceFuncionarios,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.funcionarioService.buscarTodos().subscribe((funcionariosDTO: FuncionarioEnderecoDTO[]) => {
     this.funcionariosDTO = funcionariosDTO;
     console.log(funcionariosDTO);
   });
  }

  setarFuncionario(funcionarioEnderecoDTO: FuncionarioEnderecoDTO): void{
    this.funcionarioSelecionadoDTO = funcionarioEnderecoDTO;
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){
    this.funcionarioService.deletar(this.funcionarioSelecionadoDTO.id)
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
