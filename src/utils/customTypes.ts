export interface RecipeInterface {
  id?: number;
  title: string;
  header: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  image_url: string;
}

export interface ChefInterface {
  firebase_id: string;
  username?: string;
  custom_tags: string[];
}

export class Chef implements ChefInterface {
  firebase_id: string = "";
  username: string = "";
  custom_tags: string[] = [];

  constructor(chef: ChefInterface) {
    this.firebase_id = chef.firebase_id;
    this.username = chef.username;
    this.custom_tags = chef.custom_tags;
  }
}

export class Recipe implements RecipeInterface {
  id: number;
  title: string = "";
  header: string = "";
  prep_time: string = "";
  cook_time: string = "";
  total_time: string = "";
  ingredients: string[] = [""];
  steps: string[] = [""];
  tags: string[] = [];
  image_url: string = "";

  constructor(recipe?: RecipeInterface) {
    if (recipe == null) {
      return;
    }
    this.id = recipe.id;
    this.title = recipe.title;
    this.header = recipe.header;
    this.prep_time = recipe.prep_time;
    this.cook_time = recipe.cook_time;
    this.total_time = recipe.total_time;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.steps = recipe.steps;
    this.image_url = recipe.image_url;
  }
}

interface ParsleyAPIResponseInterface {
  status: number;
  message: string;
  recipe?: Recipe;
  recipes?: Recipe[];
  chef?: Chef;
  parseError(err: Error): void;
}

export class ParsleyAPIResponse implements ParsleyAPIResponseInterface {
  status: number = 200;
  message: string = "OK";
  recipe: Recipe;
  recipes: Recipe[];
  chef: Chef;

  parseError(err: any): void {
    if (err instanceof Error) {
      this.message = err.message;
      this.status = 404;
    } else {
      this.message = "Unable to parse error";
      this.status = 406;
    }
  }
}
