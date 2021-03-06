import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_servicos';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService, 
        private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401 || err.status === 403) {
                // Faz logout automático se a resposta 401 for retornada da api
                if(this.authenticationService.valorUsuarioAtual){
                    // Informa o usuário que ele está sendo deslogado
                    this.toastr.info("Sua Conexão expirou. Realize novo login um novo login!" )
                    this.authenticationService.logout();
                    location.reload(true);
                }
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}