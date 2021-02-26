import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import * as fromApp from '../../store/app.reducer';
import * as UserActions from './user.actions';
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { User } from "../user.model";

export interface UserResponse {
  homeAddress:string;
  orders:[];
  userId:string;
  createdAt:string;
  phoneNumber:string;
  wishlistedRecipes:[];
  gender:string;
  cartItems:[];
  workAddress:string;
  email:string;
  name:string;
}

@Injectable()
export class UserEffects {

  @Effect()
  fetchUser = this.actions$.pipe(
    ofType(UserActions.FETCH_USER),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.get<UserResponse>('http://localhost:5000/food-app-7b748/us-central1/api/user/'+userState.userId)
    }),
    map(resData => {
       let user = new User();
       user.userId = resData.userId;
       user.name = resData.name;
       user.homeAddress = resData.homeAddress;
       user.email = resData.email;
       user.phoneNumber = resData.phoneNumber;
       user.workAddress = resData.workAddress;
       user.gender = resData.gender;
       user.cartItems = resData.cartItems;
       user.orders = resData.orders;
       user.wishlistedRecipes = resData.wishlistedRecipes;

       return user;
    }),
    map(user => {
      return new UserActions.SetUser(user);
    })
  )

  @Effect({dispatch: false})
  storeUsers = this.actions$.pipe(
    ofType(UserActions.ADD_NEW_USER),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.post(
        'http://localhost:5000/food-app-7b748/us-central1/api/user/addnew',
        {
          userId: userState.user.userId,
          name: userState.user.name,
          email: userState.user.email
        }
      );
    })
  )

  @Effect({dispatch:false})
  updateUsers = this.actions$.pipe(
    ofType(UserActions.UPDATE_USER),
    withLatestFrom(this.store.select('user')),
    switchMap(([actionData, userState]) => {
      return this.http.put(
        'http://localhost:5000/food-app-7b748/us-central1/api/user/'+userState.userId,
        userState.user
      );
    })
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ){}
}
