import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private auth:AuthService, private toastr: ToastrService){}

  addUser(firstName:string,lastName:string,email:string, password:string, func: string){
    let user = {name: `${firstName} ${lastName}`,email:email, password:password, functionName: func};
    this.auth.Signup(user);
  }

}
