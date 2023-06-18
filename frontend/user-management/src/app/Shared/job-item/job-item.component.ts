import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Services/auth.service';
import { JobsService } from 'src/app/Services/jobs.service';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent implements OnInit {
  @Input() item:any;
  disabled = false;

  constructor(private js: JobsService, private auth: AuthService, private toastr:ToastrService){}

  ngOnInit(): void {
      this.js.appliedJobs(this.auth.getCurrentUser.id).subscribe(
        (data)=>{
          data.forEach(
            (i)=>{
              if(i.id === this.item.id){
                this.disabled = true;
              }
            }
          );
        }
      );
  }

  applyJob(){
    this.js.applyForJob(this.auth.getCurrentUser.id, this.item.id).subscribe(
      (data)=>{
        this.toastr.success("Job applied Successfully", 'Apply job', {
          closeButton: false,
          progressAnimation: 'increasing',
          progressBar: true,
          easing: 'linear',
        }).onHidden.subscribe(
          ()=>{
            window.location.reload();
          }
        )
      },(err)=>{
        this.toastr.error(err.error.error, 'Apply job', {
          closeButton: false,
          progressAnimation: 'increasing',
          progressBar: true,
          easing: 'linear',
        });
      }
    )
  }

}
