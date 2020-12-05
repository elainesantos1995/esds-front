import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_servicos';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
    
    constructor(
        private router: Router, private authenticationService: AuthenticationService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const usuarioAtual = this.authenticationService.valorUsuarioAtual;
        if(usuarioAtual){
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }

}