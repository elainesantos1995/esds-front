import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard]}, 
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: ''}
]

export const AppRoutingModule = RouterModule.forRoot(routes);