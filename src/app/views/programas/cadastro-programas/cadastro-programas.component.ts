import { Component, OnInit } from '@angular/core';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import {MenuItem} from 'primeng/api';
import { Observable } from 'rxjs';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {HttpClientModule} from '@angular/common/http';
import { ProgramaDTO } from 'src/app/dto/programaDTO';

@Component({
  selector: 'app-cadastro-programas',
  templateUrl: './cadastro-programas.component.html',
  styleUrls: ['./cadastro-programas.component.css']
})
export class CadastroProgramasComponent implements OnInit {

  beneficio: BeneficioDTO = { id: null,	nome: '',	justificativa: '', 
  totalRecursosAportados: null,	limiteVagas: null, controleBiometria: null,	
  controleDocumento: null,	controleCarteirinha: null,	periodicidade: '',	
  toleranciaUsosInadimplente: null,	toleranciaUsosCancelado: null, programa: null
  }

  programa: ProgramaDTO = {id: null,
    nome: '',
    descricao: '',
    vigenciaInicio: null,
    vigenciaTermino: null,
    beneficiosDTO: null,
  };

  display: boolean = false;  
  formularioDeCadastro: FormGroup;
  id: number;
  periodicidade: any = null;
  items: MenuItem[];   
  dataInicioVigencia: string = null;   
  dataTerminoVigencia: string = null;

  constructor(
    private programaService: ProgramaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private httpClientModule: HttpClientModule
  ) { }

  ngOnInit(): void {

    this.carregarPeriodicidade();
    this.carregarItensBreadCrumb();

    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){

      this.programaService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.programa = response;

        if(this.id){
          let funcDataInicioVigencia: Date = new Date(this.programa.vigenciaInicio);
          this.dataInicioVigencia = moment(funcDataInicioVigencia).format('yyyy-MM-DD');
          let funcDataTerminoVigencia: Date = new Date(this.programa.vigenciaTermino);
          this.dataInicioVigencia = moment(funcDataTerminoVigencia).format('yyyy-MM-DD');
        }
        this.programa.vigenciaInicio = response.vigenciaInicio;
        this.programa.vigenciaInicio = response.vigenciaTermino;
        console.log(response);
      },
        erroResponse => new ProgramaDTO());
      } 
    }

  onSubmit(): void{
    // Atualiza um programa sem benefícios
    if(this.id){
      
      this.programaService.editar(this.id, this.programa).subscribe(resposta => {
        this.toastr.success("Programa atualizado com sucesso!" )
        this.navegate(['/programas/']);
      });
    }    
    // Salva um programa 
    else{ 
      this.programaService.salvar(this.programa).subscribe(resposta => {       
        this.toastr.success("Programa cadastro com sucesso!" )
        this.navegate(['/programas/']);
      });
      }    
  }

carregarPeriodicidade(){
    this.periodicidade = [
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

// carregamento de valores de itens de breadcrump
carregarItensBreadCrumb(){
  this.items = [
    {label:' Listagem', url: 'http://localhost:4200/programas', icon: 'pi pi-home'},
    {label:' Cadastro'}
];
}


}
