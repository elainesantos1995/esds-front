import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { DadosSocioeconomicosDTO } from 'src/app/dto/dadosSocioeconomicosDTO';
import { DadosSocioeconomicosService } from 'src/app/_servicos/dadosSocioeconomicosService';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';

@Component({
  selector: 'app-cadastro-dados-socioeconomicos',
  templateUrl: './cadastro-dados-socioeconomicos.component.html',
  styleUrls: ['./cadastro-dados-socioeconomicos.component.css']
})
export class CadastroDadosSocioeconomicosComponent implements OnInit {
  
  id: number;

  dados: DadosSocioeconomicosDTO = {
      id: null,	
      temBanheiro: null,
      aguaEncanada: null,
      energiaEletrica: null,
      coletaEsgoto: null,
      familiaIndigena: null,
      familiaQuilombola: null,
      membroEmpregado: null,
      doencaCronica: null,	
      membroDeficiente: null,
    //_________________________________	
      composicaoDomicilio: '',
      localidade: '',
      condicaoResidencia: '',
      quantComodos: '',	
      quantMembrosFamilia: '',
      quantMembrosIdosos: '',
      tipoDeTrabalho: '',
      rendaPerCapita: '',
      quantMembrosCriancas: '',
    //_________________________________		
      nomesMembrosFamilia: null,
      rendaFamiliar: null,	
      doencasCronicas: null,
      quantMembroDeficiente: null,
      tipoDeficiencia: null,
    //_________________________________		
      idBeneficiario: '',
      cpfBeneficiario: '',
      dataPreenchimento: null,
	    dataUltimaAtualizacao: null, pontuacao: null,
      beneficiarioTitular: null
  }

  nomesDosDependentes: string[];

  temBanheiro: string = null;
	aguaEncanada: string = null;
	energiaEletrica: string = null;
	coletaEsgoto: string = null;
  familiaIndigena: string = null;
	familiaQuilombola: string = null;
	doencaCronica: string = null;
  membroDeficiente: string = null;
  membroEmpregado: string = null;

  composicaoDomicilioSelecionado: any = null;
  localidadeDomicilioSelecionado: any = null;
  condicoesMoradiaSelecionada: any = null;
  quantComodosSelecionado: any = null;
  quantMembrosFamiliaSelecionado: any = null;
  quantMembrosIdososSelecionado: any = null;
  tiposDeTrabalhoSelecionado: any = null;
  faixasDeRendaSelecionada: any = null;
  quantMembrosCriancaSelecionada: any = null;

  items: MenuItem[];
  composicaoDeDomicilio: any = null;
  localidadesDomicilio: any = null;
  condicoesMoradia: any = null;
  quantComodos: any = null;
  quantMembrosFamilia: any = null;
  quantMembrosIdosos: any = null;
  tiposDeTrabalho: any = null;
  faixasDeRenda: any = null;
  quantMembrosCriancas: any = null;

  cpfBeneficiario: string = null;

  dataPreenchimento: any = null;
  dataUltimaAtualizacao: any = null;

  constructor(
    private dadosSocioeconomicoService: DadosSocioeconomicosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private beneficiariosService: ApiServiceBeneficiarios
  ) { }

  ngOnInit(): void {
    this.carregarItensBreadCrumb();
    this.carregarComposicaoDomicilio();
    this.carregarLocalidadeMunicipio();
    this.carregarCondicoesDomicilio();
    this.carregarQuantComodos();
    this.carregarQuantMembrosFamilia();
    this.carregarQuantIdosos();
    this.carregarTiposDeTrabalho();
    this.carregarRendaPerCapita();
    this.carregarQuantCriancas();

    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      this.dadosSocioeconomicoService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.dados = response;
        this.id = response.id;
        this.cpfBeneficiario = response.idBeneficiario;
        console.log(this.cpfBeneficiario)
        console.log(response)

        if(this.id){

          this.temBanheiro = this.dados.temBanheiro ? "sim": "nao";
	        this.aguaEncanada= this.dados.aguaEncanada ? "sim": "nao";
	        this.energiaEletrica= this.dados.energiaEletrica ? "sim": "nao";
	        this.coletaEsgoto= this.dados.coletaEsgoto ? "sim": "nao";
          this.familiaIndigena= this.dados.familiaIndigena ? "sim": "nao";
	        this.familiaQuilombola= this.dados.familiaQuilombola ? "sim": "nao";
	        this.doencaCronica= this.dados.doencaCronica ? "sim": "nao";
          this.membroDeficiente= this.dados.membroDeficiente ? "sim": "nao";
          this.membroEmpregado= this.dados.membroEmpregado ? "sim": "nao";
          
        }else{
          this.temBanheiro = "nao";
	        this.aguaEncanada= "nao";
	        this.energiaEletrica= "nao";
	        this.coletaEsgoto= "nao";
          this.familiaIndigena= "nao";
	        this.familiaQuilombola= "nao";
	        this.doencaCronica= "nao";
          this.membroDeficiente= "nao";
          this.membroEmpregado= "nao";
        }

        this.composicaoDomicilioSelecionado = response.condicaoResidencia;
        this.localidadeDomicilioSelecionado = response.localidade;
        this.condicoesMoradiaSelecionada = response.condicaoResidencia;
        this.quantComodosSelecionado = response.quantComodos;
        this.quantMembrosFamiliaSelecionado = response.quantMembrosFamilia;
        this.quantMembrosIdososSelecionado = response.quantMembrosIdosos;
        this.tiposDeTrabalhoSelecionado = response.tipoDeTrabalho;
        this.faixasDeRendaSelecionada = response.rendaPerCapita;
        this.quantMembrosCriancaSelecionada= response.quantMembrosCriancas;

        let funcDataPreenchimento: Date = new Date(this.dados.dataPreenchimento);
        this.dataPreenchimento = moment(funcDataPreenchimento).format('yyyy-MM-DD'); 

        let funcDataUltimaAtualizacao: Date = new Date(this.dados.dataUltimaAtualizacao);
        this.dataUltimaAtualizacao = moment(funcDataUltimaAtualizacao).format('yyyy-MM-DD'); 

      });
    }
  }

  onSubmit(){
    if(this.id){
      this.dados.temBanheiro = this.temBanheiro === "sim";
      this.dados.aguaEncanada= this.aguaEncanada === "sim";
	    this.dados.energiaEletrica= this.energiaEletrica === "sim";
	    this.dados.coletaEsgoto= this.coletaEsgoto === "sim";
      this.dados.familiaIndigena= this.familiaIndigena === "sim";
	    this.dados.familiaQuilombola= this.familiaQuilombola === "sim";
	    this.dados.doencaCronica= this.doencaCronica === "sim";
      this.dados.membroDeficiente= this.membroDeficiente === "sim";
      this.dados.membroEmpregado= this.membroEmpregado === "sim";

      this.dados.composicaoDomicilio = this.composicaoDomicilioSelecionado;
      this.dados.localidade = this.localidadeDomicilioSelecionado;
      this.dados.condicaoResidencia = this.condicoesMoradiaSelecionada;
      this.dados.quantComodos = this.quantComodosSelecionado;
      this.dados.quantMembrosFamilia = this.quantMembrosFamiliaSelecionado;
      this.dados.quantMembrosIdosos = this.quantMembrosIdososSelecionado;
      this.dados.tipoDeTrabalho = this.tiposDeTrabalhoSelecionado;
      this.dados.rendaPerCapita = this.faixasDeRendaSelecionada;
      this.dados.quantMembrosCriancas = this.quantMembrosCriancaSelecionada;
      this.dados.localidade = this.localidadeDomicilioSelecionado;
      //Alterado aqui
      this.dados.idBeneficiario = this.cpfBeneficiario;
      this.dados.rendaFamiliar = this.dados.rendaFamiliar;

      this.dadosSocioeconomicoService.editar(this.id, this.dados).subscribe(resposta => {
        this.toastr.success("Cadastro atualizado com sucesso!" )
        console.log(resposta)
        this.navegate(['/dados/']);
      });
    }
    
    else{
      
      this.dados.temBanheiro = this.temBanheiro === "sim";
      this.dados.aguaEncanada= this.aguaEncanada === "sim";
	    this.dados.energiaEletrica= this.energiaEletrica === "sim";
	    this.dados.coletaEsgoto= this.coletaEsgoto === "sim";
      this.dados.familiaIndigena= this.familiaIndigena === "sim";
	    this.dados.familiaQuilombola= this.familiaQuilombola === "sim";
	    this.dados.doencaCronica= this.doencaCronica === "sim";
      this.dados.membroDeficiente= this.membroDeficiente === "sim";
      this.dados.membroEmpregado= this.membroEmpregado === "sim";

      this.dados.composicaoDomicilio = this.composicaoDomicilioSelecionado;
      this.dados.localidade = this.localidadeDomicilioSelecionado;
      this.dados.condicaoResidencia = this.condicoesMoradiaSelecionada;
      this.dados.quantComodos = this.quantComodosSelecionado;
      this.dados.quantMembrosFamilia = this.quantMembrosFamiliaSelecionado;
      this.dados.quantMembrosIdosos = this.quantMembrosIdososSelecionado;
      this.dados.tipoDeTrabalho = this.tiposDeTrabalhoSelecionado;
      this.dados.rendaPerCapita = this.faixasDeRendaSelecionada;
      this.dados.quantMembrosCriancas = this.quantMembrosCriancaSelecionada;
      this.dados.localidade = this.localidadeDomicilioSelecionado;
    
      this.dados.idBeneficiario = this.cpfBeneficiario;
      this.dadosSocioeconomicoService.salvar(this.dados, this.dados.idBeneficiario)
          .subscribe(resposta => {
          console.log(resposta)
          this.toastr.success("Cadastro criado com sucesso!" )
          this.navegate(['/dados/']);
      });    
    }
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Home', url: 'http://localhost:4200/dados', icon: 'pi pi-home'}
  ];
  }

  carregarComposicaoDomicilio(){
    this.composicaoDeDomicilio = [
      {name: 'Alvenaria', value: 'ALVENARIA'},
      {name: 'Madeira', value: 'MADEIRA'},
      {name: 'Taipa', value: 'TAIPA'},
      {name: 'Situação de Rua', value: 'SITUACAO_DE_RUA'}
  ];
  }

  carregarLocalidadeMunicipio(){
    this.localidadesDomicilio = [
      {name: 'Zona Urbana', value: 'URBANA'},
      {name: 'Zona Rural', value: 'RURAL'}
    ]
  }

  carregarCondicoesDomicilio(){
    this.condicoesMoradia= [
      {name: 'Situação de Rua', value: 'SITUACAO_DE_RUA'},
      {name: 'Alugada', value: 'ALUGADA'},
      {name: 'Cedida', value: 'CEDIDA'},
      {name: 'Própria Quitada', value: 'PROPRIA_QUITADA'},
      {name: 'Própria Financiada', value: 'PROPRIA_FINANCIADA'}
    ]
  }
  
  carregarQuantComodos(){
    this.quantComodos= [
      {name: '1', value: 'UM'},
      {name: '2', value: 'DOIS'},
      {name: 'Entre 3 e 5', value: 'ENTRE_TRES_E_CINCO'},
      {name: 'Entre 6 e 10', value: 'ENTRE_SEIS_E_DEZ'},
      {name: 'Mais de 10', value: 'MAIS_DE_DEZ'}
    ]
  }

  carregarQuantMembrosFamilia(){
    this.quantMembrosFamilia= [
      {name: '1', value: 'UM'},
      {name: '2', value: 'DOIS'},      
      {name: '3', value: 'TRES'},      
      {name: '4', value: 'QUATRO'},
      {name: 'Entre 5 e 7', value: 'ENTRE_CINCO_SETE'},
      {name: 'Entre 8 e 10', value: 'ENTRE_OITO_DEZ'},
      {name: 'Mais de 10', value: 'MAIS_DE_DEZ'}
    ]
  }

  carregarQuantIdosos(){
    this.quantMembrosIdosos= [
      {name: '0', value: 'ZERO'},
      {name: '1', value: 'UM'},
      {name: '2', value: 'DOIS'},      
      {name: '3', value: 'TRES'},
      {name: 'Mais de 10', value: 'MAIS_DE_TRES'}
    ]
  }

  carregarTiposDeTrabalho(){
    this.tiposDeTrabalho= [
      {name: 'Desempregado', value: 'DESEMPREGADO'},
      {name: 'Trabalhador informal', value: 'INFORMAL'},      
      {name: 'Trabalhador rural', value: 'TEMPORARIO_RURAL'},      
      {name: 'Autonomo', value: 'AUTONOMO'},
      {name: 'Trabalhador com CTPS assinada', value: 'CARTEIRA_ASSINADA'},
      {name: 'Trabalhador não remunerado', value: 'NAO_REMUNERADO'},
      {name: 'Funcionário Público', value: 'FUNCIONARIO_PUBLICO'},
      {name: 'Empregador', value: 'EMPREGADOR'}
    ]
  }

  carregarRendaPerCapita(){
    this.faixasDeRenda = [
      {name: 'Menor/igual a meio SM', value: 'MENOR_UM_SM'},
      {name: 'Igual a 1 SM', value: 'IGUAL_UM_SM'},      
      {name: 'Entre 1  e 1,5 SM', value: 'ATE_UM_SM_E_MEIO'},      
      {name: 'Entre 1,5 SM e 3 SM', value: 'ENTRE_UM_E_TRES_SM'},
      {name: 'Entre 3 SM e 5 SM', value: 'ENTRE_TRES_E_CINCO_SM'},
      {name: 'Maior que 5 SM', value: 'MAIOR_CINCO_SM'}
    ]
  }

  carregarQuantCriancas(){
    this.quantMembrosCriancas= [
      {name: '0', value: 'ZERO'},
      {name: '1', value: 'UM'},
      {name: '2', value: 'DOIS'},      
      {name: '3', value: 'TRES'},
      {name: 'Mais de 3', value: 'MAIS_DE_TRES'}
    ]
  }

  adicionarDependentes(dependente: string){
    this.nomesDosDependentes.push(dependente);
  }

  navegate(url: string[]): any{
    this.router.navigate(url);
  }
  
}
