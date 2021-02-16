import { Component, OnInit } from '@angular/core';
import { Beneficiario } from 'src/app/_modelos/beneficiario';
import { ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import {MenuItem} from 'primeng/api';
import { Observable } from 'rxjs';
import { BeneficiarioEnderecoDTO } from 'src/app/dto/beneficiarioEnderecoDTO';
import { CPFValidator } from 'src/app/_validators/cpfValidator';

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

  beneficiarioEnderecoDTO: BeneficiarioEnderecoDTO =  {id: null, nome: '',
	sobrenome: '', dataNascimento: null, cpf: '',	rg: '', rgDataEmissao: '',
	rgOrgaoEmissor: '', sexo: this.genero, estadoCivil: this.estadoCivil, telefone1: '',
  telefone2: '', email: '', logradouro: '', numero: '', complemento: '', bairro: '', 
  cidade: '', cep: '', pontoDeReferencia: '', beneficiarioTitular: null, idEndereco: null};

  constructor(
    private beneficiariosService: ApiServiceBeneficiarios,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {

    this.formularioDeCadastro = this.formBuilder.group({
      cpf: ['', CPFValidator.isValidCpf()]
    })
    
    this.carregarItensBreadCrumb();
    this.carregarEstadosCivis();
    this.carregarGeneros();
       
    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      this.beneficiariosService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.beneficiarioEnderecoDTO = response;
      //  this.beneficiarioEnderecoDTO.dataNascimento = response.dataNascimento;
      //  this.estadoCivil = response.estadoCivil;
      // this.genero = response.sexo;
        console.log(response);
      },
        erroResponse => new BeneficiarioEnderecoDTO());
      } 
  }

  onSubmit(): void{
    if(this.id){
      this.beneficiariosService.editar(this.id, this.beneficiarioEnderecoDTO).subscribe(resposta => {
        this.navegate(['/beneficiarios/']);
      });
    }else{
      
      this.beneficiarioEnderecoDTO.sexo = this.genero;
      this.beneficiarioEnderecoDTO.estadoCivil = this.estadoCivil;
      this.beneficiariosService.salvar(this.beneficiarioEnderecoDTO)
      .subscribe(resposta => {
        alert("Salvo com sucesso!")
        this.navegate(['/beneficiarios/']);
      });

    }
  }

navegate(url: string[]): any{
   this.router.navigate(url);
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
  form.resetForm();
  this.beneficiarioEnderecoDTO = {} as BeneficiarioEnderecoDTO;
}


testaCPF(strCPF): boolean {
  let soma: number;
  let resto: number;
  
if (strCPF == "00000000000") return false;

for (let i=1; i<=9; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
resto = (soma * 10) % 11;

  if ((resto == 10) || (resto === 11))  resto = 0;
  if (resto != parseInt(strCPF.substring(9, 10)) ) return false;

soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;

  if ((resto == 10) || (resto == 11))  resto = 0;
  if (resto != parseInt(strCPF.substring(10, 11) ) ) return false;
  return true;
}

}
