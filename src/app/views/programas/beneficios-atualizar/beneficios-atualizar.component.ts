import { Component, OnInit } from '@angular/core';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { ProgramaDTO } from 'src/app/dto/programaDTO';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import {MenuItem} from 'primeng/api';
import { first } from 'rxjs/operators';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-beneficios-atualizar',
  templateUrl: './beneficios-atualizar.component.html',
  styleUrls: ['./beneficios-atualizar.component.css']
})
export class BeneficiosAtualizarComponent implements OnInit {

  valorSelecionadoCarteira: boolean = false;
  valorSelecionadoBiometria: boolean = false;
  valorSelecionadoDocumento: boolean = false;
  selecaoCarteirinha: string = null;
  selecaoDocumento: string = null;
  selecaoBiometria: string = null;
  periodicidades: any = null;
  programasDTO: ProgramaDTO[];
  beneficiosDTO: BeneficioDTO[] = null;
//  beneficiosDoPrograma: BeneficioDTO[] = null;
//  programaSelecionadoDTO: ProgramaDTO;
//  beneficioSelecionadoDTO: BeneficioDTO;

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
  id: number;
  periodicidade: any = null;
  displayModal = false;  
  dataInicioVigencia: string = null;   
  dataTerminoVigencia: string = null;

  constructor(
    private beneficioService: BeneficioService,
    private programaService: ProgramaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb(); 
    this.carregarPeriodicidade();

    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      this.beneficioService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.beneficio = response;  
        this.programa = response.programa;
        this.periodicidade = response.periodicidade;

        if(this.id){          
          this.selecaoBiometria = this.beneficio.controleBiometria ? "sim": "nao";
          this.selecaoCarteirinha = this.beneficio.controleCarteirinha ? "sim": "nao";
          this.selecaoDocumento = this.beneficio.controleDocumento ? "sim": "nao";
        }else{
          this.selecaoBiometria = "nao";
          this.selecaoDocumento = "nao";
          this.selecaoCarteirinha = "nao";
        }

        this.beneficio.controleBiometria = response.controleBiometria;       
        this.beneficio.controleDocumento = response.controleDocumento;
        this.beneficio.controleCarteirinha = response.controleCarteirinha;
      },
        erroResponse => new BeneficioDTO());
      } 
  }

  onSubmit(){
    this.beneficio.periodicidade = this.periodicidade;
    this.beneficio.controleBiometria = this.selecaoBiometria === "sim";
    this.beneficio.controleCarteirinha= this.selecaoCarteirinha === "sim";
    this.beneficio.controleDocumento= this.selecaoDocumento === "sim";
    this.beneficio.idPrograma = this.programa.id;
    this.beneficioService.editar(this.id, this.beneficio).subscribe(resposta => {
      this.toastr.success("Benefício atualizado com sucesso!" )
      this.navegate(['programas/beneficios/'+this.programa.id]);
    });
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/programas/beneficios/'+this.programa.id, icon: 'pi pi-home'},
      {label:' Benefícios', url: ''}
  ];
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
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

}
