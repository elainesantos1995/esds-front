import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
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
  private router: Router, private authenticationService: AuthenticationService,
  private idle: Idle, private keepAlive: Keepalive){

  this.authenticationService.usuarioAtual.subscribe(usuario => {
    this.usuarioAtual = usuario;
  })

  this.controleSessao();
}

logout():void{
  this.authenticationService.logout();
  this.router.navigate(['/login']);
}

private controleSessao(): void{
  this.idle.setIdle(1000);
  this.idle.setTimeout(500);
  this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  this.idle.onIdleEnd.subscribe(()=> {
    this.idle.watch();
  });
  this.idle.onTimeout.subscribe(()=>{
    this.idle.watch();
    this.sessionTimeout();
  });
  this.keepAlive.interval(500);
  this.idle.watch();
}

sessionTimeout():void{
  if(this.usuarioAtual){
    this.logout();
  }
}

}
