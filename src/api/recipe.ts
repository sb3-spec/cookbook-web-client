import { getAuth } from "firebase/auth";
import { api } from ".";
import { app } from "../utils/firebase";
import { UserStore } from "../stores/UserStore";
import { Chef, Recipe, type RecipeInterface } from "../utils/customTypes";
import { CurrentRecipeStore } from "../stores/CurrentRecipe";
import { frontendHost } from "../utils/hosts";
import { uploadImage } from "../utils/uploadImage";
import type { AxiosResponse } from "axios";
import { ParsleyAPIResponse } from "../utils/customTypes";

function getAuthConfig() {
  return {
    headers: {
      "X-AUTH-TOKEN": getAuth(app).currentUser?.uid || "",
    },
  };
}

export async function getRecipes(): Promise<ParsleyAPIResponse> {
  let response = new ParsleyAPIResponse();

  let auth = getAuth(app);

  console.log(getAuthConfig());
  try {
    response.recipes = (
      await api.get("chefs/recipes", getAuthConfig())
    ).data?.data.map((recipe: RecipeInterface) => new Recipe(recipe));
  } catch (e) {
    response.parseError(e);
  }

  return response;
}

export const getRecipesByTag = async (tag) => {
  let auth = getAuth(app);

  let user_id = auth.currentUser?.uid || "";

  if (user_id === "") {
    return [];
  }

  const config = {
    headers: {
      "X-Auth-Token": user_id,
    },
  };

  let recipes;

  try {
    recipes = await api.get("recipes/tags/" + tag, config);
    recipes = recipes.data.data;
    console.log(recipes);
  } catch (e) {
    alert("Error fetching recipes: " + e.message);
    recipes = [];
  }

  return recipes;
};

export async function createRecipe(recipe: Recipe): Promise<Object> {
  let result: AxiosResponse;

  if (recipe.image_url && !recipe.image_url.startsWith("https://")) {
    recipe.image_url = await uploadImage(recipe.image_url);
  }

  try {
    result = await api.post("recipes", recipe, getAuthConfig());
  } catch (err) {
    return { errorMessage: err.message, errorCode: err.code };
  }

  if (result.status === 200) {
    alert("Recipe created successfully");
    CurrentRecipeStore.set(result.data.data);
    window.location.replace(frontendHost + "#/" + result.data.data.title);
  }

  return result.data.data;
}

export async function patchRecipe(recipe: Recipe): Promise<Object> {
  let result: AxiosResponse;

  if (recipe.image_url && !recipe.image_url.startsWith("https://")) {
    recipe.image_url = await uploadImage(recipe.image_url);
  }

  try {
    result = await api.patch(`recipes/${recipe.id}`, recipe, getAuthConfig());
  } catch (err) {
    return { errorMessage: err.message, errorCode: err.code };
  }

  if (result.status === 200) {
    alert("Recipe created successfully");
    CurrentRecipeStore.set(result.data.data);
    window.location.replace(frontendHost + "#/" + result.data.data.title);
  }

  return result.data.data;
}

export async function deleteRecipe(
  recipeId: number
): Promise<ParsleyAPIResponse> {
  let result = new ParsleyAPIResponse();

  if (recipeId == null) {
    result.message = "No recipe id provided";
    result.status = 404;
    return result;
  }
  try {
    await api.delete(`recipes/${recipeId}`, getAuthConfig());
    result.message = `Recipe successfully deleted`;
    result.recipe = new Recipe();
  } catch (err) {
    result.parseError(err);
  }
  return result;
}
