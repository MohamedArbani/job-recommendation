import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Error/not-found/not-found.component';
import { AuthGuard } from './Auth/Guard/auth.guard';
import { FindJobsComponent } from './Shared/find-jobs/find-jobs.component';
import { ProfileComponent } from './Auth/profile/profile.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'home', component: HomeComponent},
  {path:'jobs', component: FindJobsComponent, canActivate:[AuthGuard]},
  {path:'auth/profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'auth/login', component: LoginComponent},
  {path:'auth/sign-up', component: SignUpComponent},
  {path:'404', component: NotFoundComponent},
  {path:'**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
