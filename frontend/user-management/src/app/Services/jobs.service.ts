import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACKEND_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http:HttpClient) { }

  getAllJobs(){
    return this.http.get<any>(BACKEND_URL + 'jobs');
  }

  applyForJob(userId:string, jobId:string){
    return this.http.post<any>(BACKEND_URL + 'jobs/'+ jobId + '/apply', {userId});
  }

  appliedJobs(userId:string){
    return this.http.get<any[]>(BACKEND_URL + 'jobs/user/'+ userId + '/applied-jobs');
  }
}
