import { Ingredient } from "../shared/ingredient.model";
import { RecipeStep } from "./recipestep.model";

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public cuisineType: string;
    public steps: RecipeStep[];
    public ingredients: Ingredient[];

    constructor(name: string, desc: string, imagePath: string, cuisineType: string, steps: RecipeStep[],ingredients: Ingredient[]){
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.cuisineType = cuisineType;
        this.steps = steps;
        this.ingredients = ingredients;
    }
}
