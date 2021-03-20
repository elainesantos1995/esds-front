import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { InscricaoDTO } from '../dto/inscricaoDTO';

@Injectable({
    providedIn: 'root'
})
export class InscricaoService{

url = 'http://localhost:8090/api/inscricoes';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

salvar(inscricao: InscricaoDTO){
    return this.http.post(this.url, JSON.stringify(inscricao), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
    )
}

editar(id: number, InscricaoDTO): Observable<any> {
    return this.http.put(this.url + `/${id}`, InscricaoDTO);
}

buscarPorId(id: number): Observable<InscricaoDTO>{
  return this.http.get<InscricaoDTO>(`http://localhost:8090/api/inscricoes/${id}`);
}

// listarInscricoesDeUmBeneficiario(id: number): Observable<InscricaoDTO[]>{
//   return this.http.get<any>(`http://localhost:8090/api/beneficios/beneficiosDoPrograma/${id}`)
//   .pipe(
//     retry(2),
//     catchError(this.handleError))
// }

buscarTodos(): Observable<InscricaoDTO[]>{
  return this.http.get<any>(this.url)
  .pipe(
    retry(2),
    catchError(this.handleError))  
}

deletar(id : number): Observable<any>{
  return this.http.delete<any>(this.url+`/${id}`);
}

handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}