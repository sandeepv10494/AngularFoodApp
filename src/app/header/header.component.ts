import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as UserActions from '../User/store/user.actions';
import { User } from '../User/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isUserAuthenticated = false;
  user: User = new User();
  cartItems: number = 0;
  private userSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ){}

  ngOnInit(){
    this.userSub = this.store.select('auth')
                             .pipe(map(authState => authState.user))
                             .subscribe(
                                user => {
                                this.isUserAuthenticated = !user ? false : true;
                              });
    this.setUser();
    this.fetchUser();
    this.setCartItemsCount();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onLogOut(){
    this.store.dispatch(new AuthActions.Logout);
  }

  fetchUser(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    this.store.dispatch(new UserActions.FetchUser(userData.id));
    this.setUser();
    this.setCartItemsCount();
  }

  setUser(){
    this.store.select('user')
    .pipe(map(userState => userState.user))
    .subscribe(
      user => {
        this.user = user;
      }
    );
  }

  setCartItemsCount(){
    if(this.user.cartItems.length === 0){
      this.cartItems = 0;
    }
    else {
      (this.user.cartItems).forEach(cartItem => {
          this.cartItems += cartItem.amount;
      });
    }
  }
}
