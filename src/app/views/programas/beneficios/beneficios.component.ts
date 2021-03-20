import { Component, OnInit } from '@angular/core';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import {MenuItem} from 'primeng/api';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import * as moment from 'moment';
import { ProgramaDTO } from 'src/app/dto/programaDTO';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {

  programasDTO: ProgramaDTO[];
  beneficiosDTO: BeneficioDTO[] = null;
  beneficiosDoPrograma: BeneficioDTO[] = null;
  programaSelecionadoDTO: ProgramaDTO;
  beneficioSelecionadoDTO: BeneficioDTO;

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
    beneficiosDTO: this.beneficiosDTO
  };

  items: MenuItem[];
  display: boolean = false;  
  formularioDeCadastro: FormGroup;
  id: number;
  periodicidade: any = null;
  displayModal = false;  
  dataInicioVigencia: string = null;   
  dataTerminoVigencia: string = null;

  constructor(
    private programaService: ProgramaService,
    private router: Router,
    private beneficioService: BeneficioService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {   

    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){

      this.programaService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.programa = response;
  
        let funcDataInicioVigencia: Date = new Date(this.programa.vigenciaInicio);
        this.dataInicioVigencia = moment(funcDataInicioVigencia).format('yyyy-MM-DD');
          
        let funcDataTerminoVigencia: Date = new Date(this.programa.vigenciaTermino);
        this.dataTerminoVigencia = moment(funcDataTerminoVigencia).format('yyyy-MM-DD');       
        
      },
        erroResponse => new ProgramaDTO());
      } 

    this.carregarItensBreadCrumb();    
    this.buscarBeneficios();
    this.buscarBeneficiosDoPrograma();
  }

  buscarBeneficios(): void{
  this.beneficioService.buscarTodos().subscribe((beneficiosDTO: BeneficioDTO[]) => {
    this.beneficiosDTO = beneficiosDTO;
  //  console.log(this.beneficiosDTO.length)
  });
  }

  buscarBeneficiosDoPrograma(): void{
    this.beneficioService.listarBeneficiosDeUmPrograma(this.id)
    .subscribe((beneficiosDTO: BeneficioDTO[]) => {
      this.beneficiosDoPrograma = beneficiosDTO;
    //  console.log(this.beneficiosDoPrograma.length)
    });
  }

  setarProgramaDTO(programaDTO: ProgramaDTO): void{
    this.programaSelecionadoDTO = programaDTO;
  }

  setarBeneficioDTO(beneficioDTO: BeneficioDTO){
    this.beneficioSelecionadoDTO = beneficioDTO;
  }

  // Navegação entre views
  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){
    this.beneficioService.deletar(this.beneficioSelecionadoDTO.id)
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
