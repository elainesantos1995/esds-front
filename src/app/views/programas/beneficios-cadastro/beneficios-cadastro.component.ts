import { Component, OnInit } from '@angular/core';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import {MenuItem} from 'primeng/api';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { FormBuilder, NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-beneficios-cadastro',
  templateUrl: './beneficios-cadastro.component.html',
  styleUrls: ['./beneficios-cadastro.component.css']
})
export class BeneficiosCadastroComponent implements OnInit {

  items: MenuItem[];
  periodicidades: any = null;

  beneficio: BeneficioDTO = { id: null,	nome: '',	justificativa: '', 
  totalRecursosAportados: null,	limiteVagas: null, controleBiometria: null,	
  controleDocumento: null,	controleCarteirinha: null,	periodicidade: '',	
  toleranciaUsosInadimplente: null,	toleranciaUsosCancelado: null, programa: null
  }

  constructor(
    private programaService: ProgramaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private httpClientModule: HttpClientModule, 
    private ngForm: NgForm
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.carregarPeriodicidade();
  }

  onSubmit(): void{

  }

  // carregamento de valores de itens de breadcrump
  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/programas', icon: 'pi pi-home'}
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

}
