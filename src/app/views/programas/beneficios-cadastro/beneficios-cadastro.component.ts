import { Component, OnInit } from '@angular/core';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import {ProgramaDTO} from 'src/app/dto/programaDTO';
import {MenuItem} from 'primeng/api';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficios-cadastro',
  templateUrl: './beneficios-cadastro.component.html',
  styleUrls: ['./beneficios-cadastro.component.css']
})
export class BeneficiosCadastroComponent implements OnInit {

  idPrograma: number;
  idBeneficio: number;
  periodicidade: any = null;

  items: MenuItem[];
  periodicidades: any = null;

  beneficio: BeneficioDTO = { id: null,	nome: '',	justificativa: '', 
  totalRecursosAportados: null,	limiteVagas: null, controleBiometria: null,	
  controleDocumento: null,	controleCarteirinha: null,	periodicidade: '',	
  toleranciaUsosInadimplente: null,	toleranciaUsosCancelado: null, 
  programa: null, idPrograma: null, totalBeneficios: null
  }

  programa: ProgramaDTO = {id: null,
    nome: '',
    descricao: '',
    vigenciaInicio: null,
    vigenciaTermino: null,
    beneficiosDTO: null,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private beneficioService: BeneficioService,
    private toastr: ToastrService,
    private programaService: ProgramaService
  ) { }

  ngOnInit(): void {
      this.idPrograma = this.activatedRoute.snapshot.params['id'];    
      if(this.idPrograma){
        this.programaService.buscarPorId(this.idPrograma)
        .pipe(first())
        .subscribe(response => {
          this.programa = response;
          console.log(response);
        },
          erroResponse => new ProgramaDTO());
        }
    
    this.carregarItensBreadCrumb();
    this.carregarPeriodicidade();  
  }

  onSubmit(): void{

    if(this.idBeneficio){
      this.beneficio.periodicidade = this.periodicidade;
      this.beneficioService.editar(this.idBeneficio, this.beneficio).subscribe(resposta => {
        this.toastr.success("Benefício atualizado com sucesso!" )
        this.navegate(['programas/beneficios/'+this.idPrograma]);
      });
    }    
    else{ 
      this.beneficio.periodicidade = this.periodicidade;
       this.beneficioService.salvar(this.beneficio, this.idPrograma)
      .subscribe(resposta => {       
        this.toastr.success("Benefício cadastrado com sucesso!" )
        this.navegate(['programas/beneficios/'+this.idPrograma]);
      });
      }
    }

  // carregamento de valores de itens de breadcrumb
  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/programas', icon: 'pi pi-home'},
      {label:' Cadastro de benefícios', url: ''}
  ];
  }

  carregarPeriodicidade(){
    this.periodicidades = [
      {name: 'Diária', value: 'DIARIA'},
      {name: 'Semanal', value: 'SEMANAL'},
      {name: 'Quinzenal', value: 'QUINZENAL'},
      {name: 'Mensal', value: 'MENSAL'},
      {name: 'Bimestral', value: 'BIMESTRAL'},
      {name: 'Trimestral', value: 'TRIMESTRAL'},
      {name: 'Sazonal', value: 'SAZONAL'}
    ];
  }

  // Faz  navegação entre views
navegate(url: string[]): any{
  this.router.navigate(url);
}


}
