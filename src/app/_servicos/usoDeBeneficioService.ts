import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { UsoDeBeneficioDTO } from 'src/app/dto/usoDeBeneficio';

@Injectable({
    providedIn: 'root'
})
export class UsoDeBeneficioService{

    url = 'http://localhost:8090/api/usosDeBeneficios';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

salvar(idInscricao: number, uso: UsoDeBeneficioDTO){
    return this.http.post(this.url + `/${idInscricao}`, JSON.stringify(uso), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
    )
}

editar(id: number, UsoDeBeneficioDTO): Observable<any> {
    return this.http.put(this.url + `/${id}`, UsoDeBeneficioDTO);
}

buscarPorId(id: number): Observable<UsoDeBeneficioDTO>{
  return this.http.get<UsoDeBeneficioDTO>(this.url+`/${id}`);
}

buscarTodos(): Observable<UsoDeBeneficioDTO[]>{
  return this.http.get<any>(this.url)
  .pipe(
    retry(2),
    catchError(this.handleError))  
}

deletar(id : number): Observable<any>{
  return this.http.delete<any>(this.url+`/${id}`);
}

buscarUsoDeUmBeneficiario(idInscricao: number): Observable<UsoDeBeneficioDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/usosDeBeneficios/usos/${idInscricao}`)
  .pipe(
    retry(2),
    catchError(this.handleError))
}

buscarUsosDeUmBeneficio(idBeneficio: number): Observable<UsoDeBeneficioDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/usosDeBeneficios/usos/beneficio/${idBeneficio}`)
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