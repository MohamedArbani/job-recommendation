import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  showMenu = false;
  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
  private authListenerSubs!: Subscription;
  userIsAuthenticated = false;
  isAdmin = false;
  user!: any;
  
  constructor(private userService: UsersService, private auth: AuthService) {}
  ngOnInit(): void {
        /* Auth Information */
        this.userIsAuthenticated = this.auth.getIsAuth();
        const token = localStorage.getItem('token')
        if (token) {
          this.userIsAuthenticated = true;
          console.log('this.auth.getCurrentUser', this.auth.getCurrentUser)
          if (this.auth.getCurrentUser.isAdmin === true) {
            this.isAdmin = true
          }
          this.userService.getUserById(this.auth.getCurrentUser.id).subscribe(data => {
            this.user = data;
          });
        }
    
        this.authListenerSubs = this.auth
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
          });
        this.auth
          .getIsAdminStatusListener()
          .subscribe((data) => (this.isAdmin = data));
  }

  logout(){
    this.auth.logout();
  }

}
