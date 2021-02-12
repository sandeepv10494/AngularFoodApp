import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";


export interface AuthResponseData {
  kind:string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn:'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTime: any;

  constructor(private http: HttpClient, private router: Router){}

  signUp(email: string, password: string){
   return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPTrWES9dyqcSy3aKe8dmAkfb1-oF5Ynk',
      {
        email:email,
        password:password,
        returnSecureToken:true
      }
    ).pipe(
      catchError(this.handleError),
      tap(response => {
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
      })
    );
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDPTrWES9dyqcSy3aKe8dmAkfb1-oF5Ynk',
      {
        email:email,
        password:password,
        returnSecureToken:true
      }
    ).pipe(
      catchError(this.handleError),
      tap(response => {
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
      })
    );
  }

  autoLogin() {
    const userData: {email: string, id: string, _token: string, _tokenExpirationDate: string}
      = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTime){
      clearTimeout(this.tokenExpirationTime);
    }
    this.tokenExpirationTime = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTime = setTimeout(()=> {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, id: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errResponse: HttpErrorResponse){
    let errorMsg = "Oops! an unknown error occured";
    console.error(errResponse);

    if (!errResponse.error || !errResponse.error.error){
      return throwError(errorMsg);
    }

    switch(errResponse.error.error.message){
      case 'EMAIL_EXISTS':
        errorMsg = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'This password is not correct';
        break;
    }

    return throwError(errorMsg);
  }
}
