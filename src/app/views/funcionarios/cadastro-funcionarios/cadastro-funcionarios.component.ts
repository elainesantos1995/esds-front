import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';

import { Funcionario } from 'src/app/_modelos/funcionario';

import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';

import { Location } from '@angular/common';
import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n/meta';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cadastro-funcionarios',
  templateUrl: './cadastro-funcionarios.component.html',
  styleUrls: ['./cadastro-funcionarios.component.css']
})
export class CadastroFuncionariosComponent implements OnInit {

  formularioDeCadastro: FormGroup;
  funcionarios: Funcionario[];
  funcionario: Funcionario = {id: null, nome:'', cpf: '', rg: '', rgDataEmissao: '', rgOrgaoEmissor: '', admin: false, dataNascimento: null, matricula: '', login: '', matriculaCFESS:'', senha:''};
  id: number;
  items: any[];

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
        // this.funcionario.senha ='';
        console.log(response);
      },
        erroResponse => new Funcionario());
      } 
    this.buscarTodos();
    this.carregarItensBreadCrumb();
  }

  onSubmit(): void{
    if(this.id){
      this.funcionarioService.editar(this.id, this.funcionario).subscribe(resposta => {
        this.navegate(['/funcionarios/']);
      });
    }else{
    this.funcionarioService.salvar(this.funcionario)
    .subscribe(resposta => {
      this.navegate(['/funcionarios/']);
    });
  }
  }

  carregarItensBreadCrumb(){
    this.items = [
      {label:'Listagem', url: 'http://localhost:4200/funcionarios'},
      {label:'Cadastro'}
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
