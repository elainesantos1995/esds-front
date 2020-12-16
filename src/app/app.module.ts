import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app.rounting';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/template/header/header.component';
import { PrimeNgModule } from './primeng.module';

import { JwtInterceptor} from 'src/app/_helpers/JwtInterceptor';
import {ErrorInterceptor } from 'src/app/_helpers/ErrorInterceptor';

import { NavComponent } from './components/template/nav/nav.component';

import { CadastroFuncionariosComponent } from './views/funcionarios/cadastro-funcionarios/cadastro-funcionarios.component';
import { ListarFuncionariosComponent } from './views/funcionarios/listar-funcionarios/listar-funcionarios.component';

// import { ContentComponent } from './components/template/content/content.component';

import {ChartModule} from 'primeng/chart';
import { RelatoriosComponent } from './views/relatorios/relatorios.component';
import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    NavComponent,
    CadastroFuncionariosComponent,
    RelatoriosComponent,
    ListarFuncionariosComponent,
    // ContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgIdleKeepaliveModule.forRoot(),
    BrowserAnimationsModule,
    PrimeNgModule,
    ChartModule
  ],
  providers: [ApiServiceFuncionarios, 
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  

})
export class AppModule { }
