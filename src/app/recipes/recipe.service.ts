import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();

    /*private recipes: Recipe[] = [
        new Recipe(
            'Masala Dose',
            'Famous south indian recipe',
            'https://www.cookwithmanali.com/wp-content/uploads/2020/05/Masala-Dosa-500x500.jpg',
            [
                new Ingredient('Potatoes', 3),
                new Ingredient('Onions', 5),
                new Ingredient('Coconut', 1),
                new Ingredient('Dosa-batter', 1)
            ]
        ),
        new Recipe(
            'Idli Vada',
            'Go to south indian breakfast',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Idly_sambar_vada.JPG/240px-Idly_sambar_vada.JPG',
            [
                new Ingredient('Onions', 5),
                new Ingredient('Coconut', 1),
                new Ingredient('Green chilly', 5),
                new Ingredient('Idli-batter', 1),
                new Ingredient('Vada-batter', 1)
            ]
        )
      ];*/
      private recipes: Recipe[] = [];

    constructor(private slService:ShoppingListService){}

    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes;
      this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipeById(index: number){
      return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients:Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
    }

    editRecipe(index: number, editedRecipe: Recipe){
      this.recipes[index] = editedRecipe;
      this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
      this.recipes.splice(index,1);
      this.recipesChanged.next(this.recipes.slice());
    }
}
