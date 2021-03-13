import { Component, OnInit } from '@angular/core';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { FormGroup, NgForm, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import {HttpClientModule} from '@angular/common/http';
import { ProgramaDTO } from 'src/app/dto/programaDTO';

@Component({
  selector: 'app-listagem-programas',
  templateUrl: './listagem-programas.component.html',
  styleUrls: ['./listagem-programas.component.css']
})
export class ListagemProgramasComponent implements OnInit {

  programasDTO: ProgramaDTO[];
  programaSelecionadoDTO: ProgramaDTO;

  beneficio: BeneficioDTO = { id: null,	nome: '',	justificativa: '', 
  totalRecursosAportados: null,	limiteVagas: null, controleBiometria: null,	
  controleDocumento: null,	controleCarteirinha: null,	periodicidade: '',	
  toleranciaUsosInadimplente: null,	toleranciaUsosCancelado: null, programa: null, idPrograma: null
  }

  programa: ProgramaDTO = {id: null,
    nome: '',
    descricao: '',
    vigenciaInicio: null,
    vigenciaTermino: null,
    beneficiosDTO: null
  };

  items: MenuItem[];
  display: boolean = false;  
  formularioDeCadastro: FormGroup;
  id: number;
  periodicidade: any = null;
  displayModal = false;

  constructor(
    private programaService: ProgramaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.programaService.buscarTodos().subscribe((programasDTO: ProgramaDTO[]) => {
     this.programasDTO = programasDTO;
     console.log(programasDTO)
   });
  }

  setarProgramaDTO(programaDTO: ProgramaDTO): void{
    this.programaSelecionadoDTO = programaDTO;
  }

  // Navegação entre views
  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){
    this.programaService.deletar(this.programaSelecionadoDTO.id)
      .subscribe(response => {  
        location.reload();
        return false;      
      });
  }

  // carregamento de valores de itens de breadcrump
  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/programas', icon: 'pi pi-home'}
  ];
  }

  // Exibe modal para deleção
showModalDialog() {
    this.displayModal = true;
}

}
