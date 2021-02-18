import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  cuisineType: string = '';
  private storeSub: Subscription;

  cuisineTypes: any = ['South Indian', 'North Indian', 'Chinese', 'Italian', 'Japanese','Deserts', 'Others'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>
            ){ }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params)=>{
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  ngOnDestroy(){
    if (this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  changeCuine(e){
    this.cuisineType = e.target.value;
  }

  onSubmit(){
    console.log(this.recipeForm.value);
    if (this.editMode){
      this.store.dispatch(new RecipeActions.UpdateRecipe({index:this.id, newRecipe:this.recipeForm.value}));
    }
    else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.store.dispatch(new RecipeActions.StoreRecipes());
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddStep(){
    (<FormArray>this.recipeForm.get('steps')).push(
      new FormGroup({
        'name': new FormControl(null, [Validators.required])
      }),
    )
  }

  onDeleteStep(index: number){
    (<FormArray>this.recipeForm.get('steps')).removeAt(index);
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  get steps() {
    return (<FormArray>this.recipeForm.get('steps')).controls;
  }
  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeCuisineType = this.cuisineType;
    let recipeSteps = new FormArray([]);
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
    this.storeSub = this.store.select('recipes').pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe,index)=>{
            return index === this.id;
          })
        }))
      .subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        recipeCuisineType = recipe.cuisineType;

        if(recipe['steps']) {
          for (let step of recipe.steps) {
            recipeSteps.push(
              new FormGroup({
                'name': new FormControl(step.name, Validators.required),
              })
            );
          }
        }

        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            );
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'cuisineType': new FormControl(recipeCuisineType),
      'steps': recipeSteps,
      'ingredients': recipeIngredients
    });
  }
}
