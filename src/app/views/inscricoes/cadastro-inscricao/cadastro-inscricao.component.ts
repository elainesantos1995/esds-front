import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';
import { DadosSocioeconomicosService } from 'src/app/_servicos/dadosSocioeconomicosService';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';

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

  constructor(
    private dadosSocioeconomicosService: DadosSocioeconomicosService,
    private beneficioService: BeneficioService,
    private inscricaoService: InscricaoService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.carregarStatus();
    this.buscarInscricoes();
    this.buscarBeneficios();
  }

  onSubmit(){
      this.selecaoStatus = 'EM_ANALISE';
      this.inscricaoDTO.status = this.selecaoStatus;
      this.inscricaoDTO.idBeneficio = this.beneficioDTO.id;
      this.inscricaoService.salvar(this.inscricaoDTO).subscribe(resposta => {
        this.toastr.success("Incrição realizada com sucesso!" )
        location.reload();
      });
  }
  
  deletar(){
    this.inscricaoService.deletar(this.inscricaoSelecionadaDTO.id)
      .subscribe(response => {  
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
      console.log(this.inscricoesDTO)
    });
  }

  buscarBeneficios(): void{
    this.beneficioService.buscarTodos().subscribe((beneficiosDTO: BeneficioDTO[]) => {
      this.beneficiosDTO = beneficiosDTO;
    //  console.log(this.beneficiosDTO)
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

}
