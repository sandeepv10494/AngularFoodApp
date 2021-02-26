import { User } from "../user.model";
import * as UserActions from './user.actions';

export interface State {
  user: User,
  userId: string
}

const initialState: State = {
  user:null,
  userId:null
}

export function UserReducer(state = initialState, action: UserActions.UserActions) {
  switch(action.type){
    case UserActions.FETCH_USER:
      return{
        ...state,
        userId: action.payload
      };
    case UserActions.SET_USER:
      return{
        ...state,
        user: {...action.payload}
      };
    case UserActions.ADD_NEW_USER:
      return{
        ...state,
        user: action.payload,
      };
    case UserActions.UPDATE_USER:
      return{
        ...state,
        userId: action.payload.userId,
        users: action.payload.updatedUser
      };
    default:
      return state;
  }
}
