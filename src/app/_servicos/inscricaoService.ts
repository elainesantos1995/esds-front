import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { InscricaoDTO } from '../dto/inscricaoDTO';
import { InscricaoSelecionadaDTO } from 'src/app/dto/InscricaoSelecionadaDTO';

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

listarInscricoesDeUmBeneficiario(id: number): Observable<InscricaoDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/inscricoes/inscricoes/beneficiario/${id}`)
  .pipe(
    retry(2),
    catchError(this.handleError))
}

buscarTodos(): Observable<InscricaoDTO[]>{
  return this.http.get<any>(this.url)
  .pipe(
    retry(2),
    catchError(this.handleError))  
}

buscarBeneficioDeUmPrograma(id: number): Observable<InscricaoDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/inscricoes/inscricoes/beneficios/${id}`)
  .pipe(
    retry(2),
    catchError(this.handleError))
}

deletar(id : number): Observable<any>{
  return this.http.delete<any>(this.url+`/${id}`);
}

salvarInscricoesSelecionadas(idBeneficio: number, inscricoesDTO: InscricaoDTO[]){
  return this.http.put(`http://localhost:8090/api/inscricoes/beneficios/selecionados/${idBeneficio}`
  , JSON.stringify(inscricoesDTO), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
    )
}

buscarInscricoesSelecionadas(idBeneficio: number): Observable<InscricaoSelecionadaDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/inscricoes/listagem/selecionados/${idBeneficio}`)
  .pipe(
    retry(2),
    catchError(this.handleError))
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