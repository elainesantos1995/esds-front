import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';
import { DadosSocioeconomicosService } from 'src/app/_servicos/dadosSocioeconomicosService';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
import { ProgramaDTO } from 'src/app/dto/programaDTO';
import { ProgramaService } from 'src/app/_servicos/programaService';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';

@Component({
  selector: 'app-cadastro-inscricao',
  templateUrl: './cadastro-inscricao.component.html',
  styleUrls: ['./cadastro-inscricao.component.css']
})
export class CadastroInscricaoComponent implements OnInit {

  displayModal = false;
  status: any = null;
  selecaoStatus: string = null;
  items: MenuItem[];
  dataInscricao: any = null;
  beneficioDTO: BeneficioDTO = null;
  beneficiosDTO: BeneficioDTO[] = null;
  beneficiosSelecionados: BeneficioDTO[] = null;

  inscricaoSelecionadaDTO: InscricaoDTO;
  inscricoesDTO: InscricaoDTO[];

  inscricaoDTO: InscricaoDTO = {
    id: null, dataInscricao: null, parecer: '', status: '',
    quantBeneficiosASeremRetiradados: null,
    quantBeneficiosRetirados: null, cpfBeneficiario: '',
    idBeneficio: null, beneficiosDTO: null, beneficiario: null
  }
  
  displayCadastro = false;
  
  anoPrograma: number = null;
  programa: ProgramaDTO = null;
  programas: ProgramaDTO [] = null;

  beneficiarioEncontrado: BeneficiarioEnderecoDTO = null;

  constructor(
    private dadosSocioeconomicosService: DadosSocioeconomicosService,
    private beneficioService: BeneficioService,
    private inscricaoService: InscricaoService,
    private toastr: ToastrService,
    private router: Router,
    private programaService: ProgramaService,
    private beneficiarioService: ApiServiceBeneficiarios
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.carregarStatus();
    this.buscarInscricoes();
  }

  onSubmit(){
      this.selecaoStatus = 'EM_ANALISE';
      this.inscricaoDTO.status = this.selecaoStatus;
      this.inscricaoDTO.idBeneficio = this.beneficioDTO.id;
      
      console.log(this.inscricaoDTO)
      this.inscricaoService.salvar(this.inscricaoDTO).subscribe(resposta => {
        this.toastr.success("Incrição realizada com sucesso!" )
        location.reload();
      });
  }
  
  deletar(){
    this.inscricaoService.deletar(this.inscricaoSelecionadaDTO.id)
      .subscribe(response => {  
        this.toastr.success("Deletado com sucesso!")
        location.reload();
        return false;      
      });
  }

  showModalDialog() {
    this.displayModal = true;
  }

  showModalDialogCadastro() {
    this.displayCadastro = true;
  }

  setarInscricaoDTO(inscricaoDTO: InscricaoDTO): void{
    this.inscricaoSelecionadaDTO = inscricaoDTO;
  }

  buscarInscricoes(): void{
     
    this.inscricaoService.buscarTodos().subscribe((inscricoesDTO: InscricaoDTO[]) => {
      this.inscricoesDTO = inscricoesDTO;
      console.log("Inscrições total")
      console.log(this.inscricoesDTO)
    });
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/inscricoes', icon: 'pi pi-home'},
      {label:'Cadastro'}
  ];
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  adicionarBeneficioSelecionado(beneficio: BeneficioDTO){
    this.beneficiosSelecionados.push(beneficio);
  }

  carregarStatus(){
    this.status = [
      {name: 'Em Análise', value: 'EM_ANALISE'},
      {name: 'Deferida', value: 'DEFERIDA'},
      {name: 'Indeferida', value: 'INDEFERIDA'},
      {name: 'Em Lista', value: 'EM_LISTA'},
      {name: 'Inadimplente', value: 'INADIMPLENTE'},
      {name: 'Concedido', value: 'CONCEDIDO'},
      {name: 'Cancelado', value: 'CANCELADO'}
    ];
  }

  buscarPorAno(): void{
    console.log('Programa: '+ this.programa)
    this.programaService.buscarPorAno(this.anoPrograma).subscribe((programas: ProgramaDTO[]) => {
      this.programas = programas;
      if(this.programas == null){
        this.toastr.info("Programas não encontrados para o ano informado!")
      }
    }); 
  }

  buscarBeneficiosDoPrograma(): void{
    console.log('Id do programa: '+ this.programa.id)
    this.beneficioService.listarBeneficiosDeUmPrograma(this.programa.id)
    .subscribe((beneficiosDTO: BeneficioDTO[]) => {
      this.beneficiosDTO = beneficiosDTO;
      if(beneficiosDTO == null){
        this.toastr.info("Programa não possui benefícios cadastrados!")
      }
      console.log(this.beneficiosDTO)
    });
  }

  // Preciso verificar se o cpf já está inscrito no benefício
  buscarBeneficiarioPorCPF(){
    console.log("cpf: " + this.inscricaoDTO.cpfBeneficiario)
    this.beneficiarioService.buscarPorCPF(this.inscricaoDTO.cpfBeneficiario).subscribe(response => {
      this.beneficiarioEncontrado = response;
      if(this.beneficiarioEncontrado == null){
        this.toastr.error("CPF não encontrado!")
      }
      console.log("response: " + response)
    })
  }

}
