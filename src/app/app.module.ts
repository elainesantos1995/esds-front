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
import {CadastroBeneficiarioComponent } from './views/beneficiarios/cadastro-beneficiario/cadastro-beneficiario.component';
import {ListarBeneficiariosComponent} from './views/beneficiarios/listar-beneficiarios/listar-beneficiarios.component';
import { CadastroFuncionariosComponent } from './views/funcionarios/cadastro-funcionarios/cadastro-funcionarios.component';
import { ListarFuncionariosComponent } from './views/funcionarios/listar-funcionarios/listar-funcionarios.component';

import {ChartModule} from 'primeng/chart';
import { RelatoriosComponent } from './views/relatorios/relatorios/relatorios.component';
import { ApiServiceFuncionarios} from 'src/app/_servicos/funcionarioService';
import {ApiServiceBeneficiarios } from 'src/app/_servicos/beneficiarioService';

import { ToastrModule } from 'ngx-toastr';
import {DatePipe} from '@angular/common';

import {FileUploadModule} from 'primeng/fileupload';
import { ListagemProgramasComponent } from './views/programas/listagem-programas/listagem-programas.component';
import { CadastroProgramasComponent } from './views/programas/cadastro-programas/cadastro-programas.component';
import { BeneficiosComponent } from './views/programas/beneficios/beneficios.component';
import { BeneficiosCadastroComponent } from './views/programas/beneficios-cadastro/beneficios-cadastro.component';
import { ProgramaService } from './_servicos/programaService';
import { BeneficioService } from './_servicos/beneficioService';
import { BeneficiosAtualizarComponent } from './views/programas/beneficios-atualizar/beneficios-atualizar.component';
import { CadastroDadosSocioeconomicosComponent } from './views/dados/cadastro-dados-socioeconomicos/cadastro-dados-socioeconomicos.component';
import { CadastroInscricaoComponent } from './views/inscricoes/cadastro-inscricao/cadastro-inscricao.component';
import { UsosDeBeneficioComponent } from './views/registroDeUsos/usos-de-beneficio/usos-de-beneficio.component';
import { ListagemDadosSocioeconomicosComponent } from './views/dados/listagem-dados-socioeconomicos/listagem-dados-socioeconomicos.component';
import { AtualizacaoInscricaoComponent } from './views/inscricoes/atualizacao-inscricao/atualizacao-inscricao.component';
import { SelecaoComponent } from './views/inscricoes/selecao/selecao.component';
import { BeneficiariosUsosListComponent } from './views/registroDeUsos/beneficiarios-usos-list/beneficiarios-usos-list.component';
import { GraficosComponent } from './views/relatorios/graficos/graficos.component';

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
    CadastroBeneficiarioComponent,
    ListarBeneficiariosComponent, 
    CadastroProgramasComponent,
    ListagemProgramasComponent,
    BeneficiosComponent,
    BeneficiosCadastroComponent,
    BeneficiosAtualizarComponent, 
    CadastroDadosSocioeconomicosComponent,
    ListagemDadosSocioeconomicosComponent,
    CadastroInscricaoComponent,
    UsosDeBeneficioComponent,
    AtualizacaoInscricaoComponent,
    SelecaoComponent,
    BeneficiariosUsosListComponent,
    GraficosComponent
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
    ChartModule,
    ToastrModule.forRoot({timeOut: 2000}),
    FileUploadModule
  ],
  providers: [ApiServiceFuncionarios, ApiServiceBeneficiarios, ProgramaService, BeneficioService,
    [DatePipe],
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  

})
export class AppModule { }
