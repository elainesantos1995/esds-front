import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ProgramaDTO } from 'src/app/dto/programaDTO';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';
import html2canvas from 'html2canvas';
import { InscricaoSelecionadaDTO } from 'src/app/dto/InscricaoSelecionadaDTO';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-selecao',
  templateUrl: './selecao.component.html',
  styleUrls: ['./selecao.component.css']
})
export class SelecaoComponent implements OnInit {

  items: MenuItem[];
  programas: ProgramaDTO[];
  programaSelecionadoDTO: ProgramaDTO = null;
  beneficioSelecionado: BeneficioDTO = null;
  beneficios: BeneficioDTO[] = null;
  beneficiosDoPrograma: BeneficioDTO[] = null;

  inscricoes: InscricaoDTO[] = null;
  inscricaoSelecionada: InscricaoDTO;
  inscricoesselecionadas: InscricaoDTO[];

  inscricoesSelecionadasRetornadas: InscricaoSelecionadaDTO[] = null;

  inscricaoSelecionadaDTO: InscricaoSelecionadaDTO = {
  id: null,
	beneficio: '',
	status: '',
	nome: '',
	cpf: ''
}

  exportColumns: any[];

  quantidade: number = null;

  constructor(
    private toastr: ToastrService,
    private programaService: ProgramaService,
    private beneficioService: BeneficioService,
    private router: Router,
    private inscricaoService: InscricaoService
  ) { }

  ngOnInit(): void {    
    this.carregarItensBreadCrumb();
    this.carregarProgramas();
 
    // this.exportColumns = this.inscricoesselecionadas.map(col => (
    //   {title: col.id, dataKey: col.status}));
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/inscricoes', icon: 'pi pi-home'},
      {label:'Seleção'}
  ];
  }

  carregarProgramas(): void{
    this.programaService.buscarTodos().subscribe((programasDTO: ProgramaDTO[]) => {
      this.programas = programasDTO;
      console.log(this.programas)
    });
  }
  
  // buscarBeneficios(): void{
  //   this.beneficioService.buscarTodos().subscribe((beneficiosDTO: BeneficioDTO[]) => {
  //     this.beneficios = beneficiosDTO;
  //     console.log(this.beneficiosDoPrograma)
  //   });
  // }

  //Lista os benefícios de um programa para listagem 
  buscarBeneficiosDeUmPrograma(){
    this.beneficioService.listarBeneficiosDeUmPrograma(this.programaSelecionadoDTO.id)
      .subscribe((beneficios: BeneficioDTO[]) => {
        this.beneficiosDoPrograma = beneficios;
        console.log(this.beneficiosDoPrograma)
      })
  }

  // Recupera as inscrições realizadas para um benefício 
  // através do id do benefício selecionado
  buscarInscricoesDeUmBeneficio(){
    console.log(this.beneficioSelecionado.id)
    this.inscricaoService.buscarBeneficioDeUmPrograma(this.beneficioSelecionado.id)
    .subscribe((inscricoes: InscricaoDTO[]) => {
      this.inscricoes = inscricoes;
      console.log(this.inscricoes)
    })
  }

  //Recupera as inscrições para serem listadas para seleção
  buscarInscricoesSelecionadas(){
    this.inscricaoService.buscarInscricoesSelecionadas(this.beneficioSelecionado.id)
    .subscribe((inscricoes: InscricaoSelecionadaDTO[]) => {
      this.inscricoesSelecionadasRetornadas = inscricoes;
      if(inscricoes != null){
        this.toastr.info("O programa selecionado possui uma lista de inscrições selecionadas. "+
        "Você pode imprimir ou gerar uma nova lista!")
      }
      console.log(this.inscricoesSelecionadasRetornadas)
    })
  }

  //Gera uma lista de selecionados para o programa
  salvarSelecao(){

    if(this.inscricoesselecionadas === null){
      this.toastr.error("Não é possível salvar lista vazia!" )
    }else if(this.programaSelecionadoDTO === null){
      this.toastr.error("Programa vazio!" )
    }
    else if(this.beneficiosDoPrograma === null){
      this.toastr.error("Selecione os benefícios do programa!" )
    }
    else if(this.beneficioSelecionado === null){
      this.toastr.error("Selecione um benefício!" )
    }else if(this.programaSelecionadoDTO.vigenciaInicio > new Date()){
      this.toastr.error("Data de seleção excedida! Não é possível alterar a lista!" )
    }
    else{

      if(this.quantidade > this.beneficioSelecionado.limiteVagas){
        this.toastr.error("Lista selecionada ultrapassa limite de vagas!")
      }else{

      this.inscricaoService
      .salvarInscricoesSelecionadas(this.beneficioSelecionado.id, this.inscricoesselecionadas
        ).subscribe(response => {
        //  console.log(response)
        });
        this.toastr.success("Benefícios gerados com Sucesso!" )
      }
    }
  }

  //Gera PDF de lista de selecionados
  beneficiosSelecionadosPDF(){

    if(this.programaSelecionadoDTO === null){
      this.toastr.error("Selecione um programa!")
    }else if(this.beneficiosDoPrograma === null){
      this.toastr.error("Selecione os benefícios  do programa!")
    }else if(this.beneficioSelecionado === null){
      this.toastr.error("Selecione um benefício!")
    }else{

    let docDefinition2 = {
      header: 'e-SDS',
          Headers: '',
          content: [
            {
              text: 'Secretaria de Desenvolvimento Social',
              fontSize: 16,
              alignment: 'center',
              color: '#047886'
            },
            {
              text: 'BENEFICIÁRIOS SELECIONADOS',
              fontSize: 20,
              bold: true,
              alignment: 'center',
              decoration: 'underline',
              color: 'skyblue'
            },
            {
              text: 'Detalhes',
              style: 'sectionHeader',
              alignment: 'left'
            },                   

            {
              columns: [
                [
                  {
                    text: 'Programa: '+ this.programaSelecionadoDTO.nome,
                    bold:false
                  },{ text: 'Edição: ' + this.programaSelecionadoDTO.ano 
                  },
                  {
                    text: 'Benefício: '+this.beneficioSelecionado.nome,
                    bold: false
                  },
                  {
                    text: 'Limite de Vagas: '+ this.beneficioSelecionado.limiteVagas,
                    bold:false
                  },
                  {
                    text: 'Total de Recursos Aportados: '+ this.beneficioSelecionado.totalRecursosAportados,
                    bold:false,
                    margin: [0, 0, 0, 10]
                  },
                ],
                [
                  {
                    text: `Data: ${new Date().toLocaleString()}`,
                    alignment: 'right'
                  },
                  { 
                    text: `Relatório Nº : ${((Math.random() *1000).toFixed(0))}`,
                    alignment: 'right'
                  }
                ]
              ]
            },


            {
              table: {
                headerRows: 1,
                widths: ['auto', '*', 'auto'],
                body: [
                  ['Id', 'Beneficiário', 'CPF'],  
                  ...this.inscricoesSelecionadasRetornadas.map(b => ([b.id, b.nome, b.cpf])),
                  [{text: 'Total', colSpan: 3}, this.inscricoesSelecionadasRetornadas.length]
                ]
              }
            },
            {
              text: 'OBS',
              style: 'sectionHeader'
            },
            {
                ul: [
                  'Lista beneficiários da base de dados',
                  'Apenas beneficiários dos programas da SDS - Prefeitura de Monteiro - PB.',
                  'Elaborado com base em dados atuais.',
                ],
                margin: [0, 5, 0, 5]
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

  //Gerencia a quantidade de itens selecionados na tabela de seleção
  onRowSelect(event){
    this.quantidade +=1;
    if(this.quantidade > this.beneficioSelecionado.limiteVagas){
      this.toastr.info("Há mais selecionados que o número de vagas disponível. Selecione até "
      + (this.quantidade - this.beneficioSelecionado.limiteVagas) + ". inscrições!")
    }else if(this.quantidade == this.beneficioSelecionado.limiteVagas){
      this.toastr.success("Limite de vagas atingido!")
    }else{
      this.toastr.info("É necessário selecionar mais "+ 
      (this.beneficioSelecionado.limiteVagas - this.quantidade) + 
        " inscrições para atingir o limite de vagas!")
    }
  }

  //Gerencia a quantidade de itens desselecionados na tabela de seleção
  onRowUnselect(event){    
    this.quantidade -=1;
    if(this.quantidade == this.beneficioSelecionado.limiteVagas){
      this.toastr.success("Limite de vagas atingido!")
    }else if(this.quantidade > this.beneficioSelecionado.limiteVagas){
      this.toastr.info("É necessário desselecionar "+ 
      (this.quantidade - this.beneficioSelecionado.limiteVagas) + 
      " inscrições para atingir o limite de vagas!")
    }
    else{
      this.toastr.info("É necessário selecionar mais "+ 
      (this.beneficioSelecionado.limiteVagas - this.quantidade) + 
        " inscrições para atingir o limite de vagas!")
    }
  }

}
