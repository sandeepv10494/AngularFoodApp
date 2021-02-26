import { Injectable } from "@angular/core";
import { User } from "./user.model";
import * as fromApp from "../store/app.reducer";
import * as UserActions from "./store/user.actions";
import { Store } from "@ngrx/store";

@Injectable()
export class UserService {
   user: User = new User();

   constructor(private store: Store<fromApp.AppState>) {}

   setUserDetails(name: string, email: string){
     this.user.name = name;
     this.user.email = email;
   }

   registerUser(id:string){
     this.user.userId = id;
     console.log(this.user);
     this.store.dispatch(new UserActions.AddNewUser(this.user));
     this.store.dispatch(new UserActions.FetchUser(id));
   }

   getUser(id:string){
     console.log(id);
     this.store.dispatch(new UserActions.FetchUser(id));
   }

}
