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

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';

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
	controleCarteirinha: null,  idInscricao: null,  idBeneficio: null,
  beneficio: null, inscricao: null}

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
      this.usoDeBeneficioService.buscarUsoDeUmBeneficiario(this.inscricao.id)
      .subscribe(response => {
        this.usosDoBeneficiario = response;
        console.log(response);
      });
  }

  converterTipo(usoDeBeneficio: UsoDeBeneficioDTO): string{
    if(usoDeBeneficio.controleBiometria){
      return 'Biometria';
    }else if(usoDeBeneficio.controleCarteirinha){
      return 'Carteirinha';
    }else{
      return 'Documento';
    }
  }

  relatorioUsosBeneficiosPorPrograma(){    
    let docDefinition2 = {
      header: 'e-SDS Relatórios',
          Headers: '',
          content: [
            {
              text: 'Usos de benefício de Programa Social',
              fontSize: 16,
              alignment: 'center',
              color: '#047886'
            },
            {
              text: 'Detalhes',
              style: 'sectionHeader'
            },
            {
              columns: [
                [
                  {
                    text: 'Beneficiário: '+ this.inscricao.beneficiario.nome,
                    bold:false
                  },
                  {
                    text: 'CPF: '+ this.inscricao.beneficiario.cpf,
                    bold:false,
                    margin: [0, 0, 0, 10]
                  },
                ],
                [
                  {
                    text: `Data: ${new Date().toLocaleString()}`,
                    alignment: 'right'
                  }
                ]
              ]
            },
            {
              table: {
                headerRows: 1,
                widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  ['Número', 'Beneficiário', 'CPF', 'Data de uso', 'Registro', 'Benefício', 'Programa', 'Edição'],  
                  ...this.usosDoBeneficiario.map(u => ([u.id, u.inscricao.beneficiario.nome, u.inscricao.beneficiario.cpf, moment(u.dataDoUso).format('DD/MM/yyyy'), this.converterTipo(u),u.beneficio.nome, u.beneficio.programa.nome, u.beneficio.programa.ano])),
                  [{text: 'Total', colSpan: 4}, {}, {}, {}, {}, {}, {}, this.usosDoBeneficiario.length]
                ]
              }
            },
            {
              text: 'OBS',
              style: 'sectionHeader'
            },
            {
                ul: [
                  'Detalha usos de benefícios de um beneficiário contemplado em programa social.',
                  'Apenas benefícios ofertados pela e-SDS - Prefeitura de Monteiro - PB.',
                  'Elaborado com base em dados atuais.',
                ],
                margin: [0, 10, 0, 10]
            },
            {  
              columns: [  
                  [{ qr: `'ID: '${this.inscricao.id}`, fit: '50' }],  
                  [{ text: 'Signature', alignment: 'right', italics: true }],  
              ]  
            },
          ],
          styles: {
            sectionHeader: {
              bold: true,
              decoration: 'underline',
              fontSize: 14,
              margin: [0, 15,0, 15]          
            }
          }
        };   
        pdfMake.createPdf(docDefinition2).open();
      
  }


}
