import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { BeneficiarioEnderecoDTO } from '../dto/beneficiarioEnderecoDTO';


@Injectable({
    providedIn: 'root'
})

export class ApiServiceBeneficiarios{

    url = 'http://localhost:8090/api/beneficiarios';

constructor(private http: HttpClient){ }
    
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
};

// salvar(beneficiario: BeneficiarioEnderecoDTO){
//     return this.http.post(this.url, JSON.stringify(beneficiario), this.httpOptions)
//     .pipe(
//         retry(2),
//         catchError(this.handleError)
//     )
// }

salvar(beneficiario: BeneficiarioEnderecoDTO){
  return this.http.post(this.url, JSON.stringify(beneficiario), this.httpOptions)
  .pipe(
      retry(2),
      catchError(this.handleError)
  )
}

editar(id: number, beneficiarioEnderecoDTO): Observable<any> {
    return this.http.put(this.url + `/${id}`, beneficiarioEnderecoDTO);
}

buscarPorId(id: number): Observable<BeneficiarioEnderecoDTO>{
  return this.http.get<BeneficiarioEnderecoDTO>(`http://localhost:8090/api/beneficiarios/${id}`);
}

buscarTodos(): Observable<BeneficiarioEnderecoDTO[]>{
  return this.http.get<any>(this.url)
  .pipe(
    retry(2),
    catchError(this.handleError))  
}

deletar(id : number): Observable<any>{
  return this.http.delete<any>(this.url+`/${id}`);
}

//Salva a imagem associando ao benefciário
salvarImagem(uploadImageData: FormData, idBenficiario: number){
  this.http.post('http://localhost:8090/api/image/upload/'+idBenficiario, uploadImageData, { observe: 'response' })
    .subscribe((response) => {
    }
  );    
}

//Salva apenas a imagem associando ao benefciário
salvarImagemSemBeneficiario(uploadImageData: FormData){
  this.http.post('http://localhost:8090/api/image/upload/', uploadImageData, { observe: 'response' })
    .subscribe((response) => {
    }
  );    
}

recuperarImagemPorId(id: any){
  return this.http.get('http://localhost:8090/api/image/get/id/'+id);
}       

removerFoto(id: any){
  return this.http.get('http://localhost:8090/api/image/delete/image/'+id);
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