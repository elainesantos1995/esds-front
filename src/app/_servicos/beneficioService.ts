import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ProgramaDTO } from '../dto/programaDTO';
import { BeneficioDTO } from '../dto/beneficioDTO';

@Injectable({
    providedIn: 'root'
})
export class BeneficioService{

url = 'http://localhost:8090/api/beneficios';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
};

salvar(beneficio: BeneficioDTO){

    return this.http.post(this.url, JSON.stringify(beneficio), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
)
}

editar(id: number, BeneficioDTO): Observable<any> {
    return this.http.put(this.url + `/${id}`, BeneficioDTO);
}

buscarPorId(id: number): Observable<BeneficioDTO>{
  return this.http.get<BeneficioDTO>(`http://localhost:8090/api/beneficios/${id}`);
}

listarBeneficios(id: number): Observable<BeneficioDTO[]>{
  return this.http.get<any>(`http://localhost:8090/api/beneficios/todos/${id}`)
  .pipe(
    retry(2),
    catchError(this.handleError));
}

buscarTodos(): Observable<BeneficioDTO[]>{
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