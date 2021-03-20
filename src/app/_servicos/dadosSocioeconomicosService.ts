import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { DadosSocioeconomicosDTO } from 'src/app/dto/dadosSocioeconomicosDTO';

@Injectable({
    providedIn: 'root'
})
export class DadosSocioeconomicosService{

    url = 'http://localhost:8090/api/dadosSocioEconomicos';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

salvar(dados: DadosSocioeconomicosDTO, idBeneficiario: string){
    return this.http.post(this.url + `/${idBeneficiario}`, JSON.stringify(dados), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
    )
}

editar(id: number, dadosSocioeconomicosDTO: DadosSocioeconomicosDTO): Observable<any> {
    return this.http.put(this.url + `/${id}`, dadosSocioeconomicosDTO);
}

buscarPorId(id: number): Observable<DadosSocioeconomicosDTO>{
  return this.http.get<DadosSocioeconomicosDTO>(`http://localhost:8090/api/dadosSocioEconomicos/${id}`);
}

buscarTodos(): Observable<DadosSocioeconomicosDTO[]>{
  return this.http.get<any>(this.url)
  .pipe(
    retry(2),
    catchError(this.handleError))  
}

buscarDadosBeneficiarioTodos(idBeneficiario: number): Observable<DadosSocioeconomicosDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/dadosSocioEconomicos/${idBeneficiario}`)
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