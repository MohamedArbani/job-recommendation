import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private auth: AuthService) {}

  loginUser(email:string,password:string) {
    let user = {email:email, password:password};
    console.log('user', user);
    this.auth.signIn(user);
  }
}
