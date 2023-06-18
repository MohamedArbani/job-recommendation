import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { UsersService } from 'src/app/Services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user:any;
  editMode = false;
  addExpMode = false;
  expFormGroup!:FormGroup;

  constructor(private us:UsersService, private auth: AuthService){}
  ngOnInit(): void {
    this.expFormGroup =  new FormGroup<any>({
      name: new FormControl('', Validators.required),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl('', Validators.required)
    });
      this.us.getUserById(this.auth.getCurrentUser.id).subscribe(
        (data)=>{
          this.user = data;
          console.log('data :>> ', data);
        }
      );
   }

  toggleEdit(){
    this.editMode = !this.editMode;
  }

  toggleAddExp(){
    this.addExpMode = ! this.addExpMode;
  }

  addExperience(){
    if(this.expFormGroup.valid){
      this.us.addExperience(this.auth.getCurrentUser.id, {name:this.expFormGroup.get('name')!.value,fromDate:this.expFormGroup.get('fromDate')!.value,toDate:this.expFormGroup.get('toDate')!.value,}).subscribe(
        (data)=>{
          console.log('data :>> ', data);
          this.us.assignExp(this.auth.getCurrentUser.id, data.id).subscribe(
            ()=>{
              this.us.getUserById(this.auth.getCurrentUser.id).subscribe(
                (data)=>{
                  this.user = data;
                  console.log('data :>> ', data);
                  this.toggleAddExp();
                }
              );
            }
          )
        }
      )
      
      
    }
  }

  editUser(gender:string, phone: string, address: string){
    this.us.updateUser({gender, phone , address });
    this.toggleEdit();
  }

}
