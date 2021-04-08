import { Component, OnInit, Directive } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Beneficiario } from 'src/app/_modelos/beneficiario';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import {MenuItem} from 'primeng/api';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';

import {HttpClientModule} from '@angular/common/http';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { InscricaoService } from 'src/app/_servicos/inscricaoService';
 
@Component({
  selector: 'app-listar-beneficiarios',
  templateUrl: './listar-beneficiarios.component.html',
  styleUrls: ['./listar-beneficiarios.component.css']
})
export class ListarBeneficiariosComponent implements OnInit {
  
  genero: any = null;
  estadoCivil: any = null;
  items: MenuItem[];
  home: MenuItem;
  displayModal: boolean;
  displayModalAddImagem: boolean;
  displayModalBeneficiario: boolean;

  beneficiariosDTO: BeneficiarioEnderecoDTO[];
  beneficiarioSelecionadoDTO: BeneficiarioEnderecoDTO;

  beneficiarioEnderecoDTO: BeneficiarioEnderecoDTO =  {id: null, nome: '',
	sobrenome: '', dataNascimento: null, cpf: '',	rg: '', rgDataEmissao: '',
	rgOrgaoEmissor: '', sexo: this.genero, estadoCivil: this.estadoCivil, telefone1: '',
  telefone2: '', email: '', logradouro: '', numero: '', complemento: '', bairro: '', 
  cidade: '', cep: '', pontoDeReferencia: '', beneficiarioTitular: null, 
  idEndereco: null, imagem: null, idImagem: null};

// Variáveis da imagem
selectedFile: File;
retrievedImage: any;
base64Data: any;
retrieveResonse: any;
message: string;
imageName: any;

  constructor(
    private beneficiariosService: ApiServiceBeneficiarios,
    private router: Router,
    private httpClientModule: HttpClientModule,
    private browserModule: BrowserModule, 
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private inscricaoService: InscricaoService
  ) { }

  ngOnInit(): void {
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  buscarTodos(){
    this.beneficiariosService.buscarTodos().subscribe((beneficiariosDTO: BeneficiarioEnderecoDTO[]) => {
     this.beneficiariosDTO = beneficiariosDTO;
     console.log(beneficiariosDTO)
   });
  }

  converterImagem(imagem: any): any{
    let imageData: any;     
      imageData = 'data:image/jpeg;base64,' + imagem; 
      return imageData;
  }

  setarBeneficiarioDTO(beneficiarioDTO: BeneficiarioEnderecoDTO): void{
    this.beneficiarioSelecionadoDTO = beneficiarioDTO;
  }

  // Navegação entre views
  navegate(url: string[]): any{
    this.router.navigate(url);
  }

  deletar(){

    let inscricoes: any = null;
    this.inscricaoService.listarInscricoesDeUmBeneficiario(this.beneficiarioSelecionadoDTO.id).subscribe(response => {
      inscricoes = response;
    })

    if(inscricoes !== null){
      this.toastr.info("Não é possível deletar beneficiário inscrito em benefícios de programas!")
    }
    else{
    this.beneficiariosService.deletar(this.beneficiarioSelecionadoDTO.id)
      .subscribe(response => {  
        location.reload();
        return false;      
      });
    }
  }

  // carregamento de valores de itens de breadcrump
  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/beneficiarios', icon: 'pi pi-home'}
  ];
  }

// Exibe modal para deleção de beneficiário
showModalDialog() {
    this.displayModal = true;
}


// Exibe modal com todos os dados do beneficiário selecionado
showModalDialogBeneficiario() {
  this.displayModalBeneficiario = true;
}

// Exibe modal para deleção
showModalDialogAddImagem() {
 this.displayModalAddImagem = true;
// location.reload();  
}

  // Método chamado quando o usuário seleciona uma imagem
  public onFileChanged(event) {
    //Seleção do arquivo
    this.selectedFile = event.target.files[0];
  }

 //Método chamado quando o usuário clica em submeter a imagem
 onUpload() {
  //A API FormData provê métodos e propriedades que permitem preparar facilmente os dados do formulário a serem enviados na requisição http POST
  const uploadImageData = new FormData();
  uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

  this.beneficiariosService.salvarImagem(uploadImageData, this.beneficiarioSelecionadoDTO.id);
  this.toastr.success("Cadastro atualizado com sucesso!" )
}

//Recupera e renderiza a imagem do beneficiário para que possa ser renderizada na tabela
recuperarImagemBeneficiario(imagem: any): any {
  var retrievedImage = null; 
    
      this.retrieveResonse = imagem;
      this.base64Data = this.retrieveResonse.picByte;
      retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
     
    return retrievedImage;
}

//Recupera uma imagem por id
recuperarImagemPorId(id: number){
  this.beneficiariosService.recuperarImagemPorId(id)
    .subscribe(res => {
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    );
}

removerImagem(id: number){
  this.beneficiariosService.removerFoto(id);
}

}
