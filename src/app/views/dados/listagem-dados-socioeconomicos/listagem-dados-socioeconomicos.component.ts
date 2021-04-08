import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Route, ActivatedRoute, Router } from '@angular/router';

import { DadosSocioeconomicosDTO } from 'src/app/dto/dadosSocioeconomicosDTO';
import { DadosSocioeconomicosService } from 'src/app/_servicos/dadosSocioeconomicosService';
import { Observable } from 'rxjs';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { ToastrService } from 'ngx-toastr';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';

import { first } from 'rxjs/operators';


@Component({
  selector: 'app-listagem-dados-socioeconomicos',
  templateUrl: './listagem-dados-socioeconomicos.component.html',
  styleUrls: ['./listagem-dados-socioeconomicos.component.css']
})
export class ListagemDadosSocioeconomicosComponent implements OnInit {

  displayModal: boolean;
  
  idBeneficiario: number;
  cpfBeneficiario: string;
  beneficiarioEnderecoDTO: BeneficiarioEnderecoDTO = null;
  beneficiarios: BeneficiarioEnderecoDTO[] = null;
  items: MenuItem[];
  dadosSelecionado: DadosSocioeconomicosDTO;
  dadosSocioeconomicos: DadosSocioeconomicosDTO[] = null;

  dados: DadosSocioeconomicosDTO = {
    id: null,	temBanheiro: null, aguaEncanada: null,
      energiaEletrica: null, coletaEsgoto: null, familiaIndigena: null, familiaQuilombola: null,
      membroEmpregado: null, doencaCronica: null, membroDeficiente: null,
      composicaoDomicilio: '', localidade: '', condicaoResidencia: '', quantComodos: '',	
      quantMembrosFamilia: '', quantMembrosIdosos: '', tipoDeTrabalho: '', rendaPerCapita: '',
      quantMembrosCriancas: '',	nomesMembrosFamilia: null, rendaFamiliar: null,	
      doencasCronicas: null, quantMembroDeficiente: null, tipoDeficiencia: null, 
      idBeneficiario: '', cpfBeneficiario: '', dataPreenchimento: null,
	    dataUltimaAtualizacao: null, pontuacao: null, beneficiarioTitular: null, parecer: ''
  }

  dataPreenchimento: string = null;
  dataAtualizacao: string = null;

  constructor(
    private router: Router,
    private dadosSocioeconomicoService: DadosSocioeconomicosService,
    private beneficiariosService: ApiServiceBeneficiarios,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.buscarDadosBeneficiarioTodos();
  }   

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Home', url: 'http://localhost:4200/dados', icon: 'pi pi-home'}
  ];
  }

  buscarDadosBeneficiarioTodos(){
    this.dadosSocioeconomicoService.buscarTodos().subscribe((dados: DadosSocioeconomicosDTO[]) => {
      this.dadosSocioeconomicos = dados;
      console.log('Aqui dados')
      console.log(this.dadosSocioeconomicos)
    });
  }

  setarDadosDTO(dados: DadosSocioeconomicosDTO): void{
    this.dadosSelecionado = dados;
  }

  showModalDialog() {
    this.displayModal = true;
  }

  deletar(){
    this.dadosSocioeconomicoService.deletar(this.dadosSelecionado.id)
      .subscribe(response => { 
        this.toastr.success("Dados deletados com sucesso!" ) 
        location.reload();
        return false;      
      });
  }

  buscarBeneficiarioCPF(){
    this.beneficiariosService.buscarPorCPF(this.cpfBeneficiario)
    .pipe(first())
    .subscribe(response => {
      this.beneficiarioEnderecoDTO = response;  
      console.log(this.beneficiarioEnderecoDTO)
    },
    erroResponse => new BeneficiarioEnderecoDTO());
  } 

  // Faz a navegação
  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  //Gera PDF com dos dados do beneficiário para que ele possa assinar
  gerarPdf(dados: DadosSocioeconomicosDTO){
  let docDefinition = {  
    content: [  
        [
        {  
            text: 'Dados do Formulário de Cadastro de Beneficiário - SDS',  
            style: 'sectionHeader',
            alignment: 'center'             
        } 
      ],
      [
        {  
          text: 'Dados Pessoais: ',
          fontSize: 14,
          bold: true,
          margin: [0, 5, 5, 15]  
        },
        {  
          text: 'Nome: '+ dados.beneficiarioTitular.nome  
        },
        {  
          text: 'Data de Nascimento: '+ dados.beneficiarioTitular.dataNascimento 
        }, 
        {  
          text: 'Estato Civil: '+ dados.beneficiarioTitular.estadoCivil  
        }, 
        {  
          text: 'CPF: '+dados.beneficiarioTitular.cpf              
        }, 
        {  
          text: 'RG: '+dados.beneficiarioTitular.rg
        }, 
        {  
          text: 'Telefone 1: '+dados.beneficiarioTitular.telefone1
        },
        {  
          text: 'Telefone 2: '+dados.beneficiarioTitular.telefone2
        },
        {  
          text: 'e-mail: '+dados.beneficiarioTitular.email,
          margin: [0, 0, 0, 10]  
        },
      ],
      [
        {  
          text: 'Dados Socioeconômicos: ',
          fontSize: 14,
          bold: true,
          margin: [0, 5, 5, 10]  
        },
        {  
          text: 'Condições de moradia: ',
          fontSize: 14,
          bold: true,
          margin: [0, 5, 5, 0]  
        },
        {  
          text: dados.temBanheiro ? "Possui sanitário: Sim" : "Possui sanitário: Não"
        },
        {  
          text: dados.aguaEncanada ? "Possui água encanada: Sim" : "Possui água encanada: Não"
        },
        {  
          text: dados.energiaEletrica ? "Possui energia elétrica: Sim" : "Possui energia elétrica: Não"
        },
        {  
          text: dados.coletaEsgoto ? "Possui coleta de esgoto: Sim" : "Possui coleta de esgoto: Não"
        },
        {  
          text: dados.composicaoDomicilio ? "Composição da residência: Sim" : "Composição da residência: Não"
        },
        {  
          text: 'Zona: '+dados.localidade
        },
        {  
          text: 'Condição da residência: '+dados.condicaoResidencia
        },
        {  
          text: 'Quantidade de cômodos: '+dados.quantComodos
        },
        {  
          text: 'Dados da família: ',
          fontSize: 14,
          bold: true,
          margin: [0, 5, 5, 0]  
        },
        {  
          text: dados.familiaIndigena ? "Família indígena: Sim" : "Família indígena: Não"
        },
        {  
          text: dados.familiaQuilombola ? "Família quilombola: Sim" : "Família quilombola: Não"
        },
        {  
          text: dados.membroEmpregado ? "Membros empregados: Sim" : "Membros empregados: Não"
        },
        {  
          text: dados.doencaCronica ? "Membros com doenças crônicas: Sim" : "Membros com doenças crônicas: Não"
        },
        {  
          text: dados.membroDeficiente ? "Membros com deficiência: Sim" : "Membros com deficiência: Não"
        },      
        {  
          text: 'Condições Sociais: ',
          fontSize: 14,
          bold: true,
          margin: [0, 5, 5, 0]  
        },
        {  
          text: 'Quant. membros da família: '+dados.quantMembrosFamilia
        },
        {  
          text: 'Quant. idosos: '+dados.quantMembrosIdosos
        },
        {  
          text: 'Quant. crianças: '+dados.quantMembrosCriancas
        },
        {  
          text: 'Tipo de trabalho exercido: '+dados.tipoDeTrabalho
        },
        {  
          text: 'Renda familiar: '+ dados.rendaFamiliar
        },
        {  
          text: 'Renda per Capita: '+ dados.rendaPerCapita
        },
        {  
          text: 'Condições de Saúde: ',
          fontSize: 14,
          bold: true,
          margin: [0, 5, 5, 0]  
        },
        {  
          text: 'Quant memebros deficientes: '+ dados.quantMembroDeficiente
        },
        {  
          text: dados.tipoDeficiencia ? "Tipo de deficiência:"+dados.tipoDeficiencia : "Tipo de deficiência: -"
        },
        {  
          
          text: 'Data de preenchimento dos dados: '+ moment(dados.dataPreenchimento).format('DD/MM/yyyy')
        },
        {  
          text: 'Data da última atualização: '+ moment(dados.dataUltimaAtualizacao).format('DD/MM/yyyy')
        },
        {  
          text: 'Pontuação: '+ dados.pontuacao,
          margin: [0, 0, 0, 40]
        },
        {  
          text: '____________________________________________________________________________________',
          alignment: 'center'
        },
        {  
          text: 'Assinatura',
          alignment: 'center'
        },
      ] 

    ],  
    styles: {  
        sectionHeader: {  
            bold: true,  
            decoration: 'underline',  
            fontSize: 14,  
            margin: [0, 15, 0, 15]  
        }  
    }  
  }

  pdfMake.createPdf(docDefinition).open();
}

}
