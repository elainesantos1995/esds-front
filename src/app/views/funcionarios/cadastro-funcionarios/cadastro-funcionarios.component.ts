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
    private location: Location
    ) { }

  ngOnInit(): void {

    this.id = this.activatedRoute.snapshot.params['id'];    
    if(this.id){
      this.funcionarioService.buscarPorId(this.id)
      .pipe(first())
      .subscribe(response => {
        this.funcionarioEnderecoDTO = response;
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
    if(this.id){
      this.funcionarioService.editar(this.id, this.funcionarioEnderecoDTO).subscribe(resposta => {
        this.navegate(['/funcionarios/']);
      });
    }else{

        this.funcionarioEnderecoDTO.tipo = this.tipoSelecionado;
    //  this.funcionarioEnderecoDTO.sexo = this.genero;
        this.funcionarioService.salvar(this.funcionarioEnderecoDTO)
          .subscribe(resposta => {
          console.log(this.tipoSelecionado);
          console.log(this.genero)
          console.log(this.funcionarioEnderecoDTO.dataNascimento)
          console.log(resposta)
          alert("Salvo com sucesso!")
          this.navegate(['/funcionarios/']);
      });
      
  }
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
    {name: 'Masculino', value: 'Masculino'},
    {name: 'Feminino', value: 'Feminino'},
    {name: 'Homossexual', value: 'Homossexual'},
    {name: 'Transexual', value: 'Transexual'},
    {name: 'Travesti', value: 'Travesti'},
    {name: 'Outro', value: 'Outro'}
];
}

 // limpa o formulario
 cleanForm(form: NgForm) {
  this.buscarTodos();
  form.resetForm();
  this.funcionario = {} as Funcionario;
}

}
