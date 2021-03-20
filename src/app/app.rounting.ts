import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroBeneficiarioComponent } from "./views/beneficiarios/cadastro-beneficiario/cadastro-beneficiario.component";
import { ListarBeneficiariosComponent } from "./views/beneficiarios/listar-beneficiarios/listar-beneficiarios.component";
import { CadastroDadosSocioeconomicosComponent } from "./views/dados/cadastro-dados-socioeconomicos/cadastro-dados-socioeconomicos.component";
import { ListagemDadosSocioeconomicosComponent } from "./views/dados/listagem-dados-socioeconomicos/listagem-dados-socioeconomicos.component";
import { CadastroFuncionariosComponent } from './views/funcionarios/cadastro-funcionarios/cadastro-funcionarios.component';
import { ListarFuncionariosComponent } from './views/funcionarios/listar-funcionarios/listar-funcionarios.component';
import { AtualizacaoInscricaoComponent } from "./views/inscricoes/atualizacao-inscricao/atualizacao-inscricao.component";
import { CadastroInscricaoComponent } from "./views/inscricoes/cadastro-inscricao/cadastro-inscricao.component";
import { BeneficiosAtualizarComponent } from "./views/programas/beneficios-atualizar/beneficios-atualizar.component";
import { BeneficiosCadastroComponent } from "./views/programas/beneficios-cadastro/beneficios-cadastro.component";
import { BeneficiosComponent } from "./views/programas/beneficios/beneficios.component";
import { CadastroProgramasComponent } from "./views/programas/cadastro-programas/cadastro-programas.component";
import { ListagemProgramasComponent } from "./views/programas/listagem-programas/listagem-programas.component";
import { UsosDeBeneficioComponent } from "./views/registroDeUsos/usos-de-beneficio/usos-de-beneficio.component";
import { RelatoriosComponent } from './views/relatorios/relatorios.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard]}, 
    {path: 'login', component: LoginComponent},
    {path: 'funcionarios', children: [
        {path: '', component: ListarFuncionariosComponent},
        {path: 'funcionarios-cadastro', component: CadastroFuncionariosComponent},
        {path: 'funcionarios-cadastro/:id', component: CadastroFuncionariosComponent}]},
    {path: 'relatorios', component: RelatoriosComponent},
    {path: 'beneficiarios', children: [
        {path: '', component: ListarBeneficiariosComponent},
        {path: 'beneficiarios-cadastro', component: CadastroBeneficiarioComponent},
        {path: 'beneficiarios-cadastro/:id', component: CadastroBeneficiarioComponent}]},
    {path: 'programas', children: [
        {path: '', component: ListagemProgramasComponent},
        {path: 'programas-cadastro', component: CadastroProgramasComponent},
        {path: 'programas-cadastro/:id', component: CadastroProgramasComponent},
        {path: 'beneficios/:id', component: BeneficiosComponent},
        {path: 'beneficios-cadastro/:id', component: BeneficiosCadastroComponent},
        {path: 'beneficios-atualizar/:id', component: BeneficiosAtualizarComponent}]},
    {path: 'inscricoes', children: [
        {path: '', component: CadastroInscricaoComponent},
        {path: 'atualizacao/:id', component: AtualizacaoInscricaoComponent}
    ]},
    {path: 'usos', component: UsosDeBeneficioComponent},
    {path: 'dados', children: [
        {path: '', component: ListagemDadosSocioeconomicosComponent},
        {path: 'cadastro-dados', component: CadastroDadosSocioeconomicosComponent},
        {path: 'cadastro-dados/:id', component: CadastroDadosSocioeconomicosComponent}
    ]},
    {path: '**', redirectTo: ''}
]

export const AppRoutingModule = RouterModule.forRoot(routes);