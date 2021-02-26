import { Action } from "@ngrx/store";
import { User } from "../user.model";

export const SET_USER = '[User] Set User';
export const FETCH_USER = '[User] Fetch Users';
export const ADD_NEW_USER = '[User] Add New User';
export const UPDATE_USER = '[User] Update User';
export const DELETE_USER = '[User] Delete User';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User){}
}

export class FetchUser implements Action {
  readonly type = FETCH_USER;
  constructor(public payload: string){}
}

export class AddNewUser implements Action {
  readonly type = ADD_NEW_USER;
  constructor(public payload: User){}
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: {userId:string, updatedUser:User}){}
}

export class DeleteUser implements Action {
  readonly type = DELETE_USER;
  constructor(public payload: String){}
}

export type UserActions =
          AddNewUser
        | UpdateUser
        | DeleteUser
        | SetUser
        | FetchUser;
