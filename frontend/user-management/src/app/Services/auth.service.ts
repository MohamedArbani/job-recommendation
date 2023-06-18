import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

const BACKEND_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: any;
  private tokenTimer: any;
  private isAuthenticated = false;
  private isUserAdmin = false
  private authStatusListener = new Subject<boolean>();
  private isAdminStatusListener = new Subject<boolean>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private acRoute: ActivatedRoute
  ) { }

  getIsAdminStatusListener() {
    return this.isAdminStatusListener.asObservable();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getIsAdmin() {
    return this.isUserAdmin
  }
  Signup(user: any) {
    this.http.post<{ result: any, message: string }>(BACKEND_URL + 'auth/sign-up', user).subscribe(
      (res) => {
        let returnUrl = this.acRoute.snapshot.queryParamMap.get('returnUrl');
        this.toastr.success("User Created Succesfully", 'Sign Up', {
          closeButton: false,
          progressAnimation: 'increasing',
          progressBar: true,
          easing: 'linear',
        });
        this.router.navigate([returnUrl ? '/auth/login?routerLink=' + returnUrl : '/auth/login']);
      }, (err) => {
        this.toastr.error("Something went wrong\n" + err?.message, 'Sign Up', {
          closeButton: false,
          progressAnimation: 'increasing',
          progressBar: true,
          easing: 'linear',
        });
      }
    );
  }

  // Sign-in
  signIn(user: any) {
    return this.http
      .post<{ token: string, expiresIn: any }>(BACKEND_URL + 'auth/login', user)
      .subscribe(
        (res) => {
          if (res.token) {
            let returnUrl = this.acRoute.snapshot.queryParamMap.get('returnUrl')
            const token = res.token;
            const expiresInDuration = res.expiresIn;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            this.setAuthTimer(expiresInDuration);
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate);
            this.router.navigate([returnUrl || '/']);
            console.log('this.getCurrentUser :>> ', this.getCurrentUser);
            if (this.getCurrentUser.isAdmin === true) {
              this.isUserAdmin = true
              this.isAdminStatusListener.next(true);
            } else {
              this.isUserAdmin = false
              this.isAdminStatusListener.next(false);
            }
            this.toastr.success('Successfully login', 'Login', {
              closeButton: false,
              progressAnimation: 'increasing',
              progressBar: true,
              easing: 'linear',
            }).onHidden.subscribe(
              () => {
                this.router.navigate(['/']);
                window.location.reload();
              }
            );
          }
        },
        () => {
          this.isAdminStatusListener.next(false)
          this.authStatusListener.next(false);
          this.toastr.error('Email or password error', 'Login', {
            closeButton: false,
            progressAnimation: 'increasing',
            progressBar: true,
            easing: 'linear',
          });
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.toastr.info('Your session has been expired.', 'Time Out', {
        closeButton: false,
        progressAnimation: 'increasing',
        progressBar: true,
        easing: 'linear',
      });
      this.logout();
    }, duration);
  }


  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData(): { token: string; expirationDate: Date; } | undefined {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  logout() {
    this.router.navigate(['/']);
    this.isAuthenticated = false;
    this.isUserAdmin = false
    this.authStatusListener.next(false);
    this.isAdminStatusListener.next(false);
    this.clearAuthData();
    localStorage.removeItem('isAuth');
    this.toastr.success('Good Bye 👋 See you soon.', 'Logout', {
      closeButton: false,
      progressAnimation: 'increasing',
      progressBar: true,
      easing: 'linear',
    });
  }

  get getCurrentUser() {
    let token = localStorage.getItem('token');

    if (!token) {
      return false;
    } else {
      let helper = new JwtHelperService().decodeToken(token);
      return helper;
    }
  }


}
