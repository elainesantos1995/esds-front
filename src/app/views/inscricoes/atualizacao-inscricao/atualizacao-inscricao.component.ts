import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { InscricaoDTO } from 'src/app/dto/inscricaoDTO';
import { DadosSocioeconomicosService } from 'src/app/_servicos/dadosSocioeconomicosService';
import { BeneficioDTO } from 'src/app/dto/beneficioDTO';
import { BeneficioService } from 'src/app/_servicos/beneficioService';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';

@Component({
  selector: 'app-atualizacao-inscricao',
  templateUrl: './atualizacao-inscricao.component.html',
  styleUrls: ['./atualizacao-inscricao.component.css']
})
export class AtualizacaoInscricaoComponent implements OnInit {

  id: number;
  status: any = null;
  selecaoStatus: string = null;
  items: MenuItem[];
  dataInscricao: any = null;  
  
  beneficioDTO: BeneficioDTO = { id: null,	nome: '',	justificativa: '', 
  totalRecursosAportados: null,	limiteVagas: null, controleBiometria: null,	
  controleDocumento: null,	controleCarteirinha: null,	periodicidade: '',	
  toleranciaUsosInadimplente: null,	toleranciaUsosCancelado: null, 
  programa: null, idPrograma: null, totalBeneficios: null
  }

  idBeneficio: number;

  beneficiarioDTO: BeneficiarioEnderecoDTO = null;

  inscricaoDTO: InscricaoDTO = {
    id: null, dataInscricao: null, parecer: '', status: '',
    quantBeneficiosASeremRetiradados: null,
    quantBeneficiosRetirados: null, cpfBeneficiario: '',
    idBeneficio: null, beneficiosDTO: null, beneficiarioDTO: null
  }

  beneficiosDTO: BeneficioDTO[] = null;

  cpfBeneficiario: string = null;

  constructor(
    private dadosSocioeconomicosService: DadosSocioeconomicosService,
    private beneficioService: BeneficioService,
    private inscricaoService: InscricaoService,
    private toastr: ToastrService,
    private router: Router,    
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
   
    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      this.inscricaoService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.inscricaoDTO = response;  
        this.selecaoStatus = response.status;
        this.id = response.id;
        this.idBeneficio = response.idBeneficio;
        console.log(response)
                
        let funcData: Date = new Date(this.inscricaoDTO.dataInscricao);
        this.dataInscricao = moment(funcData).format('yyyy-MM-DD');      
      },
        erroResponse => new InscricaoDTO());
      } 
      this.carregarItensBreadCrumb();
      this.carregarStatus();
      this.buscarBeneficios();
    //  this.buscarBeneficio();
  }

  onSubmit(){
    this.inscricaoDTO.status = this.selecaoStatus;
    this.inscricaoService.editar(this.id, this.inscricaoDTO).subscribe(resposta => {
      this.toastr.success("Inscrição atualizada com sucesso!" )
      this.navegate(['inscricoes/']);
    });
}

buscarBeneficio(){
  this.beneficioService.buscarPorId(this.inscricaoDTO.idBeneficio).subscribe(response => {
    this.beneficioDTO = response;
    console.log(response)
  })
}

carregarItensBreadCrumb(){
  this.items = [
    {label:' Listagem', url: 'http://localhost:4200/inscricoes', icon: 'pi pi-home'},
    {label:'Atualização'}
];
}

navegate(url: string[]): any{
  this.router.navigate(url);
}

buscarBeneficios(): void{
  this.beneficioService.buscarTodos().subscribe((beneficiosDTO: BeneficioDTO[]) => {
    this.beneficiosDTO = beneficiosDTO;
    console.log(this.beneficiosDTO)
  });
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
