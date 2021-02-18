import { Injectable } from "@angular/core";
import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn:'root'
})
export class AuthService {

  private tokenExpirationTime: any;

  constructor(
    private store: Store<fromApp.AppState>
  ){}


  setLogoutTimer(expirationDuration: number){
    this.tokenExpirationTime = setTimeout(()=> {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogOutTimer(){
    if (this.tokenExpirationTime){
      clearTimeout(this.tokenExpirationTime);
      this.tokenExpirationTime = null;
    }
  }
}
