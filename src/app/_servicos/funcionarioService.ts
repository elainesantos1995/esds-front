import { Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Funcionario } from 'src/app/_modelos/funcionario';



@Injectable({
    providedIn: 'root'
})
export class ApiServiceFuncionarios{
    
    
    url = 'http://localhost:8090/api/entrevistador';
    urlCad = '';
    
    constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    salvar(funcionario: Funcionario): Observable <Funcionario> {
     
      if(funcionario.tipo === 'Entrevistador'){
        this.urlCad='http://localhost:8090/api/entrevistador';
      }else if(funcionario.tipo === 'Facilitador'){
        this.urlCad='http://localhost:8090/api/facilitador';
      }else{
        this.urlCad='http://localhost:8090/api/assistente-social';
      }       
     
      return this.http.post<Funcionario>(this.urlCad, JSON.stringify(funcionario), this.httpOptions)
          .pipe(
              retry(2),
              catchError(this.handleError)
      )
     
    }

    editar(id: number, funcionario): Observable<any> {
      return this.http.put(this.url + `/${id}`, funcionario);
  }

  buscarPorId(id: number): Observable<Funcionario>{
    return this.http.get<Funcionario>(`http://localhost:8090/api/funcionarios/${id}`);
  }

  buscarTodos(): Observable<Funcionario[]>{
    return this.http.get<any>('http://localhost:8090/api/funcionarios/')
    .pipe(
      retry(2),
      catchError(this.handleError))
    
  }

  deletar(id : number): Observable<any>{
    return this.http.delete<any>(`http://localhost:8090/api/funcionarios/${id}`);
  }

    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Erro ocorreu no lado do cliente
          errorMessage = error.error.message;
        } else {
          // Erro ocorreu no lado do servidor
          errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
      };
    

}



