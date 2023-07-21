import { writable } from "svelte/store";
import { Recipe } from "../utils/customTypes";

let recipe = new Recipe();

export const CurrentRecipeStore = writable(recipe);
