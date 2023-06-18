import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Error/not-found/not-found.component';
import { FooterComponent } from './Components/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/angular-material.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { DialogDeleteTaskComponent } from './Dialogs/dialog-delete-task/dialog-delete-task.component';
import { MyJobsComponent } from './Recruteur/my-jobs/my-jobs.component';
import { FindJobsComponent } from './Shared/find-jobs/find-jobs.component';
import { JobItemComponent } from './Shared/job-item/job-item.component';
import { ProfileComponent } from './Auth/profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HeaderComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,
    DialogDeleteTaskComponent,
    MyJobsComponent,
    FindJobsComponent,
    JobItemComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2200,
    }),
    MaterialModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
