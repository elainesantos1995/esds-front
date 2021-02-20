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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-beneficiario',
  templateUrl: './cadastro-beneficiario.component.html',
  styleUrls: ['./cadastro-beneficiario.component.css']
})
export class CadastroBeneficiarioComponent implements OnInit {

  
  formularioDeCadastro: FormGroup;
  id: number;
  estadoCivil: any = null;
  beneficiarios: Beneficiario[];
  items: MenuItem[];
  estadosCivis: any[];
  generos: any[];
  genero: any = null;
  display: boolean = false;

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
    private formBuilder: FormBuilder,
    private toastr: ToastrService
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
        this.beneficiarioEnderecoDTO = response;
        this.beneficiarioEnderecoDTO.dataNascimento = response.dataNascimento;
        this.estadoCivil = response.estadoCivil;
        this.genero = response.sexo;
        console.log(response);
      },
        erroResponse => new BeneficiarioEnderecoDTO());
      } 
  }

  onSubmit(): void{
    if(this.id){
      this.beneficiariosService.editar(this.id, this.beneficiarioEnderecoDTO).subscribe(resposta => {
        this.toastr.success("Cadastro atualizado com sucesso!" )
        this.navegate(['/beneficiarios/']);
      });
    }else{      
      if(this.testaCPF(this.beneficiarioEnderecoDTO.cpf) === false){
        this.toastr.error("CPF Inválido!" )
      }else if(this.checarEmail(this.beneficiarioEnderecoDTO.email) === false){
        this.toastr.error("Email Inválido!" )
      }else{
      this.beneficiarioEnderecoDTO.sexo = this.genero;
      this.beneficiarioEnderecoDTO.estadoCivil = this.estadoCivil;
      this.beneficiariosService.salvar(this.beneficiarioEnderecoDTO)
      .subscribe(resposta => {       
        this.toastr.success("Cadastro criado com sucesso!" )
        this.navegate(['/beneficiarios/']);
      });
      }
    }
  }

showToaster(){
  this.toastr.success("Cadastro criado com sucesso!" )
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
    {name: 'Solteiro', value: 'SOLTEIRO'},
    {name: 'Casado', value: 'CASADO'},
    {name: 'Divorciado', value: 'DIVORCIADO'},
    {name: 'União Estável', value: 'UNIAO_ESTAVEL'},
    {name: 'Outro', value: 'OUTRO'}
];
}

carregarGeneros(){
  this.generos = [
    {name: 'Masculino', value: 'MASCULINO'},
    {name: 'Feminino', value: 'FEMININO'},
    {name: 'Transexual', value: 'TRANSEXUAL'},
    {name: 'Travesti', value: 'TRAVESTI'},
    {name: 'Outro', value: 'OUTRO'}
];
}

cleanForm(form: NgForm) {
  form.resetForm();
  this.beneficiarioEnderecoDTO = {} as BeneficiarioEnderecoDTO;
}

testaCPF(cpf: string): boolean {
  var Soma = 0;
  // Verifica se a variável cpf é igual a "undefined", exibindo uma msg de erro
  if (cpf === undefined) {
    return false;
  }

  // Esta função retira os caracteres . e - da string do cpf, deixando apenas os números 
  var strCPF = cpf.replace('.', '').replace('.', '').replace('-', '');
  // Testa as sequencias que possuem todos os dígitos iguais e, se o cpf não tem 11 dígitos, retorna falso e exibe uma msg de erro
  if (strCPF === '00000000000' || strCPF === '11111111111' || strCPF === '22222222222' || strCPF === '33333333333' || 
  strCPF === '44444444444' || strCPF === '55555555555' || strCPF === '66666666666' || strCPF === '77777777777' || strCPF === '88888888888' || 
  strCPF === '99999999999' || strCPF.length !== 11) {
    return false;
  }

  // Os seis blocos seguintes de funções vão realizar a validação do CPF propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
  // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número para ser testado

  //Multiplica cada digito por numeros de 1 a 9, soma-os e multiplica-os por 10. Depois, divide o resultado encontrado por 11 para encontrar o resto
  for (let i = 1; i <= 9; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }

  var Resto = (Soma * 10) % 11;
  if ((Resto === 10) || (Resto === 11)) {
    Resto = 0;
  }

  if (Resto !== parseInt(strCPF.substring(9, 10))) {
    return false;
  }

  Soma = 0;
  for (let k = 1; k <= 10; k++) {
    Soma = Soma + parseInt(strCPF.substring(k - 1, k)) * (12 - k)
  }

  Resto = (Soma * 10) % 11;
  if ((Resto === 10) || (Resto === 11)) {
    Resto = 0;
  }

  if (Resto !== parseInt(strCPF.substring(10, 11))) {
    return false;
  }
}

checarEmail(email: string): boolean{
  let regex_validation = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  return regex_validation.test(email);
}



}
