import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';
import { first } from 'rxjs/operators';
import { FuncionarioEnderecoDTO } from 'src/app/dto/funcionarioEnderecoDTO';
import { ProgramaDTO } from 'src/app/dto/programaDTO';
import { ProgramaService } from 'src/app/_servicos/programaService';
import {MenuItem} from 'primeng/api';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { Column } from 'jspdf-autotable';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { UsoDeBeneficioDTO } from 'src/app/dto/usoDeBeneficio';
import { UsoDeBeneficioService } from 'src/app/_servicos/usoDeBeneficioService';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  items: MenuItem[] = null;
  programas: ProgramaDTO [] = null;
  programa: ProgramaDTO = null;
  beneficio: BeneficioDTO = null;
  beneficios: BeneficioDTO[] = null;
  anoPrograma: number = null;
  programasDTO: ProgramaDTO[] = null;
  beneficiosTodos: BeneficioDTO[] = null;

  inscricoes: InscricaoDTO[] = null;
  beneficiarioInscricao: BeneficiarioEnderecoDTO = null;

  usosDeBeneficio: UsoDeBeneficioDTO[] = null;

  beneficiarios: BeneficiarioEnderecoDTO[] = null;

  ano: string = null;
  dataInicio: string = null;
  dataFim: string = null;
  
  constructor(
    private beneficioService: BeneficioService,
    private programaService: ProgramaService,
    private inscricaoService: InscricaoService,
    private beneficiariosService: ApiServiceBeneficiarios,
    private usosService: UsoDeBeneficioService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.buscarTodos();
    this.buscarBeneficiarios();
    this.buscarTodosBeneficios();
  } 

  buscarTodos(){
    this.programaService.buscarTodos().subscribe((programasDTO: ProgramaDTO[]) => {
     this.programasDTO = programasDTO;
     console.log(programasDTO)
   });
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/relatorios', icon: 'pi pi-home'}
    ];
  }

  buscarBeneficiosDoPrograma(): void{
    console.log('Id do programa: '+ this.programa.id)
    this.beneficioService.listarBeneficiosDeUmPrograma(this.programa.id)
    .subscribe((beneficiosDTO: BeneficioDTO[]) => {
      this.beneficios = beneficiosDTO;
      console.log(this.beneficios)
    });
  }

  buscarTodosBeneficios(){
    this.beneficioService.buscarTodos().subscribe((beneficiosDTO: BeneficioDTO[]) => {
     this.beneficiosTodos = beneficiosDTO;
     console.log(beneficiosDTO)
   });
  }

  buscarPorAno(): void{
    console.log('Programa: '+ this.programa)
    this.programaService.buscarPorAno(this.anoPrograma).subscribe((programas: ProgramaDTO[]) => {
      this.programas = programas;
      console.log(this.programas)
    }); 
  }

  buscarProgramaPorId(): void{
    this.programaService.buscarPorId(this.programa.id)
    .pipe(first())
    .subscribe(response => {
      this.programa = response;
      console.log(this.programa);
    },
      erroResponse => new ProgramaDTO());     
}

// Recupera as inscrições realizadas para um benefício 
buscarInscricoesDeUmBeneficio(){
  this.inscricaoService.buscarBeneficioDeUmPrograma(this.beneficio.id)
  .subscribe((inscricoes: InscricaoDTO[]) => {
    this.inscricoes = inscricoes;
    console.log(this.inscricoes)
  })
}

buscarUsos(){
  this.usosService.buscarUsosDeUmBeneficio(this.beneficio.id).subscribe((usoDeBeneficioDTO: UsoDeBeneficioDTO[]) => {
   this.usosDeBeneficio = usoDeBeneficioDTO;
   console.log('Usos de benefício')
   console.log(usoDeBeneficioDTO)
 });
}

buscarBeneficiarios(){
  this.beneficiariosService.buscarTodos().subscribe((response: BeneficiarioEnderecoDTO[]) => {
   this.beneficiarios = response;
   console.log("beneficiários")
   console.log(this.beneficiarios)
 });
}

//Geral

relatorioGeralProgramaBeneficioAno(){

  if(this.programa === null){
    this.toastr.error("Selecione um programa!");
  }
  else if(this.beneficios === null){
    this.toastr.error("Selecione um benefício!");
  }
  else{
  let docDefinition2 = {
    header: 'e-SDS Relatórios',
        Headers: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog',
        content: [
          {
            text: 'SECRETARIA DE DESENVOLVIMENTO SOCIAL',
            fontSize: 16,
            alignment: 'center',
            color: '#047886'
          },
          {
            text: 'RELATÓRIO DE PROGRAMAS E BENEFÍCIOS',
            fontSize: 20,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'PROGRAMA',
            style: 'sectionHeader'
          },
          {
            columns: [
              [
                {
                  text: `Date: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                { 
                  text: `Rel. Nº : ${((Math.random() *1000).toFixed(0))}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'LISTAGEM DE PROGRAMAS',
            style: 'sectionHeader'
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto','auto'],
              body: [
                ['Id', 'Programa', 'Edição', 'Início', 'Término', 'Justificativa'],  
                ...this.programasDTO.map(p => ([p.id, p.nome, p.ano, moment(p.vigenciaInicio).format('DD/MM/yyyy'), moment(p.vigenciaTermino).format('DD/MM/yyyy'), p.descricao])),
                [{text: 'Programas encontrados', colSpan: 3}, {}, {}, {}, {}, this.programasDTO.length]
              ]
            }
          },
          {
            text: 'BENEFÍCIOS',
            style: 'sectionHeader'
          },      
          {            
            table: {  
                headerRows: 1,  
                widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],  
                body: [  
                  ['Id', 'Nome', 'Justificativa', 'Periodicidade', 'Vagas', 'Recursos', 'Programa', 'Edição'],  
                    ...this.beneficiosTodos.map(b => ([b.id, b.nome, b.justificativa, b.periodicidade, b.limiteVagas, b.totalRecursosAportados, b.programa.nome, b.programa.ano]))  
              
                ]  
            }  
          },
          {
            text: 'Obs',
            style: 'sectionHeader'
          },
          {
              ul: [
                'Detalha programas e benefícios ofertados em um ano específico.',
                'Apenas benefícios ofertados pela e-SDS - Prefeitura de Monteiro - PB.',
                'Com base em dados atuais.',
              ],
              margin: [0, 10,0, 10] 
          },
          {
            columns: [
              [{ qr: 'Programas e Benefícios', fit: '50' }],
              [{ text: 'Signature', alignment: 'right', italics: true}],
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

//Adimplentes

relatorioInadimplentesPorBeneficio(){
  let docDefinition2 = {
    header: 'C#Corner PDF Header',
        Headers: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog',
        content: [
          {
            text: 'ELECTRONIC SHOP',
            fontSize: 16,
            alignment: 'center',
            color: '#047886'
          },
          {
            text: 'INVOICE',
            fontSize: 20,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'Customer Details',
            style: 'sectionHeader'
          },
          {
            columns: [
              [
                {
                  text: this.programa.nome,
                  bold:true
                },
                { text: this.programa.ano },
              ],
              [
                {
                  text: `Date: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                { 
                  text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Order Details',
            style: 'sectionHeader'
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                ['Id', 'Programa', 'Edição', 'Justificativa'],  
                ...this.programas.map(p => ([p.id, p.nome, p.ano, p.descricao])),
                [{text: 'Total Amount', colSpan: 3}, {}, {}, this.programas.length]
              ]
            }
          },
          {
            text: 'Additional Details',
            style: 'sectionHeader'
          },
          {
              text: this.programa.nome,
              margin: [0, 0 ,0, 15]          
          },
          {
            columns: [
              [{ qr: `${this.programa.nome}`, fit: '50' }],
              [{ text: 'Signature', alignment: 'right', italics: true}],
            ]
          },
          {
            text: 'Terms and Conditions',
            style: 'sectionHeader'
          },
          {
              ul: [
                'Order can be return in max 10 days.',
                'Warrenty of the product will be subject to the manufacturer terms and conditions.',
                'This is system generated invoice.',
              ],
          }
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
//Inadimplentes

relatorioAdimplentesPorBeneficio(){
  let docDefinition2 = {
    header: 'C#Corner PDF Header',
        Headers: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog',
        content: [
          {
            text: 'ELECTRONIC SHOP',
            fontSize: 16,
            alignment: 'center',
            color: '#047886'
          },
          {
            text: 'INVOICE',
            fontSize: 20,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'Customer Details',
            style: 'sectionHeader'
          },
          {
            columns: [
              [
                {
                  text: this.programa.nome,
                  bold:true
                },
                { text: this.programa.ano },
              ],
              [
                {
                  text: `Date: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                { 
                  text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Order Details',
            style: 'sectionHeader'
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                ['Id', 'Programa', 'Edição', 'Justificativa'],  
                ...this.programas.map(p => ([p.id, p.nome, p.ano, p.descricao])),
                [{text: 'Total Amount', colSpan: 3}, {}, {}, this.programas.length]
              ]
            }
          },
          {
            text: 'Additional Details',
            style: 'sectionHeader'
          },
          {
              text: this.programa.nome,
              margin: [0, 0 ,0, 15]          
          },
          {
            columns: [
              [{ qr: `${this.programa.nome}`, fit: '50' }],
              [{ text: 'Signature', alignment: 'right', italics: true}],
            ]
          },
          {
            text: 'Terms and Conditions',
            style: 'sectionHeader'
          },
          {
              ul: [
                'Order can be return in max 10 days.',
                'Warrenty of the product will be subject to the manufacturer terms and conditions.',
                'This is system generated invoice.',
              ],
          }
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
//Inscrições

relatorioInscricoesPorBeneficio(){
  
  if(this.programa === null){
    this.toastr.error("Selecione um programa!");
  }
  else if(this.inscricoes === null){
    this.toastr.error("Selecione um benefício!");
  }
  else{
  let docDefinition2 = {
    header: 'e-SDS Relatórios',
        Headers: '',
        content: [
          {
            text: 'Relatório de Inscrições por Benefício de Programa Social',
            fontSize: 16,
            alignment: 'center',
            color: '#047886'
          },
          {
            text: 'INSCRIÇÕES',
            fontSize: 20,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'Detalhes',
            style: 'sectionHeader'
          },
          {
            columns: [
              [
                {
                  text: 'Programa: '+ this.programa.nome,
                  bold:false
                },
                { text: 'Edição: ' + this.programa.ano },
                {
                  text: 'Início: '+ moment(this.programa.vigenciaInicio).format('DD/MM/yyyy'),
                  bold:false
                },
                {
                  text: 'Término: '+ moment(this.programa.vigenciaTermino).format('DD/MM/yyyy'),
                  bold:false
                },
                {
                  text: 'Benefício: '+this.beneficio.nome,
                  bold: false
                },
                {
                  text: 'Limite de Vagas: '+ this.beneficio.limiteVagas,
                  bold:false
                },
                {
                  text: 'Total de Recursos Aportados: '+ this.beneficio.totalRecursosAportados,
                  bold:false,
                  margin: [0, 0, 0, 10]
                }
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
              widths: ['*', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['Id', 'Beneficiario', 'CPF', 'Situação', 'Benefício'],  
                ...this.inscricoes.map(i => ([i.id, i.beneficiario.nome, i.beneficiario.cpf, i.status, this.beneficio.nome])),
                [{text: 'Total', colSpan: 3}, {}, {}, {}, this.inscricoes.length]
              ]
            }
          },
          {
            text: 'OBS',
            style: 'sectionHeader'
          },
          {
              ul: [
                'Detalha inscrições em benefícios de um programa em um ano específico.',
                'Apenas benefícios ofertados pela e-SDS - Prefeitura de Monteiro - PB.',
                'Elaborado com base em dados atuais.',
              ],
          }
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
//Benefícios

relatorioUsoBeneficiosPorPrograma(){

  if(this.programa === null){
    this.toastr.error("Selecione um programa!");
  }
  else if(this.inscricoes === null){
    this.toastr.error("Selecione um benefício!");
  }
  else{
  let docDefinition2 = {
    header: 'e-SDS Relatórios',
        Headers: '',
        content: [
          {
            text: 'Relatório de Inscrições por Benefício de Programa Social',
            fontSize: 16,
            alignment: 'center',
            color: '#047886'
          },
          {
            text: 'USOS DE BENEFÍCIOS',
            fontSize: 20,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'Detalhes',
            style: 'sectionHeader'
          },
          {
            columns: [
              [
                {
                  text: 'Programa: '+ this.programa.nome,
                  bold:false
                },
                { text: 'Edição: ' + this.programa.ano },
                {
                  text: 'Início: '+ moment(this.programa.vigenciaInicio).format('DD/MM/yyyy'),
                  bold:false
                },
                {
                  text: 'Término: '+ moment(this.programa.vigenciaTermino).format('DD/MM/yyyy'),
                  bold:false
                },
                {
                  text: 'Benefício: '+this.beneficio.nome,
                  bold: false
                },
                {
                  text: 'Limite de Vagas: '+ this.beneficio.limiteVagas,
                  bold:false
                },
                {
                  text: 'Total de Recursos Aportados: '+ this.beneficio.totalRecursosAportados,
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
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                ['Id', 'Beneficiário', 'CPF', 'Data de uso', 'Benefício'],  
                ...this.usosDeBeneficio.map(u => ([u.id, u.inscricao.beneficiario.nome, u.inscricao.beneficiario.cpf, moment(u.dataDoUso).format('DD/MM/yyyy'), this.beneficio.nome])),
                [{text: 'Total', colSpan: 4}, {}, {}, {}, this.inscricoes.length]
              ]
            }
          },
          {
            text: 'OBS',
            style: 'sectionHeader'
          },
          {
              ul: [
                'Detalha usos de benefícios de um programa em um ano específico.',
                'Apenas benefícios ofertados pela e-SDS - Prefeitura de Monteiro - PB.',
                'Elaborado com base em dados atuais.',
              ],
              margin: [0, 20, 0, 20]
          },
          {  
            columns: [  
                [{ qr: `'ID: '${this.programa.id}`, fit: '50' }],  
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
//Beneficiário  

relatorioBeneficiariosTotal(){
  let docDefinition2 = {
    header: 'e-SDS Relatórios',
        Headers: '',
        content: [
          {
            text: 'Relatório Beneficiários Cadastrados no Sistema',
            fontSize: 16,
            alignment: 'center',
            color: '#047886'
          },
          {
            text: 'BENEFICIÁRIOS REGISTRADOS',
            fontSize: 20,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'Detalhes',
            style: 'sectionHeader',
            alignment: 'right'
          },         
          {
            text: `Data: ${new Date().toLocaleString()}`,
            alignment: 'right'
          },
          { 
          text: `Relatório Nº : ${((Math.random() *1000).toFixed(0))}`,
          alignment: 'right'
          },
              

          // {
          //   columns: [
          //     [
          //       {
          //         text: 'Programa: '+ this.programa.nome,
          //         bold:false
          //       },
          //       {
          //         text: 'Benefício: '+this.beneficio.nome,
          //         bold: false
          //       },
          //       {
          //         text: 'Limite de Vagas: '+ this.beneficio.limiteVagas,
          //         bold:false
          //       },
          //       {
          //         text: 'Total de Recursos Aportados: '+ this.beneficio.totalRecursosAportados,
          //         bold:false
          //       },
          //       { text: 'Ano: ' + this.programa.ano },
          //     ],
          //     [
          //       {
          //         text: `Data: ${new Date().toLocaleString()}`,
          //         alignment: 'right'
          //       },
          //       { 
          //         text: `Relatório Nº : ${((Math.random() *1000).toFixed(0))}`,
          //         alignment: 'right'
          //       }
          //     ]
          //   ]
          // },


          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                ['Id', 'Beneficiário', 'CPF', 'Telefone', 'e-mail'],  
                ...this.beneficiarios.map(b => ([b.id, b.nome, b.cpf, b.telefone1, b.email])),
                [{text: 'Total', colSpan: 4}, {}, {}, {}, this.beneficiarios.length]
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
