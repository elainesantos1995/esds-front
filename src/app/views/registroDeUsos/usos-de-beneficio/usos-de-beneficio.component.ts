import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';

import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { UsoDeBeneficioDTO } from 'src/app/dto/usoDeBeneficio';
import { UsoDeBeneficioService } from 'src/app/_servicos/usoDeBeneficioService';

@Component({
  selector: 'app-usos-de-beneficio',
  templateUrl: './usos-de-beneficio.component.html',
  styleUrls: ['./usos-de-beneficio.component.css']
})
export class UsosDeBeneficioComponent implements OnInit {

  items: MenuItem[];  
  inscricao: InscricaoDTO = null;
  inscricoes: InscricaoDTO[] = null;
  cpf: string;
  beneficiario: BeneficiarioEnderecoDTO = null;

  displayModal: boolean;
  uso: UsoDeBeneficioDTO = {
   id: null, dataDoUso: null,	controleBiometria: null,	controleDocumento: null,
	controleCarteirinha: null,  idInscricao: null,  idBeneficio: null,
  beneficio: null, inscricao: null}

  biometria: string = null;
  documento: string = null;
  carteirinha: string = null;

  //Dropdown de tipos
  tipos: any = null;
  tipoSelecionado: any = null;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private inscricaoService: InscricaoService,
    private beneficiarioService: ApiServiceBeneficiarios,
    private usoDeBeneficioService: UsoDeBeneficioService
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.carregarTipos();
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  salvar(){  
    
    this.converterTipoDeUso(this.tipoSelecionado)

    this.usoDeBeneficioService.salvar(this.inscricao.id, this.uso).subscribe(response => {
      console.log(response)
      this.toastr.success("Registro realizado com sucesso!");
      location.reload();
    })
  }

  buscarBeneficiarioPeloCPF(){
    this.beneficiarioService.buscarPorCPF(this.cpf).subscribe(response => {
      this.beneficiario = response;
      if(response === null){
        this.toastr.error("Inscrição com CPF informado não encontrada!");
      }
    });
  }

  buscarInscricoesDeUmBeneficiario(){
    this.inscricaoService.listarInscricoesDeUmBeneficiario(this.beneficiario.id).subscribe(response => {
      this.inscricoes = response;
      if(response.length === 0){
        this.toastr.error("Não encontradas inscrições contempladas para o CPF informado!");
        location.reload();
      }
    })
  }
  
  carregarItensBreadCrumb(){
    this.items = [
      {label:' Uso de Benefício', url: 'http://localhost:4200/usos', icon: 'pi pi-home'}
  ];
  }

  showModalDialog() {
    this.displayModal = true;
  }

  setarInscricao(inscricao: InscricaoDTO): void{
    this.inscricao = inscricao;
  }

  carregarTipos(){
    this.tipos = [
      {name: 'Carteirinha', value: 'true'},
      {name: 'Documento', value: 'true'},
      {name: 'Biometria', value: 'true'}
  ];
  }

  //Método pra setar o tipo de uso 
  converterTipoDeUso(tipo: string){
    if(tipo === 'Carteirinha'){
      this.uso.controleDocumento = false;
      this.uso.controleCarteirinha = true;
      this.uso.controleBiometria = false;
    }else if(tipo === 'Documento'){
      this.uso.controleDocumento = true;
      this.uso.controleCarteirinha = false;
      this.uso.controleBiometria = false;
    }else{
      this.uso.controleDocumento = false;
      this.uso.controleCarteirinha = false;
      this.uso.controleBiometria = true;
    }
  }

}
