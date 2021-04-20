import { Component, OnInit } from '@angular/core';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { FormGroup, NgForm, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import {HttpClientModule} from '@angular/common/http';
import { ProgramaDTO } from 'src/app/dto/programaDTO';
import { ToastrService } from 'ngx-toastr';
import { BeneficioService } from 'src/app/_servicos/beneficioService';

import { Pageable } from 'src/app/_helpers/Pageable';
import {LazyLoadEvent} from 'primeng/api';

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
  toleranciaUsosInadimplente: null,	toleranciaUsosCancelado: null, programa: null,
  idPrograma: null, totalBeneficios: null
  }

  programa: ProgramaDTO = {id: null,
    nome: '',
    descricao: '',
    vigenciaInicio: null,
    vigenciaTermino: null,
    beneficiosDTO: null,
    ano: null
  };

  items: MenuItem[];
  display: boolean = false;  
  formularioDeCadastro: FormGroup;
  id: number;
  periodicidade: any = null;
  displayModal = false;

  dataArray: any = [];
  loadingDots: boolean;
  totalRecords: number;

  constructor(
    private programaService: ProgramaService,
    private router: Router,
    private toastr: ToastrService,
    private beneficiosService: BeneficioService
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.programaService.buscarTodos().subscribe((programasDTO: ProgramaDTO[]) => {
     this.programasDTO = programasDTO;
     this.totalRecords = programasDTO.length
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

    let beneficios: any = null;
    this.beneficiosService.listarBeneficiosDeUmPrograma(this.programaSelecionadoDTO.id).subscribe(response => {
      beneficios = response;
    })

    if(beneficios !== null ){
      this.toastr.error("Não é possível deletar programa com benefícios selecionados!")
    }else{
    this.programaService.deletar(this.programaSelecionadoDTO.id)
      .subscribe(response => {  
        this.toastr.success("Programa deletado com sucesso!" )
        location.reload();
        return false;      
      });
    }
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

loadDataLazy(event: LazyLoadEvent): void {
    this.loadingDots = true; 

    const pageableData: Pageable = {
        page: event.first / 5,
        size: event.rows
    };
    this.programaService.getDataPaginated(pageableData).subscribe(
        dataPaginated => {
          this.dataArray = dataPaginated;
          console.log(' pageable data:', this.dataArray);
          this.loadingDots = false; 
        },
        error => {
          console.log('error fetching paginated data', error);
        }
    );
}

}
