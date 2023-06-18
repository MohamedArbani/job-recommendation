import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const BACKEND_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: any[] = [];
  header:any;

  constructor(private http: HttpClient, private toastr: ToastrService, private auth:AuthService) {
    this.header = {
      'Authorization': 'Bearer ' + auth.getToken()
    }
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${BACKEND_URL}users`, {headers:this.header});
  }

  updateUser(user: any) {
    this.http.patch<any>(`${BACKEND_URL}users/${user.id}`, user, {headers:this.header}).subscribe(data => {});
    //return this.http.patch<any>(`${BACKEND_URL}users/${user.id}`, user);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${BACKEND_URL}users/${id}` , {headers:this.header});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}users/${id}`, {headers:this.header});
  }

  addExperience(userId:any,expData:any){
    return this.http.post<any>(`${BACKEND_URL}experiences`, expData, {headers:this.header});
  }

  assignExp(userId:any,expData:any){
    return this.http.post<any>(`${BACKEND_URL}experiences/${userId}/assign`, {idExperience: expData}, {headers:this.header});
  }

}
