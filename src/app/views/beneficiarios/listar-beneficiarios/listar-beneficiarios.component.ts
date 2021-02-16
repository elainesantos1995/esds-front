import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Beneficiario } from 'src/app/_modelos/beneficiario';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import {MenuItem} from 'primeng/api';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';

@Component({
  selector: 'app-listar-beneficiarios',
  templateUrl: './listar-beneficiarios.component.html',
  styleUrls: ['./listar-beneficiarios.component.css']
})
export class ListarBeneficiariosComponent implements OnInit {


  genero: any = null;
  estadoCivil: any = null;
  items: MenuItem[];
  home: MenuItem;
  displayModal: boolean;

  beneficiariosDTO: BeneficiarioEnderecoDTO[];

  beneficiarioSelecionadoDTO: BeneficiarioEnderecoDTO;

  beneficiarioEnderecoDTO: BeneficiarioEnderecoDTO =  {id: null, nome: '',
	sobrenome: '', dataNascimento: null, cpf: '',	rg: '', rgDataEmissao: '',
	rgOrgaoEmissor: '', sexo: this.genero, estadoCivil: this.estadoCivil, telefone1: '',
  telefone2: '', email: '', logradouro: '', numero: '', complemento: '', bairro: '', 
  cidade: '', cep: '', pontoDeReferencia: '', beneficiarioTitular: null, idEndereco: null};

  constructor(
    private beneficiariosService: ApiServiceBeneficiarios,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.beneficiariosService.buscarTodos().subscribe((beneficiariosDTO: BeneficiarioEnderecoDTO[]) => {
     this.beneficiariosDTO = beneficiariosDTO;
   });
  }

  setarBeneficiarioDTO(beneficiarioDTO: BeneficiarioEnderecoDTO): void{
    this.beneficiarioSelecionadoDTO = beneficiarioDTO;
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){
    this.beneficiariosService.deletar(this.beneficiarioSelecionadoDTO.id)
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
