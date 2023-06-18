import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/Services/jobs.service';

@Component({
  selector: 'app-find-jobs',
  templateUrl: './find-jobs.component.html',
  styleUrls: ['./find-jobs.component.scss']
})
export class FindJobsComponent implements OnInit{
  items:any[] = [];
  constructor(private js:JobsService){}
  ngOnInit(): void {
      this.js.getAllJobs().subscribe(
        (data)=>{
          this.items = data;
        }
      );
  }

}
