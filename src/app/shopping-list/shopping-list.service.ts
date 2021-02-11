import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {

    ingredientsChanges = new Subject<Ingredient[]>();

    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Potatoes',10),
        new Ingredient('Onions', 20),
      ];

    getIngredients(){
        return this.ingredients.slice();
    }

    getIngredient(index: number){
      return this.ingredients[index];
    }

    addIngredient(ingredient:Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanges.next(this.ingredients.slice());
    }

    addIngredients(ingredient:Ingredient[]){
       this.ingredients.push(...ingredient);
       this.ingredientsChanges.next(this.ingredients.slice());
    }

    editIngredient(index: number, editedIngredient: Ingredient){
      this.ingredients[index] = editedIngredient;
      this.ingredientsChanges.next(this.ingredients.slice());
    }

    deleteIngredient(index: number){
      this.ingredients.splice(index, 1);
      this.ingredientsChanges.next(this.ingredients.slice());
    }
}
