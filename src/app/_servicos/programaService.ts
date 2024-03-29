import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ProgramaDTO } from '../dto/programaDTO';

import { Pageable } from 'src/app/_helpers/Pageable';

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

buscarPorAno(ano: number): Observable<ProgramaDTO[]>{
  return this.http.get<ProgramaDTO[]>(`http://localhost:8090/api/programas-e-beneficios/buscar/ano/${ano}`)
  .pipe(
    retry(2),
    catchError(this.handleError)) 
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

/**
* getDataPaginated
* @param {number} page
* @param {number} size
* @returns {Observable<Array<Data>>}
* @memberof DataService
*/
getDataPaginated(pageableData: Pageable): Observable<Array<ProgramaDTO[]>> {
  return this.http.get<any>(this.url+`/entity/pagination?page=${pageableData.page}&size=${pageableData.size}`);
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