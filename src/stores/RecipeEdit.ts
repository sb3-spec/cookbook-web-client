import { writable } from "svelte/store";
import { Recipe } from "../utils/customTypes";

export const recipeEdit = writable<Recipe>(new Recipe());
