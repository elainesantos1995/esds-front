import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './_modelos';
import { AuthenticationService } from './_servicos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  usuarioAtual: Usuario;

constructor(
  private router: Router, private authenticationService: AuthenticationService){

  this.authenticationService.usuarioAtual.subscribe(usuario => {
    this.usuarioAtual = usuario;
  })
}

logout():void{
  this.authenticationService.logout();
  this.router.navigate(['/login']);
}


}
