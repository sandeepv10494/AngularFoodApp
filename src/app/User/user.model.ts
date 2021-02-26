import { Ingredient } from "../shared/ingredient.model";

export class User {
  public userId:string;
  public name:string;
  public email:string;
  public gender:string;
  public phoneNumber:string;
  public homeAddress:string;
  public workAddress:string;
  public wishlistedRecipes: string[];
  public cartItems: Ingredient[];
  public orders: Ingredient[];


}
