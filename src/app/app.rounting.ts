import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroBeneficiarioComponent } from "./views/beneficiarios/cadastro-beneficiario/cadastro-beneficiario.component";
import { ListarBeneficiariosComponent } from "./views/beneficiarios/listar-beneficiarios/listar-beneficiarios.component";
import { CadastroFuncionariosComponent } from './views/funcionarios/cadastro-funcionarios/cadastro-funcionarios.component';
import { ListarFuncionariosComponent } from './views/funcionarios/listar-funcionarios/listar-funcionarios.component';
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
    {path: '**', redirectTo: ''}
]

export const AppRoutingModule = RouterModule.forRoot(routes);