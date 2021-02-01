import { Component, OnInit } from '@angular/core';
import { Beneficiario } from 'src/app/_modelos/beneficiario';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { Endereco } from 'src/app/_modelos/endereco';
import {MenuItem} from 'primeng/api';
import { Observable } from 'rxjs';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';

@Component({
  selector: 'app-cadastro-beneficiario',
  templateUrl: './cadastro-beneficiario.component.html',
  styleUrls: ['./cadastro-beneficiario.component.css']
})
export class CadastroBeneficiarioComponent implements OnInit {

  formularioDeCadastro: FormGroup;
  id: number;
  genero: any = null;
  estadoCivil: any = null;
  beneficiarios: Beneficiario[];
  items: MenuItem[];
  estadosCivis: any[];
  generos: any[];
  
  beneficiario: Beneficiario = {id: null, nome:'', cpf: '', rg: '', rgDataEmissao: ''
  , rgOrgaoEmissor: '', dataNascimento: null,  beneficiarioTitular: null,
  estadoCivil: this.estadoCivil, sexo: this.genero, endereco: null};

  endereco: Endereco = {id: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', cep: '', pontoDeReferencia: ''};

  beneficiarioEnderecoDTO: BeneficiarioEnderecoDTO =  {nome: '',
	sobrenome: '', dataNascimento: null, cpf: '',	rg: '', rgDataEmissao: '',
	rgOrgaoEmissor: '', sexo: this.genero, estadoCivil: this.estadoCivil, telefone1: '',
	telefone2: '', logradouro: '', numero: '', complemento: '',
	bairro: '', cidade: '', cep: '', pontoDeReferencia: ''};

  constructor(
    private beneficiariosService: ApiServiceBeneficiarios,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
    ) { }

  ngOnInit(): void {
    
    this.carregarItensBreadCrumb();
    this.carregarEstadosCivis();
    this.carregarGeneros();
       
    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      this.beneficiariosService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.beneficiario = response;
        console.log(response);
      },
        erroResponse => new Beneficiario());
      } 
  }

  onSubmit(): void{

    if(this.id){
      this.beneficiariosService.editar(this.id, this.beneficiario).subscribe(resposta => {
        this.navegate(['/beneficiarios/']);
      });
    }else{
      
      this.beneficiariosService.salvar(this.beneficiarioEnderecoDTO)
      .subscribe(resposta => {
        alert("Salvo com sucesso!")
        this.navegate(['/beneficiarios/']);
      });

    }
      this.carregarBeneficiarios();
  }

navegate(url: string[]): any{
   this.router.navigate(url);
 }

carregarBeneficiarios(){
  this.beneficiariosService.buscarTodos().subscribe((beneficiarios: Beneficiario[]) => {
  this.beneficiarios = beneficiarios;
  });
}

carregarItensBreadCrumb(){
  this.items = [
    {label:' Listagem', url: 'http://localhost:4200/beneficiarios', icon: 'pi pi-home'},
    {label:'Cadastro'}
];
}

carregarEstadosCivis(){
  this.estadosCivis = [
    {name: 'Solteiro', value: 'Solteiro'},
    {name: 'Casado', value: 'Casado'},
    {name: 'Divorciado', value: 'Divorciado'},
    {name: 'União Estável', value: 'União Estável'},
    {name: 'Outro', value: 'Outro'}
];
}

carregarGeneros(){
  this.generos = [
    {name: 'Masculino', value: 'Masculino'},
    {name: 'Feminino', value: 'Feminino'},
    {name: 'Homossexual', value: 'Homossexual'},
    {name: 'Transexual', value: 'Transexual'},
    {name: 'Travesti', value: 'Travesti'},
    {name: 'Outro', value: 'Outro'}
];
}

cleanForm(form: NgForm) {
  this.carregarBeneficiarios;
  form.resetForm();
  this.beneficiario = {} as Beneficiario;
}

}
