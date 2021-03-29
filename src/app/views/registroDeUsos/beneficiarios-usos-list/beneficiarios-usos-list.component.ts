import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';

import { first } from 'rxjs/operators';

import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { UsoDeBeneficioDTO } from 'src/app/dto/usoDeBeneficio';
import { UsoDeBeneficioService } from 'src/app/_servicos/usoDeBeneficioService';

@Component({
  selector: 'app-beneficiarios-usos-list',
  templateUrl: './beneficiarios-usos-list.component.html',
  styleUrls: ['./beneficiarios-usos-list.component.css']
})
export class BeneficiariosUsosListComponent implements OnInit {

  id: null;
  items: MenuItem[];  
  inscricao: InscricaoDTO = null;
  inscricoes: InscricaoDTO[] = null;
  cpf: string;
  beneficiario: BeneficiarioEnderecoDTO = null;

  displayModal: boolean;
  uso: UsoDeBeneficioDTO = {
   id: null, dataDoUso: null,	controleBiometria: null,	controleDocumento: null,
	controleCarteirinha: null,  idInscricao: null,  idBeneficio: null }

  biometria: string = null;
  documento: string = null;
  carteirinha: string = null;

  usosDoBeneficiario: UsoDeBeneficioDTO[] = null;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private inscricaoService: InscricaoService,
    private beneficiarioService: ApiServiceBeneficiarios,
    private usoDeBeneficioService: UsoDeBeneficioService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];    
    console.log(this.id)
    if(this.id){
      this.inscricaoService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.inscricao = response;
        this.buscarUsosDeBeneficiosDeUsuario();
        console.log(response)
      });
    }
    
    this.carregarItensBreadCrumb();
  }  

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Uso de Benefício', url: 'http://localhost:4200/usos', icon: 'pi pi-home'},
      {label: 'Benefícios do Usuário'}
  ];
  }

  buscarUsosDeBeneficiosDeUsuario(){
  //  if(this.inscricao.id){
      this.usoDeBeneficioService.buscarUsoDeUmBeneficiario(this.inscricao.id)
      .subscribe(response => {
        this.usosDoBeneficiario = response;
        console.log(response);
      });
  //  }
  }


}
