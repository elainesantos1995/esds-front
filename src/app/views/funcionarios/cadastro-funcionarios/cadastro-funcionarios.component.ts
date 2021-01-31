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
        this.funcionario = response;
        console.log(response);
      },
        erroResponse => new Funcionario());
      } 
    this.buscarTodos();
    this.carregarItensBreadCrumb();
    this.carregarTiposDeFuncionarios();
  }

  onSubmit(): void{
    if(this.id){
      this.funcionarioService.editar(this.id, this.funcionario).subscribe(resposta => {
        this.navegate(['/funcionarios/']);
      });
    }else{

        this.funcionario.tipo = this.tipoSelecionado;
        this.funcionarioService.salvar(this.funcionario)
          .subscribe(resposta => {
          console.log(this.tipoSelecionado);
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
   this.funcionarioService.buscarTodos().subscribe((funcionarios: Funcionario[]) => {
    this.funcionarios = funcionarios;
    console.log(funcionarios);
  });
 }

 deletar(int: number){
  this.funcionarioService.deletar(this.funcionario.id);
 }

 // limpa o formulario
 cleanForm(form: NgForm) {
  this.buscarTodos();
  form.resetForm();
  this.funcionario = {} as Funcionario;
}

}
