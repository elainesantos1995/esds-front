import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Beneficiario } from 'src/app/_modelos/beneficiario';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Endereco } from '../_modelos/endereco';


@Injectable({
    providedIn: 'root'
})

export class ApiServiceBeneficiarios{

    url = 'http://localhost:8090/api/beneficiarios';
    urlEndereco = 'http://localhost:8090/api/enderecos';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/** */
salvarEndereco(endereco: Endereco){
  return this.http.post<Endereco>('http://localhost:8090/api/enderecos', JSON.stringify(endereco), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
)
}

salvar(beneficiario: Beneficiario){

    return this.http.post<Beneficiario>(this.url, JSON.stringify(beneficiario), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
)
}

editar(id: number, beneficiario): Observable<any> {
    return this.http.put(this.url + `/${id}`, beneficiario);
}

buscarPorId(id: number): Observable<Beneficiario>{
  return this.http.get<Beneficiario>(`http://localhost:8090/api/beneficiarios/${id}`);
}

buscarTodos(): Observable<Beneficiario[]>{
  return this.http.get<any>(this.url)
  .pipe(
    retry(2),
    catchError(this.handleError))  
}

deletar(id : number): Observable<any>{
  return this.http.delete<any>(this.url+`/${id}`);
}

buscarEndereco(){

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