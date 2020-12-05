import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../_modelos';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthenticationService{

    private comportamentoUsuarioAtual  = new BehaviorSubject<Usuario>(JSON
      .parse(localStorage.getItem('usuarioAtual')));

    public usuarioAtual  = this.comportamentoUsuarioAtual.asObservable();
    
    constructor(private http: HttpClient){

    }

    public get valorUsuarioAtual(){
      return this.comportamentoUsuarioAtual.value;
    }

    login(login: string, senha: string): Observable<Usuario>{
      return this.http.post<any>('http://localhost:8090/api/funcionarios/auth'
      , {login, senha}).pipe(map(usuario=> {
        localStorage.setItem('usuarioAtual', JSON.stringify(usuario));

        this.comportamentoUsuarioAtual.next(usuario);

        return usuario;
      }));
    }

    logout(): void{
      localStorage.removeItem('usuarioAtual');
      this.comportamentoUsuarioAtual.next(null);
    }
} 