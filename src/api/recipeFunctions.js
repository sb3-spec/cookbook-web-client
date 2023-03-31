import { getAuth } from "firebase/auth";
import { api } from ".";

export const getRecipes = async () => {

    let auth = getAuth();

    let user_id = auth.currentUser?.uid || "";

    if (user_id === "") {
        return [];
    }

    const config = {
        'headers': {
            'X-Auth-Token': user_id
        }
    }

    let recipes;

    
    try {
        recipes = await api.get('chefs/recipes', config);
        recipes = recipes.data.data;
        console.log(recipes);
        

    } catch (e) {
        alert('Error fetching recipes: ' + e.message);
        recipes = [];
    }

    return recipes;

}

export const getRecipesByTag = async (tag) => {
    let auth = getAuth();

    let user_id = auth.currentUser?.uid || "";

    if (user_id === "") {
        return [];
    }

    const config = {
        'headers': {
            'X-Auth-Token': user_id
        }
    }

    let recipes;

    
    try {
        recipes = await api.get('recipes/tags/' + tag, config);
        recipes = recipes.data.data;
        console.log(recipes);
        

    } catch (e) {
        alert('Error fetching recipes: ' + e.message);
        recipes = [];
    }

    return recipes;
}