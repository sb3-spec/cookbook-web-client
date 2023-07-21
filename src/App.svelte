<script lang="ts">
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import Router from 'svelte-spa-router';

  import { app } from "./utils/firebase";
  import Navbar from './lib/Navbar.svelte';
  import Dashboard from "./pages/Dashboard.svelte";
  import Login from "./pages/Login.svelte";
  import NewRecipe from "./pages/NewRecipe.svelte";
  import { api } from "./utils/RecipeApi";
  import Recipe from "./pages/Recipe.svelte";
  import { frontendHost } from "./utils/hosts";
  import EditRecipe from "./pages/EditRecipe.svelte";
  import { UserStore } from "./stores/UserStore"
  import SignUp from "./pages/SignUp.svelte";
  import { createChef, getChef } from "./api/chef";
  import type { ParsleyAPIResponse } from "./utils/customTypes";
  import { YourRecipesStore } from "./stores/RecipeListStore";

  // VARS

  let errorCode;
  let errorMessage;
  let currentUser;

  const unsubscribe = UserStore.subscribe(data => {
    if (data != null) {
      currentUser = data;
    }
  });
   

  const routes = {
    '/': Dashboard,
    '/login': Login,
    '/new-recipe': NewRecipe,
    '/sign-up': SignUp,
    '/edit': EditRecipe,
    '/:recipeTitle': Recipe,
  }

  let auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    let response: ParsleyAPIResponse;
    if (user) {
      // user is signed in
      response = await getChef();
      if (response.status === 200) {
        sessionStorage.setItem("uid", user.uid);
        UserStore.set(response.chef);
      } else {
        response = await createChef({"username": user.displayName, "firebase_id": user.uid, "custom_tags": []});

        if (response.status == 200) {
          sessionStorage.setItem("uid", response.chef.firebase_id)
        }
      }
    } else {
      // user is signed out
      YourRecipesStore.set([]);
      window.location.replace(frontendHost + "#/login");
    }
    })


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
