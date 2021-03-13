import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';

import { Funcionario } from 'src/app/_modelos/funcionario';

import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';

import { Location } from '@angular/common';
import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n/meta';
import { first } from 'rxjs/operators';
import {RadioButtonModule} from 'primeng/radiobutton';
import {MenuItem} from 'primeng/api';
import { FuncionarioEnderecoDTO } from 'src/app/dto/funcionarioEnderecoDTO';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-cadastro-funcionarios',
  templateUrl: './cadastro-funcionarios.component.html',
  styleUrls: ['./cadastro-funcionarios.component.css']
})
export class CadastroFuncionariosComponent implements OnInit {

  tipoSelecionado: string;
  valorSelecionadoAdmin: boolean = false;
  formularioDeCadastro: FormGroup;
  funcionarios: Funcionario[];
  funcionario: Funcionario = {id: null, nome:'', cpf: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '', admin: this.valorSelecionadoAdmin, dataNascimento: null, matricula: '', login: '', matriculaCFESS:'', senha:'', tipo: '' };
  id: number;
  items: MenuItem[];
  tiposDeFuncionarios: any[];
  display: boolean = false;
  generos: any[];
  genero: any = null;
  selecaoAdmin: string = null;
  dataNascimento: string = null;

  funcionariosDTO: FuncionarioEnderecoDTO[];
  funcionarioEnderecoDTO: FuncionarioEnderecoDTO = {
    id: null, nome: '', matricula: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '',
    cpf: '', dataNascimento: null, login: '', senha: '', admin: this.valorSelecionadoAdmin, 
    matriculaCFESS: '', sexo: this.genero ,tipo: '', logradouro: '', numero: '', 
    complemento: '', bairro: '', cidade: '', cep: '', pontoDeReferencia: '', 
    email: '', telefone1: '', telefone2: '', idEndereco: null
  }

  constructor(
    private funcionarioService: ApiServiceFuncionarios,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private datePipe: DatePipe
    ) { }

  ngOnInit(): void {
    
     // Atribui o id do funcionário recebido através da url na variável da classe, caso haja
    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      // Busca o funcionário de acordo com o id recebido via url setando o funcionário
      // retornado no objeto da classe
      this.funcionarioService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.funcionarioEnderecoDTO = response;

        // Verifica se o usuário está sendo editado
        if(this.id){
          // Atribui o id do usuário passado via url na id do objeto a ser atualizado
          this.funcionarioEnderecoDTO.id = this.id;
          // Verifica qual se o funcionário é admin ou não e atribui esse valor à variável de controle
          this.selecaoAdmin = this.funcionarioEnderecoDTO.admin ? "sim": "nao";
          let funcDataNascimento: Date = new Date(this.funcionarioEnderecoDTO.dataNascimento);
          // atribui um valor formatado à data de nascimento do funcionário
          this.dataNascimento = moment(funcDataNascimento).format('yyyy-MM-DD');
        }else{
          this.selecaoAdmin = "nao";
        }
        this.genero = response.sexo;
        this.funcionarioEnderecoDTO.admin = response.admin;
        console.log(response);
      },
        erroResponse => new FuncionarioEnderecoDTO());
      } 
    this.buscarTodos();
    this.carregarItensBreadCrumb();
    this.carregarTiposDeFuncionarios();
    this.carregarGeneros();
  }

  onSubmit(): void{
    // Atualiza um funcionário
    if(this.id){
      this.funcionarioEnderecoDTO.admin = this.selecaoAdmin === "sim";
      this.funcionarioEnderecoDTO.dataNascimento = this.converterDataNascimento(this.dataNascimento);
      this.funcionarioEnderecoDTO.sexo = this.genero;
      this.funcionarioService.editar(this.id, this.funcionarioEnderecoDTO).subscribe(resposta => {
        this.toastr.success("Cadastro atualizado com sucesso!" )
        console.log(resposta)
        this.navegate(['/funcionarios/']);
      });
    }
    // Salva um funcionário
    else{
      this.funcionarioEnderecoDTO.admin = this.selecaoAdmin === "sim";
      this.funcionarioEnderecoDTO.dataNascimento = this.converterDataNascimento(this.dataNascimento);
      if(this.testaCPF(this.funcionarioEnderecoDTO.cpf) === false){
        this.toastr.error("CPF Inválido!")
      }else if(this.checarEmail(this.funcionarioEnderecoDTO.email) === false){
        this.toastr.error("Email Inválido!" )
      }
      // else if(this.checarDisponibilidadeLogin() === false){
      //   this.toastr.error("Login indisponível!")
      // }
      else{
        this.funcionarioEnderecoDTO.tipo = this.tipoSelecionado;
        this.funcionarioEnderecoDTO.sexo = this.genero;
        this.funcionarioService.salvar(this.funcionarioEnderecoDTO)
          .subscribe(resposta => {
          console.log(this.tipoSelecionado);
          console.log(this.genero)
          console.log(this.funcionarioEnderecoDTO.dataNascimento)
          console.log(resposta)
          this.toastr.success("Cadastro criado com sucesso!" )
          this.navegate(['/funcionarios/']);
      });
    }
    }
  }

  // Converte a data de nascimento do funcionário
  private converterDataNascimento(data: any){
    let dataAuxiliar = new Date(data);
    dataAuxiliar.setDate(dataAuxiliar.getDate() + 1);
    return dataAuxiliar;
  }

  showDialog() {  
    this.display = true;
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:' Listagem', url: 'http://localhost:4200/funcionarios', icon: 'pi pi-home'},
      {label:'Cadastro'}
  ];
  }

  carregarTiposDeFuncionarios(){
    this.tiposDeFuncionarios = [
      {name: 'Assistente Social', value: 'Assistente Social'},
      {name: 'Facilitador', value: 'Facilitador'},
      {name: 'Entrevistador', value: 'Entrevistador'}
  ];
  }

  //Iniciais do nome + um número aleatório, talvez
  criarMatricula(): string {
    let matricula = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        matricula += 'MAT'+ chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return matricula;
}

  // Faz a navegação
  navegate(url: string[]): any{
    this.router.navigate(url);
  }

 buscarTodos(){
   this.funcionarioService.buscarTodos().subscribe((funcionariosDTO: FuncionarioEnderecoDTO[]) => {
    this.funcionariosDTO = funcionariosDTO;
    console.log(funcionariosDTO);
  });
 }

 deletar(int: number){
  this.funcionarioService.deletar(this.funcionarioEnderecoDTO.id);
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

 // limpa o formulario
 cleanForm(form: NgForm) {
  this.buscarTodos();
  form.resetForm();
  this.funcionario = {} as Funcionario;
}

// Valida um CPF informado
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

// Valida um endereço de e-mail informado
checarEmail(email: string): boolean{
  let regex_validation = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  return regex_validation.test(email);
}

checarDisponibilidadeLogin(): any{
  var disponivel: boolean;
  disponivel = this.funcionarioService.verificarDisponibilidadeLogin(this.funcionarioEnderecoDTO.login);
  return disponivel;
}

}
