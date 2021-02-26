import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Recipe } from "../recipe.model";

import * as fromAppState from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipes-manage',
  templateUrl: './recipes-manage.component.html',
  styleUrls: ['./recipes-manage.component.css']
})
export class RecipesManageComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  id: number;
  deleteRecipeName: string;
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromAppState.AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
    this.subscription = this.store.select('recipes')
    .pipe(map(recipeState => recipeState.recipes))
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );

  }

  onNewRecipe(){
    this.router.navigate(['recipes/new']);
  }

  toRecipeDetails(index: number){
    this.id = index;
    this.router.navigate(['recipes/'+this.id]);
  }

  onEditRecipe(index: number){
    this.id = index;
    this.router.navigate(['recipes/'+index+'/edit']);
  }

  onDeleteRecipe(index: number, recipeName: string){
    this.id = index;
    this.deleteRecipeName = recipeName;
  }

  confirmDelete(){
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['recipes/managerecipes']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
