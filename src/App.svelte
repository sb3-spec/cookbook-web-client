<script lang="ts">
  import {
    GoogleAuthProvider,
    browserSessionPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithPopup,
    type User,
  } from "firebase/auth";
  import Router from "svelte-spa-router";

  import { app } from "./utils/firebase";
  import Navbar from "./lib/Navbar.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Login from "./pages/Login.svelte";
  import NewRecipe from "./pages/NewRecipe.svelte";
  import { api } from "./utils/RecipeApi";
  import Recipe from "./pages/Recipe.svelte";
  import { frontendHost } from "./utils/hosts";
  import EditRecipe from "./pages/EditRecipe.svelte";
  import { UserStore } from "./stores/UserStore";
  import SignUp from "./pages/SignUp.svelte";
  import { createChef, getChef } from "./api/chef";
  import type { ParsleyAPIResponse } from "./utils/customTypes";
  import { YourRecipesStore } from "./stores/RecipeListStore";
  import { getRecipes } from "./api/recipe";
  import { CurrentRecipeStore } from "./stores/CurrentRecipe";

  // VARS

  let errorCode;
  let errorMessage;
  let currentUser = $UserStore;

  UserStore.subscribe((val) => {
    localStorage.setItem("chef", JSON.stringify(val));
  });

  CurrentRecipeStore.subscribe((data) => {
    localStorage.setItem("currentRecipe", JSON.stringify(data));
  });

  const routes = {
    "/": Dashboard,
    "/login": Login,
    "/new-recipe": NewRecipe,
    "/sign-up": SignUp,
    "/edit": EditRecipe,
    "/:recipeTitle": Recipe,
  };

  async function fetchOrCreateChef(user: User) {
    let response: ParsleyAPIResponse;
    // user is signed in
    response = await getChef();

    if (response.status !== 200) {
      response = await createChef({
        username: user.displayName,
        firebase_id: user.uid,
        custom_tags: [],
      });
    }
    return response;
  }

  let auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await fetchOrCreateChef(user);
    } else {
      // user is signed out
      UserStore.set(null);
      YourRecipesStore.set([]);
      window.location.replace(frontendHost + "#/login");
    }
  });
</script>

<main>
  <Navbar />
  <Router {routes} />
</main>

<style>
  main {
    min-height: 100vh;
    width: 100%;
  }

  main::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  main::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  main::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  main::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
