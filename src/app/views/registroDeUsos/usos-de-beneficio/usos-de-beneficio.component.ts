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
	controleCarteirinha: null,  idInscricao: null,  idBeneficio: null }

  biometria: string = null;
  documento: string = null;
  carteirinha: string = null;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private inscricaoService: InscricaoService,
    private beneficiarioService: ApiServiceBeneficiarios,
    private usoDeBeneficioService: UsoDeBeneficioService
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  salvar(){    
    this.uso.controleDocumento = this.documento === "sim";
    this.uso.controleCarteirinha = this.carteirinha === "sim";
    this.uso.controleBiometria = this.biometria === "sim";

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

}
