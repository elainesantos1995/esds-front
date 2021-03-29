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

@Component({
  selector: 'app-selecao',
  templateUrl: './selecao.component.html',
  styleUrls: ['./selecao.component.css']
})
export class SelecaoComponent implements OnInit {

  items: MenuItem[];
  programas: ProgramaDTO[];
  programaSelecionadoDTO: ProgramaDTO;
  beneficioSelecionado: BeneficioDTO;
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

createPdf() {
  const doc = new jsPDF.default();
  const columns = [['Id', 'Benefício', 'Status', 'Nome', 'CPF']];
  const data = this.inscricoesSelecionadasRetornadas;

  doc.setFontSize(18);
  doc.text('Inscrições Selecionadas', 11, 8);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.getHorizontalCoordinateString(0);

  (doc as any).autoTable({
    //head: [['Id', 'Benefício', 'Status', 'Nome', 'CPF']],
    body: this.inscricoesSelecionadasRetornadas,
    theme: 'plain',
    didDrawCell: (data) => {
      console.log(data.column.index)
    }
  });

  // Open PDF document in new tab
//  doc.output('dataurlnewwindow')

  // Download PDF document  
  doc.save('table.pdf');
  location.reload();
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
  
buscarBeneficios(): void{
  this.beneficioService.buscarTodos().subscribe((beneficiosDTO: BeneficioDTO[]) => {
    this.beneficios = beneficiosDTO;
    console.log(this.beneficiosDoPrograma)
  });
}

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

buscarInscricoesSelecionadas(){
  this.inscricaoService.buscarInscricoesSelecionadas(this.beneficioSelecionado.id)
  .subscribe((inscricoes: InscricaoSelecionadaDTO[]) => {
    this.inscricoesSelecionadasRetornadas = inscricoes;
    console.log(this.inscricoesSelecionadasRetornadas)
  })
}

salvarSelecao(){

  if(this.inscricoesselecionadas === null){
    this.toastr.error("Não é possível salvar lista vazia!" )
  }else{

  this.inscricaoService
  .salvarInscricoesSelecionadas(this.beneficioSelecionado.id, this.inscricoesselecionadas
    ).subscribe(response => {
    //  console.log(response)
    });
    this.toastr.success("Benefícios gerados com Sucesso!" )
  }
}

limitarSelecao(e) { 
  //quantidade de vagas do benefício selecionado 
  const LIMIT_NUMBER = 2; 
  if (e.value.length > LIMIT_NUMBER) { 
    e.value.pop(); 
  } 
}

// onRowSelect(event){
//   this.inscricaoSelecionada.status = ''
// }

// onRowUnselect(event){
    
// }

}
