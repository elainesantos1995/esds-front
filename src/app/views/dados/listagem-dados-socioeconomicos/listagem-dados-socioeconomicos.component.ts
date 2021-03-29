import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Route, ActivatedRoute, Router } from '@angular/router';

import { DadosSocioeconomicosDTO } from 'src/app/dto/dadosSocioeconomicosDTO';
import { DadosSocioeconomicosService } from 'src/app/_servicos/dadosSocioeconomicosService';
import { Observable } from 'rxjs';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { ToastrService } from 'ngx-toastr';

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
	    dataUltimaAtualizacao: null, pontuacao: null
  }

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
      console.log(this.dadosSocioeconomicos)
    });

    // this.dadosSocioeconomicoService.buscarDadosBeneficiarioTodos(this.beneficiarioEnderecoDTO.id).subscribe((dados: DadosSocioeconomicosDTO[]) => {
    //   this.dadosSocioeconomicos = dados;
    //   console.log(this.beneficiarioEnderecoDTO.id)
    //   console.log(this.dadosSocioeconomicos)
    // });
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
  

}
