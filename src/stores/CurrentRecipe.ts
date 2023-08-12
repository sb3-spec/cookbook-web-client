import { writable } from "svelte/store";
import { Recipe } from "../utils/customTypes";

export const CurrentRecipeStore = writable<Recipe>(
  JSON.parse(localStorage.getItem("currentRecipe"))
);
