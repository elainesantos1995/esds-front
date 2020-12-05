import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Usuario } from '../_modelos';
import { AuthenticationService } from '../_servicos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioDeLogin: FormGroup;
  carregamento = false;
  submissao = false;
  urlRetorno: string;
  erro = '';
  private readonly URLRETORNO = 'returnUrl';

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {

      if(this.authenticationService.valorUsuarioAtual){
        this.router.navigate(['/']);
      }
    }

  ngOnInit(): void {
    this.formularioDeLogin = this.formBuilder.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    })

    this.urlRetorno = this.route.snapshot.queryParams[this.URLRETORNO] || '/';
  }

  get f() : any{
    return this.formularioDeLogin.controls;
  }

  onSubmit(): void{
    this.submissao = true;
     if(this.formularioDeLogin.invalid){
      return;
    }
    this.carregamento = true;
    this.authenticationService.login(this.f.login.value, this.f.senha.value)
    .pipe(first()).subscribe(qualquer => {
      this.router.navigate([this.urlRetorno]);
    }, 
    error => {
      this.erro = error.error.message;
      this.carregamento = false;
    });
  }

}
