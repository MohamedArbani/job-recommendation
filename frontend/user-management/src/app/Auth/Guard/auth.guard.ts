import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');
    console.log('token', token);
    if (token || this.auth.getCurrentUser.isAdmin ) {
      return true;
    } else {
      this.router.navigate(['/auth/login'],{ queryParams: { returnUrl: state.url } } )  }
    return false;
  }
  
}