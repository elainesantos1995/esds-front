import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ProgramaDTO } from '../dto/programaDTO';

@Injectable({
    providedIn: 'root'
})
export class ProgramaService{

url = 'http://localhost:8090/api/programas-e-beneficios';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
};

salvar(programa: ProgramaDTO){

    return this.http.post(this.url, JSON.stringify(programa), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
)
}

editar(id: number, ProgramaDTO): Observable<any> {
    return this.http.put(this.url + `/${id}`, ProgramaDTO);
}

buscarPorId(id: number): Observable<ProgramaDTO>{
  return this.http.get<ProgramaDTO>(`http://localhost:8090/api/programas-e-beneficios/${id}`);
}

buscarTodos(): Observable<ProgramaDTO[]>{
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