import { writable } from "svelte/store";
import { Recipe } from "../utils/customTypes";

export const YourRecipesStore = writable<Recipe[]>([]);
