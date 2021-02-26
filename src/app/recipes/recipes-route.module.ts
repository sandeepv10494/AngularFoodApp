import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth-guard";
import { RecipeDetailsComponent } from "./recipe-details/recipe-details.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeResolverService } from "./recipe-resolver.service";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesManageComponent } from "./recipes-manage/recipes-manage.component";
import { RecipesComponent } from "./recipes.component";


const recipeRoutes: Routes = [
  { path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children:[
    { path: '', component: RecipeStartComponent},
  ]},
  { path: 'managerecipes', component: RecipesManageComponent, canActivate: [AuthGuard]},
  { path: 'new', component:RecipeEditComponent, canActivate: [AuthGuard]},
  { path: ':id', component: RecipeDetailsComponent, canActivate: [AuthGuard], resolve:[RecipeResolverService]},
  { path: ':id/edit', component: RecipeEditComponent, canActivate: [AuthGuard], resolve:[RecipeResolverService]},
]

@NgModule({
  imports: [RouterModule.forChild(recipeRoutes)],
  exports: [RouterModule]
})
export class RecipeRouteModule {}
