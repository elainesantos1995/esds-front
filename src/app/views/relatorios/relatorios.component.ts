import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';
import { Funcionario } from 'src/app/_modelos/funcionario';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { FuncionarioEnderecoDTO } from 'src/app/dto/funcionarioEnderecoDTO';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html', 
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  data: any;
  assiduidade: any;
  getDocumentDefinition: any = this.getDocumentDefinitionValue();
  funcionarios: Funcionario[];
  
  nome: string = 'Programa';
  numero: number = 20;
  generos: any[];
  genero: any = null;
  valorSelecionadoAdmin: boolean = false;
  funcionarioEnderecoDTO: FuncionarioEnderecoDTO = {
    id: null, nome: '', matricula: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '',
    cpf: '', dataNascimento: null, login: '', senha: '', admin: this.valorSelecionadoAdmin, 
    matriculaCFESS: '', sexo: this.genero ,tipo: '', logradouro: '', numero: '', 
    complemento: '', bairro: '', cidade: '', cep: '', pontoDeReferencia: '', 
    email: '', telefone1: '', telefone2: '', idEndereco: null
  }

  
  constructor(
    private funcionarioService: ApiServiceFuncionarios    
    ) { }

  ngOnInit(): void {
    this.gerarGraficoUm();
    this.gerarGraficoDois();
    this.buscarPorId(1);
  } 

  buscarPorId(id: number): void{
      this.funcionarioService.buscarPorId(id)
      .pipe(first())
      .subscribe(response => {
        this.funcionarioEnderecoDTO = response;
        console.log(this.funcionarioEnderecoDTO);
      },
        erroResponse => new FuncionarioEnderecoDTO());     
  }

  gerarGraficoUm(): void{
    this.data = {
      labels: ['Executado','Pendente'],
      datasets: [
          {
              data: [this.numero, 20],
              backgroundColor: [
                  
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]    
      };
  }

  gerarGraficoDois(): void{
    this.assiduidade = {
      labels: ['Inadimplente','Satisfatória'],
      datasets: [
          {
              data: [300, 50],
              backgroundColor: [
                  "rgb(7, 204, 204)",
                  "#36A2EB"
              ],
              hoverBackgroundColor: [
                  "rgb(7, 204, 204)",
                  "#36A2EB"
              ]
          }]    
        }
  }


  

  generatePdf() {   
    pdfMake.createPdf(this.getDocumentDefinition).open();  
  }

  downloadPdf() { 
    const documentDefinition = {content: 'Isto é para teste.' }; 
    pdfMake.createPdf(documentDefinition).download();
  }

  OpenInTheSameWindowPdf() { 
    const documentDefinition = {content: 'Isto é para teste.' }; 
    pdfMake.createPdf(documentDefinition).open({}, window);
  }

  printPdf() { 
    const documentDefinition = {content: 'Isto é para teste.' }; 
    pdfMake.createPdf(documentDefinition).print();
  }

  getDocumentDefinitionValue(): any{     
      return {
        content: [
        {
          text: 'PROGRAMA SOCIAL' + this.funcionarioEnderecoDTO,
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]        
        }, 
        {
        columns: [
          [{
            text: 'Programa : '







            
          },
          {
            text: 'Edição : '  
          },
          {
            text: 'Aporte financeiros: ' 
          },
          {
            text: 'Qtd de Beneficiários : ' 
          }] 
         ]
        }],
        styles: {
          name: {
            fontSize: 16,
            bold: true
        }
      }
    };  
  }
  





  
  
  

}
